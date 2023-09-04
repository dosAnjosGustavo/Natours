import 'core-js/stable';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';

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
    form.append(
      'photo',

      // @ts-ignore
      document.getElementById('photo').files[0]
    );

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
    // @ts-ignore
    e.target.textContent = 'Processing...';
    // @ts-ignore
    e.target.disabled = true;
    // @ts-ignore
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
    const passwordConfirm = document.getElementById('passwordConfi.').value;

    const btn = document.querySelector('.btn');
    btn.textContent = 'Signing up...';
    // @ts-ignore
    btn.disabled = true;
    await signup(name, email, password, passwordConfirm);
  });
