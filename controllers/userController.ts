import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomRequest } from '../@types/merged';

// Route Handlers
const filterObj = (obj: any, ...allowedFields: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el: string) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// Get All Users
export const getAllUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const users = await User.find();

    // Send response
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users },
    });
  }
);

export const updateMe = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm)
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );

    // 2) Filter out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

// Get User by ID
export const getUserById = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Create User
export const createUser = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Update User
export const updateUser = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

// Delete User
export const deleteUser = (_req: Request, res: Response) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
