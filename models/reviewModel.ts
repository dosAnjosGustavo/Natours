import mongoose, { Schema, Document, Model } from 'mongoose';
import Tour from './tourModel';
import User from './userModel';

interface ReviewType {
  tour: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  user: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    photo: string;
  };

  review: string;
  rating: number;
  createdAt: Date;
}

interface ReviewModel extends mongoose.Model<ReviewType> {
  calcAverageRatings(tourId: mongoose.Schema.Types.ObjectId): Promise<void>;
}

interface ReviewTypeMethods extends mongoose.Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<ReviewType>(
  {
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
      type: mongoose.Schema.ObjectId,
      ref: Tour,
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: User,
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
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

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRating ?? 0,
    ratingsAverage: stats[0]?.avgRating ?? 4.5,
  });
};

reviewSchema.pre('save', async function (next) {
  // @ts-ignore
  this.constructor.calcAverageRatings(this.tour);
  next();
});

reviewSchema.post(/^findOneAnd|save/, async function (docs) {
  if (docs.tour) await docs.constructor.calcAverageRatings(docs.tour);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
