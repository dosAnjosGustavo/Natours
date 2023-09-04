"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.getDistances = exports.getToursWithin = exports.getMonthlyPlan = exports.getTourStats = exports.aliasTopTours = exports.resizeTourImages = exports.uploadTourImages = exports.deleteTour = exports.updateTour = exports.createTour = exports.getTour = exports.getAllTours = void 0;
const tourModel_1 = __importDefault(require("../models/tourModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const factory = __importStar(require("./handlerFactory"));
const appError_1 = __importDefault(require("../utils/appError"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
// Route Handlers
exports.getAllTours = factory.getAll(tourModel_1.default);
exports.getTour = factory.getOne(tourModel_1.default, { path: 'reviews' });
exports.createTour = factory.createOne(tourModel_1.default);
exports.updateTour = factory.updateOne(tourModel_1.default);
exports.deleteTour = factory.deleteOne(tourModel_1.default);
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image'))
        cb(null, true);
    else
        cb(new appError_1.default('Not an image! Please upload only images.', 400));
};
const upload = (0, multer_1.default)({ storage, fileFilter });
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
]);
exports.resizeTourImages = (0, catchAsync_1.default)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!req.files.imageCover || !((_a = req.files) === null || _a === void 0 ? void 0 : _a.images))
        return next();
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    yield (0, sharp_1.default)(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);
    req.body.images = [];
    yield Promise.all(req.files.images.map((file, i) => __awaiter(void 0, void 0, void 0, function* () {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        yield (0, sharp_1.default)(file.buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`);
        req.body.images.push(filename);
    })));
    next();
}));
const aliasTopTours = (req, _res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage, price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};
exports.aliasTopTours = aliasTopTours;
exports.getTourStats = (0, catchAsync_1.default)((_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield tourModel_1.default.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }, // maximum price
            },
        },
        {
            $sort: { avgPrice: 1 }, // 1 for ascending
        },
        // { $match: { _id: { $ne: 'EASY' } } }, // $ne = not equal
    ]);
    res.status(200).json({ status: 'success', data: { stats } });
}));
exports.getMonthlyPlan = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const year = +req.params.year; //
    const plan = yield tourModel_1.default.aggregate([
        {
            $unwind: '$startDates', // deconstructs an array field from the input documents to output a document for each element
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`), // less than or equal to
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
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
}));
exports.getToursWithin = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    // radius of earth in miles or kilometers
    const radius = unit === 'mi' ? +distance / 3963.2 : +distance / 6378.1;
    if (!lat || !lng) {
        throw new appError_1.default('Please provide latitude and longitude in the format lat,lng.', 400);
    }
    const tours = yield tourModel_1.default.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });
    res
        .status(200)
        .json({ status: 'success', results: tours.length, data: { tours } });
}));
exports.getDistances = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    if (!lat || !lng) {
        throw new appError_1.default('Please provide latitude and longitude in the format lat,lng.', 400);
    }
    const distances = yield tourModel_1.default.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [+lng, +lat],
                },
                distanceField: 'distance',
                distanceMultiplier: unit === 'mi' ? 0.000621371 : 0.001,
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
}));
//# sourceMappingURL=tourController.js.map