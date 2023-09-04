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
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/stable");
const login_1 = require("./login");
const mapbox_1 = require("./mapbox");
const updateSettings_1 = require("./updateSettings");
const stripe_1 = require("./stripe");
const signup_1 = require("./signup");
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');
if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    (0, mapbox_1.displayMap)(locations);
}
if (loginForm)
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password')
            .value;
        (0, login_1.login)(email, password);
    });
if (logOutBtn)
    logOutBtn.addEventListener('click', login_1.logout);
if (userDataForm)
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', 
        // @ts-ignore
        document.getElementById('photo').files[0]);
        (0, updateSettings_1.updateSettings)(form, 'data');
    });
if (userPasswordForm)
    userPasswordForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const btn = document.querySelector('.btn--save-password');
        const fieldCurrentPassword = (document.getElementById('password-current'));
        const fieldPassword = document.getElementById('password');
        const fieldPasswordConfirm = (document.getElementById('password-confirm'));
        btn.textContent = 'Updating...';
        const passwordCurrent = fieldCurrentPassword.value;
        const password = fieldPassword.value;
        const passwordConfirm = fieldPasswordConfirm.value;
        yield (0, updateSettings_1.updateSettings)({ passwordCurrent, password, passwordConfirm }, 'password');
        btn.textContent = 'Save password';
        fieldCurrentPassword.value = '';
        fieldPassword.value = '';
        fieldPasswordConfirm.value = '';
    }));
if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
        // @ts-ignore
        e.target.textContent = 'Processing...';
        // @ts-ignore
        e.target.disabled = true;
        // @ts-ignore
        const { tourId } = e.target.dataset;
        (0, stripe_1.bookTour)(tourId);
    });
}
if (signupForm)
    signupForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password')
            .value;
        const passwordConfirm = (document.getElementById('passwordConfirm')).value;
        const btn = document.querySelector('.btn');
        btn.textContent = 'Signing up...';
        // @ts-ignore
        btn.disabled = true;
        yield (0, signup_1.signup)(name, email, password, passwordConfirm);
    }));
//# sourceMappingURL=index.js.map