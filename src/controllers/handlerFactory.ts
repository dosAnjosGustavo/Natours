import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { Model } from 'mongoose';
import APIFeatures from '../utils/apiFeatures';
import * as authController from '../controllers/authController';

export const onlyAuthorized = (roles: string | string[]) =>
  roles
    ? [authController.protect, authController.restrictTo(...roles)]
    : [authController.protect];

export const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({ status: 'success', data: null });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { data: newDoc } });
  });

export const getOne = (
  Model: Model<any>,
  popOptions?: { path: string; select?: string }
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query.populate(popOptions);
    const doc = await query;

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

export const getAll = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const feature = await new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await feature.query.explain();
    const doc = await feature.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { data: doc },
    });
  });
