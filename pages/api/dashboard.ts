import dbConnect from "../../lib/mongodb";
import Product from "../../models/Products";
import Order, { OrderStatus } from "../../models/Orders";
import { NextApiRequest, NextApiResponse } from "next";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Total Products
    const totalProducts = await Product.countDocuments();

    // Low Stock Products
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 5 },
    });

    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: OrderStatus.Pending,
    });

    // Recent Orders (Last 5)
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("productId");

    res.status(200).json({
      totalProducts,
      lowStockProducts,
      totalOrders,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
