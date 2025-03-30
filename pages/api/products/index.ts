// pages/api/products/index.ts
import { NextApiRequest, NextApiResponse } from "next";

const products = [
  { id: 1, name: "Product 1", price: 100, stock: 50 },
  { id: 2, name: "Product 2", price: 200, stock: 30 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(products);
  } else if (req.method === "POST") {
    const { name, price, stock } = req.body;
    const newProduct = {
      id: products.length + 1,
      name,
      price,
      stock,
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
