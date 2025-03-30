import mongoose from "mongoose";
import dbConnect from "../../../lib/mongodb";
import Order, { IOrder, OrderStatus } from "../../../models/Orders";
import { NextApiRequest, NextApiResponse } from "next";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (id && !mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ error: "Invalid Order ID" });
  }
  try {
    switch (req.method) {
      // Get Order by ID
      case "GET": {
        const order: IOrder | null = await Order.findById(id).populate(
          "productId"
        );
        if (!order) {
          return res.status(404).json({ error: "Order not found" });
        }
        return res.status(200).json(order);
      }

      // Update Order (e.g., Update Status)
      case "PUT": {
        const { status } = req.body;

        if (!status || !Object.values(OrderStatus).includes(status)) {
          return res.status(400).json({ error: "Invalid status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true, runValidators: true }
        );

        if (!updatedOrder) {
          return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json(updatedOrder);
      }

      // Delete Order
      case "DELETE": {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) {
          return res.status(404).json({ error: "Order not found" });
        }
        return res.status(204).end();
      }

      default:
        return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
