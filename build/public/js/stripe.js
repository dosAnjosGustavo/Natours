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
exports.bookTour = void 0;
const alerts_1 = require("./alerts");
const axios_1 = __importDefault(require("axios"));
const bookTour = (tourId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1) Get checkout session from API + create checkout form
        const session = yield (0, axios_1.default)(`/api/v1/bookings/checkout-session/${tourId}`);
        // 2) Redirect to checkout form
        window.location.href = session.data.session.url;
    }
    catch (err) {
        console.log(err);
        (0, alerts_1.showAlert)('error', err);
    }
});
exports.bookTour = bookTour;
//# sourceMappingURL=stripe.js.map