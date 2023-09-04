"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const tourSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A tour must have less or equal than 40 characters'],
        minlength: [10, 'A tour must have more or equal than 10 characters'],
        // validate: [validator.isAlpha, 'Tour name must only contain characters'], // not useful because it doesn't allow spaces
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            // only works for strings
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium, difficult',
        },
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'A tour must have a rating above 1.0'],
        max: [5, 'A tour must have a rating below 5.0'],
        set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.66666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price',
        },
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now,
        select: false, // Hide this field from the output
    },
    startDates: [Date],
    slug: String,
    secretTour: {
        type: Boolean,
        default: false,
    },
    startLocation: {
        // GeoJSON
        type: {
            type: String,
            default: 'Point',
            enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
    },
    locations: [
        // Embedded documents
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number,
        },
    ],
    guides: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});
tourSchema.pre('save', function (next) {
    this.slug = (0, slugify_1.default)(this.name, { lower: true });
    next();
});
tourSchema.pre(/^find/, function (next) {
    // @ts-ignore
    this.find({ secretTour: { $ne: true } });
    // @ts-ignore
    this.start = Date.now();
    next();
});
tourSchema.pre(/^find/, function (next) {
    // @ts-ignore
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
    next();
});
tourSchema.pre('aggregate', function (next) {
    var _a;
    if ((_a = this.pipeline()[0]) === null || _a === void 0 ? void 0 : _a.$geoNear)
        return next();
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
    next();
});
const Tour = mongoose_1.default.model('Tour', tourSchema);
exports.default = Tour;
//# sourceMappingURL=tourModel.js.map