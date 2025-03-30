import React, { useState, useEffect } from "react";
import { Button, Container, Typography } from "@mui/material";
import axios from "axios";
import AddProductForm from "../../components/AddProductForm";
import ProductTable from "../../components/ProductTable";
import DashboardLayout from "../../layouts/DashboardLayout";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add or Edit Product
  const handleSaveProduct = async (
    productData: Omit<Product, "id">,
    productId?: number
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

  // Delete Product
  const handleDeleteProduct = async (productId: number) => {
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
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
