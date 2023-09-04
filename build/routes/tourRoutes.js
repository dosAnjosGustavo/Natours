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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const variables_1 = require("./variables");
const tourController = __importStar(require("../controllers/tourController"));
const reviewRoutes_1 = __importDefault(require("./reviewRoutes"));
const handlerFactory_1 = require("../controllers/handlerFactory");
const router = express_1.default.Router();
router.use('/:tourId/reviews', reviewRoutes_1.default);
router
    .route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router
    .route('/monthly-plan/:year')
    .get((0, handlerFactory_1.onlyAuthorized)(['admin', 'lead-guide', 'guide']), tourController.getMonthlyPlan);
router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);
router
    .route('/')
    .get(tourController.getAllTours)
    .post((0, handlerFactory_1.onlyAuthorized)(['admin', 'lead-guide']), tourController.createTour);
router
    .route(variables_1.ID)
    .get(tourController.getTour)
    .patch((0, handlerFactory_1.onlyAuthorized)(['admin', 'lead-guide']), tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)
    .delete((0, handlerFactory_1.onlyAuthorized)(['admin', 'lead-guide']), tourController.deleteTour);
exports.default = router;
//# sourceMappingURL=tourRoutes.js.map