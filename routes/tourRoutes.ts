import express from 'express';
import { ID } from './variables';
import * as tourController from '../controllers/tourController';
import reviewRouter from './reviewRoutes';
import { onlyAuthorized } from '../controllers/handlerFactory';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    onlyAuthorized(['admin', 'lead-guide', 'guide']),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(onlyAuthorized(['admin', 'lead-guide']), tourController.createTour);

router
  .route(ID)
  .get(tourController.getTour)
  .patch(
    onlyAuthorized(['admin', 'lead-guide']),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(onlyAuthorized(['admin', 'lead-guide']), tourController.deleteTour);

export default router;
