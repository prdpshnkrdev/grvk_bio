// pages/api/products/[id].ts
import dbConnect from "../../../lib/mongodb";
import Product, { IProduct } from "../../../models/Products";
import { NextApiRequest, NextApiResponse } from "next";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  try {
    switch (req.method) {
      case "GET":
        const product: IProduct | null = await Product.findById(id);
        if (!product)
          return res.status(404).json({ error: "Product not found" });
        return res.status(200).json(product);

      case "PUT":
        const { name, price, stock } = req.body;
        if (!name || price === undefined || stock === undefined) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
          id,
          { name, price, stock },
          { new: true, runValidators: true }
        );

        if (!updatedProduct)
          return res.status(404).json({ error: "Product not found" });
        return res.status(200).json(updatedProduct);

      case "DELETE":
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
          return res.status(404).json({ error: "Product not found" });
        return res.status(204).end();

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
