import mongoose from 'mongoose';
import Tour from './tourModel';
import User from './userModel';

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Tour,
    required: [true, 'Booking must belong to a tour'],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: [true, 'Booking must belong to a user'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  // @ts-ignore
  this.populate('user').populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
