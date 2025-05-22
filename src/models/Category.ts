import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  coverImage: { type: String }
}, { timestamps: true });

export default mongoose.model("Category", CategorySchema);  