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
exports.updateUserData = exports.getMyTours = exports.signup = exports.getAccount = exports.getLoginForm = exports.getTour = exports.getOverview = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const tourModel_1 = __importDefault(require("../models/tourModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const userModel_1 = __importDefault(require("../models/userModel"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
exports.getOverview = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tours = yield tourModel_1.default.find();
    res.status(200).render('overview', {
        title: 'All Tours',
        tours,
    });
}));
exports.getTour = (0, catchAsync_1.default)((_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug } = _req.params;
    // @ts-ignore
    const tour = yield tourModel_1.default.findOne({ slug }).populate({
        path: 'reviews',
        fields: 'review rating user',
    });
    if (!tour)
        return next(new appError_1.default('There is no tour with that name', 404));
    res.status(200).render('tour', {
        title: `${tour.name} tour`,
        tour,
    });
}));
const getLoginForm = (_req, res) => {
    res.status(200).render('login', {
        title: 'Log into your account',
    });
};
exports.getLoginForm = getLoginForm;
const getAccount = (_req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
};
exports.getAccount = getAccount;
const signup = (_req, res) => {
    res.status(200).render('signup', {
        title: 'Create your account!',
    });
};
exports.signup = signup;
exports.getMyTours = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // 1) Find all bookings for the current user
    const bookings = yield bookingModel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = yield tourModel_1.default.find({ _id: { $in: tourIDs } });
    res.status(200).render('overview', {
        title: 'My Tours',
        tours,
    });
}));
exports.updateUserData = (0, catchAsync_1.default)((req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const user = yield userModel_1.default.findByIdAndUpdate((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, {
        name: req.body.name,
        email: req.body.email,
    }, {
        new: true,
        runValidators: true,
    });
    res.status(200).render('account', {
        title: 'Your account',
        user,
    });
}));
//# sourceMappingURL=viewsController.js.map