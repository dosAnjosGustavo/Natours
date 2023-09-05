import { Response, NextFunction, Request } from 'express';
import catchAsync from '../utils/catchAsync';
import Tour from '../models/tourModel';
import Stripe from 'stripe';
import { CustomRequest } from '../@types/merged';
import Booking from '../models/bookingModel';
import * as factory from './handlerFactory';
import User from '../models/userModel';

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
      success_url: `${req.protocol}://${req.get('host')}//my-tours/`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,
      customer_email: req.user?.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tour?.price ? tour.price * 100 : 0,
            product_data: {
              name: `${tour?.name} Tour`,
              description: tour?.summary,
              images: [`https://www.natours.dev/img/tours/${tour?.imageCover}`],
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

const createBookingCheckout = async (session: Stripe.Checkout.Session) => {
  const tour = session.client_reference_id;

  const user = (await User.findOne({ email: session.customer_email }))?.id;

  const price_data =
    session.line_items as unknown as Stripe.Checkout.SessionCreateParams.LineItem[];
  const price = price_data[0]?.price_data?.unit_amount! / 100;

  await Booking.create({ tour, user, price });
};

export const webhookCheckout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const signature = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
      createBookingCheckout(event.data.object as Stripe.Checkout.Session);
    res.status(200).json({ received: true });
  }
);

export const createBooking = factory.createOne(Booking);
export const getBooking = factory.getOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
