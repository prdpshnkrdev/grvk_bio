// pages/api/orders/index.ts
import dbConnect from "../../../../lib/mongodb"; // Adjust the import path as necessary
import Order, { IOrder, OrderStatus } from "../../../../models/Orders";
import Product from "../../../../models/Products"; // Adjust the import path as necessary
import { NextApiRequest, NextApiResponse } from "next";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      // Get All Orders
      case "GET": {
        const orders: IOrder[] = await Order.find({}).populate("productId");
        return res.status(200).json(orders);
      }

      // Create a New Order
      case "POST": {
        const { productId, quantity } = req.body;

        if (!productId || !quantity) {
          return res
            .status(400)
            .json({ error: "Product ID and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }

        const totalPrice = product.price * quantity;

        const newOrder = new Order({
          productId,
          quantity,
          totalPrice,
          status: OrderStatus.Pending,
        });

        await newOrder.save();
        return res.status(201).json(newOrder);
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
