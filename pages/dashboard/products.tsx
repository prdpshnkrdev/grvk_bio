// pages/dashboard/products.tsx
import React, { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import AddProductForm from "../../components/AddProductForm";
import ProductTable from "../../components/ProductTable";
import DashboardLayout from "../../layouts/DashboardLayout";

const ProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 100, stock: 50 },
    { id: 2, name: "Product 2", price: 200, stock: 30 },
  ]);

  const handleAddProduct = (newProduct: Omit<(typeof products)[0], "id">) => {
    setProducts((prevProducts) => [
      ...prevProducts,
      { ...newProduct, id: prevProducts.length + 1 },
    ]);
    setOpen(false);
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
        <ProductTable products={products} setProducts={setProducts} />
        <AddProductForm
          open={open}
          onClose={() => setOpen(false)}
          onAdd={handleAddProduct}
        />
      </Container>
    </DashboardLayout>
  );
};

export default ProductsPage;
