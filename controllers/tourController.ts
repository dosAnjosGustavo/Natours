import express, { NextFunction } from 'express';
import Tour from '../models/tourModel';
import APIFeatures from '../utils/apiFeatures';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

// Route Handlers
// Alias Top Tours
const aliasTopTours = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Get All Tours
const getAllTours = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    // Execute query
    const feature = await new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await feature.query;

    // Send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  }
);

// Get Tour by ID
const getTourById = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id });

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    res.status(200).json({ status: 'success', data: { tour } });
  }
);

// Create Tour
const createTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { tour: newTour } });
  }
);

// Update Tour
const updateTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    res.status(200).json({ status: 'success', data: { tour } });
  }
);

// Delete Tour
const deleteTour = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    res.status(204).json({ status: 'success', data: null });
  }
);

const getTourStats = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 }, // add 1 for each document
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' }, // average of ratingsAverage
          avgPrice: { $avg: '$price' }, // average of price
          minPrice: { $min: '$price' }, // minimum price
          maxPrice: { $max: '$price' }, // maximum price
        },
      },
      {
        $sort: { avgPrice: 1 }, // 1 for ascending
      },
      // { $match: { _id: { $ne: 'EASY' } } }, // $ne = not equal
    ]);

    res.status(200).json({ status: 'success', data: { stats } });
  }
);

const getMonthlyPlan = catchAsync(
  async (req: express.Request, res: express.Response, next: NextFunction) => {
    const year = +req.params.year; //

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', // deconstructs an array field from the input documents to output a document for each element
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`), // greater than or equal to
            $lte: new Date(`${year}-12-31`), // less than or equal to
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // group by month
          numTourStarts: { $sum: 1 }, // add 1 for each document
          tours: { $push: '$name' }, // push name of tour into tours array
        },
      },
      {
        $addFields: { month: '$_id' }, // add month field
      },
      {
        $project: {
          _id: 0, // hide _id field
        },
      },
      {
        $sort: { numTourStarts: -1 }, // could be sort by month, for example
      },
      {
        $limit: 12, // limit to 12 documents
      },
    ]);

    res.status(200).json({ status: 'success', data: { plan } });
  }
);

export {
  aliasTopTours,
  getAllTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
