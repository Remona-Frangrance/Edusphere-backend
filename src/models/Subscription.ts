import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['subject', 'standard'],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
