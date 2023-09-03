import express from 'express';
import * as viewsController from '../controllers/viewsController';
import * as authController from '../controllers/authController';
import * as bookingController from '../controllers/bookingController';

export const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/signup', authController.isLoggedIn, viewsController.signup);
router.get('/my-tours', authController.isLoggedIn, viewsController.getMyTours);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

export default router;
