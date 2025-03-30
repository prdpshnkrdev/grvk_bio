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

    // Completed Orders
    const completedOrders = await Order.countDocuments({
      status: OrderStatus.Delivered,
    });

    // Total Revenue from Delivered Orders
    const completedOrdersData = await Order.find({
      status: OrderStatus.Delivered,
    });
    const totalRevenue = completedOrdersData.reduce(
      (sum, order) => sum + order.totalPrice,
      0
    );

    // Calculate Order Completion Rate
    const orderCompletionRate =
      totalOrders > 0
        ? ((completedOrders / totalOrders) * 100).toFixed(2)
        : "0.00";

    // Calculate Average Order Value (AOV)
    const averageOrderValue =
      completedOrders > 0
        ? (totalRevenue / completedOrders).toFixed(2)
        : "0.00";

    // Sales Performance by Date
    const salesData = await Order.aggregate([
      { $match: { status: OrderStatus.Delivered } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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
      completedOrders,
      totalRevenue,
      orderCompletionRate,
      averageOrderValue,
      salesData,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
