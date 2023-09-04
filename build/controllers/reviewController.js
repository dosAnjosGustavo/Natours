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
exports.deleteReview = exports.updateReview = exports.createReview = exports.getReview = exports.getAllReviews = exports.setTourUserIds = void 0;
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const factory = __importStar(require("./handlerFactory"));
const setTourUserIds = (req, _res, next) => {
    var _a;
    if (!req.body.tour)
        req.body.tour = req.params.tourId;
    if (!req.body.user)
        req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    next();
};
exports.setTourUserIds = setTourUserIds;
exports.getAllReviews = factory.getAll(reviewModel_1.default);
exports.getReview = factory.getOne(reviewModel_1.default);
exports.createReview = factory.createOne(reviewModel_1.default);
exports.updateReview = factory.updateOne(reviewModel_1.default);
exports.deleteReview = factory.deleteOne(reviewModel_1.default);
//# sourceMappingURL=reviewController.js.map