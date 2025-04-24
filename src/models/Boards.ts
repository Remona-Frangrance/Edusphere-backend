import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const Board = mongoose.model('Board', boardSchema);
