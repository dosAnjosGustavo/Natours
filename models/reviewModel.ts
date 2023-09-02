import mongoose from 'mongoose';
import Tour from './tourModel';
import User from './userModel';

const reviewSchema = new mongoose.Schema<ReviewDocument>(
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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0]?.nRating ?? 0,
    ratingsAverage: stats[0]?.avgRating ?? 4.5,
  });
};

reviewSchema.pre('save', async function (this: ReviewModel, next) {
  this.constructor.calcAverageRatings(this.tour as string);
  next();
});

reviewSchema.post(/^findOneAnd|save/, async function (docs) {
  if (docs.tour) await docs.constructor.calcAverageRatings(docs.tour);
});

const Review = mongoose.model<ReviewDocument>('Review', reviewSchema);
export default Review;
