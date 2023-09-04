"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.isLoggedIn = exports.protect = exports.logout = exports.login = exports.signup = exports.signToken = void 0;
const util_1 = require("util");
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const email_1 = __importDefault(require("../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const signToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN;
    return jsonwebtoken_1.default.sign({ id }, jwtSecret, { expiresIn });
};
exports.signToken = signToken;
const createSendToken = (user, statusCode, res) => {
    const token = (0, exports.signToken)(user._id);
    // Remove password from output
    user.password = undefined;
    const jwtCookiesExpiresIn = +process.env.JWT_COOKIE_EXPIRES_IN;
    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie('jwt', token, {
        expires: new Date(Date.now() + jwtCookiesExpiresIn * oneDay),
        secure: process.env.NODE_ENV === 'production' ? true : undefined,
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
exports.signup = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        photo: req.body.photo,
        role: req.body.role,
    });
    const url = `${req.protocol}://${req.get('host')}/me`;
    yield new email_1.default(newUser, url).sendWelcome();
    createSendToken(newUser, 201, res);
}));
exports.login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // 1) Check if email and password exist
    if (!email || !password)
        return next(new appError_1.default('Please provide email and password!', 400));
    // 2) Check if user exists && password is correct
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    if (!user || !(yield user.correctPassword(password, user.password)))
        return next(new appError_1.default('Incorrect email or password', 401));
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
}));
const logout = (_req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};
exports.logout = logout;
exports.protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1) Getting token and check of it's there
    let token;
    if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer'))
        token = req.headers.authorization.split(' ')[1];
    else if (req.cookies.jwt)
        token = req.cookies.jwt;
    if (!token)
        return next(new appError_1.default('You are not logged in! Please log in to get access.', 401));
    // 2) Verification token
    const { id, iat } = (yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(token, process.env.JWT_SECRET));
    // 3) Check if user still exists
    const currentUser = yield userModel_1.default.findById(id);
    if (!currentUser)
        return next(new appError_1.default('The user belonging to this token does no longer exist.', 401));
    // 4) Check if user changed password after the JWToken was issued
    if (currentUser.changedPasswordAfter(iat))
        return next(new appError_1.default('User recently changed password! Please log in again.', 401));
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
}));
// Only for rendered pages, no errors!
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.cookies.jwt) {
        try {
            // Verification token
            const { id, iat } = (yield (0, util_1.promisify)(jsonwebtoken_1.default.verify)(req.cookies.jwt, process.env.JWT_SECRET));
            // Check if user still exists
            const currentUser = yield userModel_1.default.findById(id);
            if (!currentUser)
                return next();
            // Check if user changed password after the JWToken was issued
            if (currentUser.changedPasswordAfter(iat))
                return next();
            // There is a logged in user
            res.locals.user = currentUser;
            req.user = currentUser;
        }
        catch (err) {
            return next();
        }
    }
    next();
});
exports.isLoggedIn = isLoggedIn;
const restrictTo = (...roles) => {
    return (req, _res, next) => {
        if (!roles.includes(req.user.role))
            return next(new appError_1.default('You do not have permission to perform this action', 403));
        next();
    };
};
exports.restrictTo = restrictTo;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on POSTed email
    const user = yield userModel_1.default.findOne({ email: req.body.email });
    if (!user)
        return next(new appError_1.default('There is no user with email address.', 404));
    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    // 3) Send it to user's email
    try {
        const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        yield new email_1.default(user, resetURL).sendPasswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    }
    catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpiresAt = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get user based on the token
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield userModel_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiresAt: { $gt: Date.now() },
    });
    // 2) If token has not expired, and there is user, set the new password
    if (!user)
        return next(new appError_1.default('Token is invalid or has expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    yield user.save();
    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
}));
exports.updatePassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // 1) Get user from collection
    const user = yield userModel_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b.id).select('+password');
    if (user === null)
        return next(new appError_1.default('User not found', 404));
    // 2) Check if POSTed current password is correct
    if (!(yield user.correctPassword(req.body.passwordCurrent, user.password)))
        return next(new appError_1.default('Your current password is wrong.', 401));
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    yield user.save();
    // User.findByIdAndUpdate will NOT work as intended!
    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
}));
//# sourceMappingURL=authController.js.map