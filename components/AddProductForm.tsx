import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "_id">, _id?: string) => void;
  initialData?: Product | null;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setStock(initialData.stock);
    } else {
      setName("");
      setPrice("");
      setStock("");
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name || price === "" || stock === "") {
      alert("Please fill all fields");
      return;
    }
    onSave(
      { name, price: Number(price), stock: Number(stock) },
      initialData?._id
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {initialData ? "Edit Product" : "Add New Product"}
      </DialogTitle>
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
          {initialData ? "Save Changes" : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductForm;
