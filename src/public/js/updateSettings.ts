import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data: any, type: string) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    const typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);

    if (res.data.status === 'success') {
      showAlert('success', `${typeCapitalized} updated successfully!`);
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err: any) {
    showAlert('error', err.response.data.message);
  }
};
