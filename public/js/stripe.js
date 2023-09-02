import { showAlert } from './alerts';
import axios from 'axios';
// const stripe = Stripe(
//   'pk_test_51NlcAAKHd9voPdh0rgTqA1G5prTmWcJnGRmCyNC6DnWVReWvAsWiubM7PEJMSiV8TSQ48Nm3yasvII8PfXWNnXt900S6jJDaMm'
// );

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API + create checkout form
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Redirect to checkout form
    window.location.href = session.data.session.url;
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
