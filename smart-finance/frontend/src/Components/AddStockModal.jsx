import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function AddStockModal({ open, onClose, onAddStock }) {
  const [formData, setFormData] = useState({ name: "", price: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.price) {
      onAddStock(formData);
      setFormData({ name: "", price: "" });
      onClose();
    } else {
      alert("Vennligst fyll inn alle felt.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" component="h2">
          Legg til aksje
        </Typography>
        <TextField
          fullWidth
          label="Aksjenavn"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Aksjekurs"
          name="price"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Legg til
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddStockModal;
