import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onAdd: (product: { name: string; price: number; stock: number }) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = () => {
    if (!name || !price || !stock) {
      alert("All fields are required");
      return;
    }
    onAdd({ name, price: parseFloat(price), stock: parseInt(stock) });
    setName("");
    setPrice("");
    setStock("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Product Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Stock"
          type="number"
          fullWidth
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm;
