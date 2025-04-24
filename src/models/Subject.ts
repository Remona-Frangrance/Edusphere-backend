import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    standard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Standard',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Subject = mongoose.model('Subject', subjectSchema);
