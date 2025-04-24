import mongoose from 'mongoose';

const standardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
  },
  { timestamps: true }
);

export const Standard = mongoose.model('Standard', standardSchema);
