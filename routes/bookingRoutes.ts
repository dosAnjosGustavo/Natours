import express from 'express';
import * as bookingController from '../controllers/bookingController';
import * as authController from '../controllers/authController';

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

export default router;
