import { Request, Response, NextFunction } from 'express';
import Review from '../models/reviewModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { CustomRequest } from '../@types/merged';

export const getAllReviews = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const reviews = await Review.find();

    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: { reviews },
    });
  }
);

export const createReview = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({ status: 'success', data: { review: newReview } });
  }
);
