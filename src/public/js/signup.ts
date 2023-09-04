import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (
  name: string,
  email: string,
  password: String,
  passwordConfirm: String
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: { name, email, password, passwordConfirm },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err: any) {
    showAlert('error', err.response.data.message);
  }
};
