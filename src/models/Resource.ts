import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['video', 'pdf'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Resource = mongoose.model('Resource', resourceSchema);
