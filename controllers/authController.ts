import { promisify } from 'util';
import User from '../models/userModel';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';
import Email from '../utils/email';
import crypto from 'crypto';
import { CustomRequest } from '../@types/merged';

export const signToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN!;

  return jwt.sign({ id }, jwtSecret, { expiresIn });
};

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  const jwtCookiesExpiresIn = +process.env.JWT_COOKIE_EXPIRES_IN!;
  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie('jwt', token, {
    expires: new Date(Date.now() + jwtCookiesExpiresIn * oneDay),
    secure: process.env.NODE_ENV === 'production' ? true : undefined, // set to true in production
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      photo: req.body.photo,
      role: req.body.role,
    });

    const url = `${req.protocol}://${req.get('host')}/me`;
    console.log(url);
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password)
      return next(new AppError('Please provide email and password!', 400));

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    console.log(user);

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('Incorrect email or password', 401));

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  }
);

export const logout = (_req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: 'success' });
};

export const protect = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer'))
      token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );

    // 2) Verification token
    const { id, iat } = (await promisify<string, string>(jwt.verify)(
      token,
      process.env.JWT_SECRET as string
    )) as unknown as JWTLoginType;

    // 3) Check if user still exists
    const currentUser = await User.findById(id);
    if (!currentUser)
      return next(
        new AppError(
          'The user belonging to this token does no longer exist.',
          401
        )
      );

    // 4) Check if user changed password after the JWToken was issued
    if (currentUser.changedPasswordAfter(iat))
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
  }
);

// Only for rendered pages, no errors!
export const isLoggedIn = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.jwt) {
    try {
      // Verification token
      const { id, iat } = (await promisify<string, string>(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET as string
      )) as unknown as JWTLoginType;

      // Check if user still exists
      const currentUser = await User.findById(id);
      if (!currentUser) return next();

      // Check if user changed password after the JWToken was issued
      if (currentUser.changedPasswordAfter(iat)) return next();

      // There is a logged in user
      res.locals.user = currentUser;
      req.user = currentUser;
    } catch (err) {
      return next();
    }
  }
  next();
};

export const restrictTo = (...roles: string[]) => {
  return (req: CustomRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );

    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(new AppError('There is no user with email address.', 404));

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;

      await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    console.log(hashedToken);

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiresAt: { $gt: Date.now() },
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user)
      return next(new AppError('Token is invalid or has expired', 400));

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user = await User.findById(req.user?.id).select('+password');

    if (user === null) return next(new AppError('User not found', 404));

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
      return next(new AppError('Your current password is wrong.', 401));

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  }
);
