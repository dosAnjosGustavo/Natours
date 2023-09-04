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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const viewsController = __importStar(require("../controllers/viewsController"));
const authController = __importStar(require("../controllers/authController"));
const bookingController = __importStar(require("../controllers/bookingController"));
exports.router = express_1.default.Router();
exports.router.get('/', bookingController.createBookingCheckout, authController.isLoggedIn, viewsController.getOverview);
exports.router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
exports.router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
exports.router.get('/me', authController.protect, viewsController.getAccount);
exports.router.get('/signup', authController.isLoggedIn, viewsController.signup);
exports.router.get('/my-tours', authController.isLoggedIn, viewsController.getMyTours);
// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );
exports.default = exports.router;
//# sourceMappingURL=viewRoutes.js.map