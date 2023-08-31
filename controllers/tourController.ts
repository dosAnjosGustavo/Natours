import { CustomRequest } from '../@types/merged';
import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tourModel';
import catchAsync from '../utils/catchAsync';
import * as factory from './handlerFactory';
import AppError from '../utils/appError';
import multer from 'multer';
import sharp from 'sharp';

// Route Handlers
export const getAllTours = factory.getAll(Tour);
export const getTour = factory.getOne(Tour, { path: 'reviews' });
export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);

const storage = multer.memoryStorage();

const fileFilter = (
  _req: CustomRequest,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images.', 400));
};

const upload = multer({ storage, fileFilter });

export const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourImages = catchAsync(
  async (req: CustomRequest, _res: Response, next: NextFunction) => {
    console.log(req.files);

    if (!req.files.imageCover || !req.files?.images) return next();

    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (file: Express.Multer.File, i: number) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(filename);
      })
    );

    console.log(req.body);

    next();
  }
);

export const aliasTopTours = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

export const getTourStats = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
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

export const getMonthlyPlan = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
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

export const getToursWithin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    // radius of earth in miles or kilometers
    const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1;

    if (!lat || !lng) {
      throw new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      );
    }

    const tours = await Tour.find({
      startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res
      .status(200)
      .json({ status: 'success', results: tours.length, data: { tours } });
  }
);

export const getDistances = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    if (!lat || !lng) {
      throw new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400
      );
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [+lng, +lat],
          },
          distanceField: 'distance',
          distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001, // convert to miles or kilometers
          key: 'startLocation',
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { data: distances } });
  }
);
