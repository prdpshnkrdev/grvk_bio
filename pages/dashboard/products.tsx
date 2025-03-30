import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
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
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Product 1", price: 100, stock: 50 },
    { id: 2, name: "Product 2", price: 200, stock: 30 },
    { id: 3, name: "Product 3", price: 150, stock: 10 },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");

  const handleSaveProduct = (
    productData: Omit<Product, "id">,
    productId?: number
  ) => {
    if (productId) {
      const updatedProducts = products.map((product) =>
        product.id === productId ? { ...product, ...productData } : product
      );
      setProducts(updatedProducts);
    } else {
      setProducts((prevProducts) => [
        ...prevProducts,
        { ...productData, id: prevProducts.length + 1 },
      ]);
    }
    setOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setOpen(true);
  };

  // Search and Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "All" ||
      (filter === "In Stock" && product.stock > 0) ||
      (filter === "Out of Stock" && product.stock === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <Container>
        <Typography variant="h4" gutterBottom>
          Products Management
        </Typography>

        {/* Search and Filter Section */}
        <Box display="flex" gap={2} marginBottom={2}>
          <TextField
            label="Search Products"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FormControl size="small">
            <InputLabel>Filter</InputLabel>
            <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
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

        <ProductTable
          products={filteredProducts}
          setProducts={setProducts}
          onEdit={handleEdit}
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
