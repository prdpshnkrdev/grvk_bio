import dbConnect from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Products";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const {
        sortBy = "createdAt",
        order = "desc",
        page = "1",
        limit = "10",
        minPrice,
        maxPrice,
        inStock,
      } = req.query;

      // Convert query parameters to proper data types
      const sortOrder = order === "asc" ? 1 : -1;
      const currentPage = parseInt(page as string, 10);
      const itemsPerPage = parseInt(limit as string, 10);

      // Build filter conditions
      const filter: {
        price?: { $gte?: number; $lte?: number };
        stock?: { $gt?: number; $lte?: number };
      } = {};
      if (minPrice)
        filter.price = {
          ...filter.price,
          $gte: parseFloat(minPrice as string),
        };
      if (maxPrice)
        filter.price = {
          ...filter.price,
          $lte: parseFloat(maxPrice as string),
        };
      if (inStock === "true") filter.stock = { $gt: 0 };
      if (inStock === "false") filter.stock = { $lte: 0 };

      // Fetch products with pagination and filtering
      const products = await Product.find(filter)
        .sort({ [sortBy as string]: sortOrder })
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

      const totalProducts = await Product.countDocuments(filter);

      res.status(200).json({
        products,
        totalPages: Math.ceil(totalProducts / itemsPerPage),
        currentPage,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
