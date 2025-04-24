import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    subscriptions: [
      { 
        type: {
          type: String,
          enum: ['subject', 'standard'],
        },
        referenceId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: 'subscriptions.type',
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
