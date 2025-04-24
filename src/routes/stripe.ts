import express from 'express';
import {
  createCheckoutSession,
} from '../controllers/paymentController';
import {
  stripeWebhook,
  handleStripeWebhook,
} from '../controllers/stripeController';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', stripeWebhook, handleStripeWebhook);

export default router;
