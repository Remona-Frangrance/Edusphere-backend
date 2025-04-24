import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Subject } from '../models/Subject';
import { Standard } from '../models/Standard';
import bodyParser from 'body-parser';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

export const stripeWebhook = bodyParser.raw({ type: 'application/json' });

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const type = session.metadata?.type;
    const referenceId = session.metadata?.referenceId;
    const userId = session.metadata?.userId;
    console.log('✅ Created Checkout Session:', session.id, session.metadata);
    if (!type || !referenceId || !userId) {
      console.error('Missing metadata in session');
      return res.status(400).json({ message: 'Missing metadata' });
    }

    try {
      const user = await User.findById(userId);
      const item =
        type === 'subject'
          ? await Subject.findById(referenceId)
          : await Standard.findById(referenceId);

      if (user && item) {
        const alreadySubscribed = user.subscriptions.some(
          (sub) =>
            sub.type === type &&
            sub.referenceId?.toString() === item._id.toString()
        );

        if (!alreadySubscribed) {
          user.subscriptions.push({ type, referenceId: item._id });
          await user.save();
        }
      }
    } catch (err: any) {
      console.error('⚠️  Stripe webhook signature verification failed.');
      console.error('🔍 Error message:', err.message);
      console.error('📦 Request headers:', req.headers);
      console.error('📦 Request body (raw):', req.body);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  res.json({ received: true });
};
