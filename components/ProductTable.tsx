import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const initialProducts: Product[] = [
  { id: 1, name: "Product 1", price: 100, stock: 20 },
  { id: 2, name: "Product 2", price: 150, stock: 35 },
  { id: 3, name: "Product 3", price: 200, stock: 10 },
];

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const handleEdit = (id: number) => {
    alert(`Edit product with ID: ${id}`);
  };

  const handleDelete = (id: number) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id)
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Price ($)</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(product.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(product.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductTable;
