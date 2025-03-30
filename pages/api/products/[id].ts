// pages/api/products/[id].ts
import { NextApiRequest, NextApiResponse } from "next";

let products = [
  { id: 1, name: "Product 1", price: 100, stock: 50 },
  { id: 2, name: "Product 2", price: 200, stock: 30 },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const productId = parseInt(id as string);

  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (req.method === "GET") {
    res.status(200).json(products[productIndex]);
  } else if (req.method === "PUT") {
    const { name, price, stock } = req.body;
    products[productIndex] = { ...products[productIndex], name, price, stock };
    res.status(200).json(products[productIndex]);
  } else if (req.method === "DELETE") {
    products = products.filter((p) => p.id !== productId);
    res.status(204).end();
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
