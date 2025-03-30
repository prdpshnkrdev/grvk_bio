import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Pagination,
} from "@mui/material";
import axios from "axios";
import AddProductForm from "../../components/AddProductForm";
import ProductTable from "../../components/ProductTable";
import DashboardLayout from "../../layouts/DashboardLayout";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStock, setInStock] = useState<string>("all");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/products`, {
        params: {
          sortBy,
          order,
          page,
          limit: 10,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          inStock: inStock === "all" ? undefined : inStock === "true",
        },
      });

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [sortBy, order, page, minPrice, maxPrice, inStock]);

  useEffect(() => {
    fetchProducts();
  }, [sortBy, order, page, minPrice, maxPrice, inStock, fetchProducts]);

  const handleSaveProduct = async (
    productData: Omit<Product, "id">,
    productId?: string
  ) => {
    try {
      if (productId) {
        await axios.put(`/api/products/${productId}`, productData);
      } else {
        await axios.post("/api/products", productData);
      }
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
    setOpen(false);
    setEditProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`/api/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setOpen(true);
  };

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Products Management
        </Typography>

        {/* Sort, Filter, and Pagination Controls */}
        <Box display="flex" gap={2} marginBottom={2}>
          {/* Sort Controls */}
          <FormControl size="small">
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="createdAt">Date Created</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>Order</InputLabel>
            <Select value={order} onChange={(e) => setOrder(e.target.value)}>
              <MenuItem value="asc">Ascending</MenuItem>
              <MenuItem value="desc">Descending</MenuItem>
            </Select>
          </FormControl>

          {/* Filter Controls */}
          <TextField
            label="Min Price"
            size="small"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <TextField
            label="Max Price"
            size="small"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <FormControl size="small">
            <InputLabel>In Stock</InputLabel>
            <Select
              value={inStock}
              onChange={(e) => setInStock(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="true">In Stock</MenuItem>
              <MenuItem value="false">Out of Stock</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Add Product
          </Button>
        </Box>

        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, newPage) => setPage(newPage)}
        />

        <ProductTable
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteProduct}
        />
        <AddProductForm
          open={open}
          onClose={() => {
            setOpen(false);
            setEditProduct(null);
          }}
          onSave={handleSaveProduct}
          initialData={editProduct}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ProductsPage;
