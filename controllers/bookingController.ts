import { Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Tour from '../models/tourModel';
import Stripe from 'stripe';
import { CustomRequest } from '../@types/merged';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16',
});

export const getCheckoutSession = catchAsync(
  async (req: CustomRequest, res: Response, _next: NextFunction) => {
    // 1) Get the currently booked tour
    const tour = await Tour.findById(req.params.tourId);

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      // `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      //   req.params.tourId
      // }&user=${req.user.id}&price=${tour.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user?.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tour.price ? tour.price * 100 : 0,
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
            },
          },
          quantity: 1,
        },
      ],
    });

    // 3) Create session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  }
);
