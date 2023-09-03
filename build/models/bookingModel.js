"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const tourModel_1 = __importDefault(require("./tourModel"));
const userModel_1 = __importDefault(require("./userModel"));
const bookingSchema = new mongoose_1.default.Schema({
    tour: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: tourModel_1.default,
        required: [true, 'Booking must belong to a tour'],
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: userModel_1.default,
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
const Booking = mongoose_1.default.model('Booking', bookingSchema);
exports.default = Booking;
//# sourceMappingURL=bookingModel.js.map