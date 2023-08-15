import { CustomRequest } from '../@types/merged';
import { Response, NextFunction } from 'express';
import Review from '../models/reviewModel';
import * as factory from './handlerFactory';

export const setTourUserIds = (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
