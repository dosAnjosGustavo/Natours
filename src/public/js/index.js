import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateSettings } from './updateSettings.js';
import { bookTour } from './stripe.js';
import { signup } from './signup.js';

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
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn--save-password');
    const fieldCurrentPassword = document.getElementById('password-current');
    const fieldPassword = document.getElementById('password');
    const fieldPasswordConfirm = document.getElementById('password-confirm');

    btn.textContent = 'Updating...';
    const passwordCurrent = fieldCurrentPassword.value;
    const password = fieldPassword.value;
    const passwordConfirm = fieldPasswordConfirm.value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    btn.textContent = 'Save password';
    fieldCurrentPassword.value = '';
    fieldPassword.value = '';
    fieldPasswordConfirm.value = '';
  });

if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    e.target.disabled = true;
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

if (signupForm)
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    const btn = document.querySelector('.btn');
    btn.textContent = 'Signing up...';
    btn.disabled = true;
    await signup(name, email, password, passwordConfirm);
  });
