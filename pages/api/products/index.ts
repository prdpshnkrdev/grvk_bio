import dbConnect from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import Product from "../../../models/Products";
import applyCors from "../../../lib/cors";

// Connect to MongoDB
dbConnect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await applyCors(req, res); // Apply CORS Middleware

  switch (req.method) {
    // ✅ GET: Fetch Products with Filtering, Sorting, and Pagination
    case "GET":
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

        return res.status(200).json({
          products,
          totalPages: Math.ceil(totalProducts / itemsPerPage),
          currentPage,
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    // ✅ POST: Create a New Product
    case "POST":
      try {
        const { name, price, stock } = req.body;

        // Validate input
        if (!name || price === undefined || stock === undefined) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Create and save the new product
        const newProduct = new Product({ name, price, stock });
        await newProduct.save();

        return res.status(201).json(newProduct);
      } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

    // ❗ Handle Unsupported Methods
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
}
