import mongoose, { Schema, Document } from "mongoose";

interface BookInterface extends Document {
  title: string;
  author: string;
  createdAt: Date;
  createdBy: string;
}

const BookSchema: Schema<BookInterface> = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: String, required: true },
});

export default mongoose.model<BookInterface>("Book", BookSchema);