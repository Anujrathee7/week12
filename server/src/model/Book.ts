// backend/models/Book.ts
import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  title: string;
  author: string;
  year: number;
}

const bookSchema = new mongoose.Schema<IBook>({
  title: String,
  author: String,
  year: Number,
});

export default mongoose.model<IBook>("Book", bookSchema, "books");
