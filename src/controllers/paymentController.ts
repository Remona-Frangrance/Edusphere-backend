import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Subject } from '../models/Subject';
import { Standard } from '../models/Standard';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  const { type, id, userId } = req.body;

  try {
    let item: any;
    if (type === 'subject') {
      item = await Subject.findById(id);
    } else if (type === 'standard') {
      item = await Standard.findById(id);
    }

    if (!item) {
      res.status(404).json({ message: `${type} not found` });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/subjects/${item._id}/resources`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        type,
        referenceId: item._id.toString(),
        userId,
      },
    });

    // Simulate granting access (use Stripe webhook in production)
    const user = await User.findById(userId);
    if (user) {
      const alreadySubscribed = user.subscriptions.some(
        (sub) =>
          sub.type === type &&
          sub.referenceId?.toString() === item._id.toString()
      );

      if (!alreadySubscribed) {
        user.subscriptions.push({
          type,
          referenceId: item._id,
        });
        await user.save();
      }
    }

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Checkout session failed' });
  }
};
