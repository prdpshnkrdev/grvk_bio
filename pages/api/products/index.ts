import dbConnect from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Product, { IProduct } from "../../../models/Products";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const products: IProduct[] = await Product.find({});
    res.status(200).json(products);
  } else if (req.method === "POST") {
    const { name, price, stock } = req.body;
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newProduct = new Product({ name, price, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
