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
exports.deleteBooking = exports.updateBooking = exports.getAllBookings = exports.getBooking = exports.createBooking = exports.createBookingCheckout = exports.getCheckoutSession = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
const stripe_1 = __importDefault(require("stripe"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const factory = __importStar(require("./handlerFactory"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-16',
});
exports.getCheckoutSession = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // 1) Get the currently booked tour
    const tour = yield tourModel_1.default.findById(req.params.tourId);
    // 2) Create checkout session
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${(_a = req.user) === null || _a === void 0 ? void 0 : _a.id}&price=${tour === null || tour === void 0 ? void 0 : tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour === null || tour === void 0 ? void 0 : tour.slug}`,
        customer_email: (_b = req.user) === null || _b === void 0 ? void 0 : _b.email,
        client_reference_id: req.params.tourId,
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    unit_amount: (tour === null || tour === void 0 ? void 0 : tour.price) ? tour.price * 100 : 0,
                    product_data: {
                        name: `${tour === null || tour === void 0 ? void 0 : tour.name} Tour`,
                        description: tour === null || tour === void 0 ? void 0 : tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour === null || tour === void 0 ? void 0 : tour.imageCover}`],
                    },
                },
                quantity: 1,
            },
        ],
    });
    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session,
    });
}));
exports.createBookingCheckout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { tour, user, price } = req.query;
    if (!tour || !user || !price)
        return next();
    yield bookingModel_1.default.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
}));
exports.createBooking = factory.createOne(bookingModel_1.default);
exports.getBooking = factory.getOne(bookingModel_1.default);
exports.getAllBookings = factory.getAll(bookingModel_1.default);
exports.updateBooking = factory.updateOne(bookingModel_1.default);
exports.deleteBooking = factory.deleteOne(bookingModel_1.default);
//# sourceMappingURL=bookingController.js.map