// pages/dashboard/products.tsx
import React, { useState } from "react";
import { Button, Container, Typography } from "@mui/material";
import AddProductForm from "../../components/AddProductForm";
import ProductTable from "../../components/ProductTable";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 100, stock: 50 },
    { id: 2, name: "Product 2", price: 200, stock: 30 },
  ]);

  const handleAddProduct = (newProduct: Omit<Product, "id">) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setOpen(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products Management
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Product
      </Button>
      <ProductTable products={products} setProducts={setProducts} />
      <AddProductForm
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAddProduct}
      />
    </Container>
  );
};

export default ProductsPage;
