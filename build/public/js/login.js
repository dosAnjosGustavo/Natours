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
exports.logout = exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const alerts_1 = require("./alerts");
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, axios_1.default)({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password,
            },
        });
        if (res.data.status === 'success') {
            (0, alerts_1.showAlert)('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    }
    catch (err) {
        (0, alerts_1.showAlert)('error', err.response.data.message);
    }
});
exports.login = login;
const logout = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, axios_1.default)({
            method: 'GET',
            url: '/api/v1/users/logout',
        });
        if (res.data.status === 'success')
            location.assign('/');
    }
    catch (err) {
        console.log(err.response);
        (0, alerts_1.showAlert)('error', 'Error logging out! Try again.');
    }
});
exports.logout = logout;
//# sourceMappingURL=login.js.map