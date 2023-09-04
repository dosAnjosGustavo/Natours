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
const mongoose_1 = __importDefault(require("mongoose"));
const tourModel_1 = __importDefault(require("./tourModel"));
const userModel_1 = __importDefault(require("./userModel"));
const reviewSchema = new mongoose_1.default.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty!'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    tour: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: tourModel_1.default,
        required: [true, 'Review must belong to a tour.'],
    },
    user: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: userModel_1.default,
        required: [true, 'Review must belong to a user.'],
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });
reviewSchema.pre(/^find/, function (next) {
    // @ts-ignore
    this.populate({
        path: 'user',
        select: 'name photo',
    });
    next();
});
reviewSchema.statics.calcAverageRatings = function (tourId) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield this.aggregate([
            {
                $match: { tour: tourId },
            },
            {
                $group: {
                    _id: '$tour',
                    nRating: { $sum: 1 },
                    avgRating: { $avg: '$rating' },
                },
            },
        ]);
        yield tourModel_1.default.findByIdAndUpdate(tourId, {
            ratingsQuantity: (_b = (_a = stats[0]) === null || _a === void 0 ? void 0 : _a.nRating) !== null && _b !== void 0 ? _b : 0,
            ratingsAverage: (_d = (_c = stats[0]) === null || _c === void 0 ? void 0 : _c.avgRating) !== null && _d !== void 0 ? _d : 4.5,
        });
    });
};
reviewSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.constructor.calcAverageRatings(this.tour);
        next();
    });
});
reviewSchema.post(/^findOneAnd|save/, function (docs) {
    return __awaiter(this, void 0, void 0, function* () {
        if (docs.tour)
            yield docs.constructor.calcAverageRatings(docs.tour);
    });
});
const Review = mongoose_1.default.model('Review', reviewSchema);
exports.default = Review;
//# sourceMappingURL=reviewModel.js.map