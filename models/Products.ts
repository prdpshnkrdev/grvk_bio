// models/Product.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the Product interface
export interface IProduct extends Document {
  name: string;
  price: number;
  stock: number;
}

// Define the Product schema
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: 0,
    },
  },
  { timestamps: true }
);

// Prevent model recompilation in dev mode
const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
