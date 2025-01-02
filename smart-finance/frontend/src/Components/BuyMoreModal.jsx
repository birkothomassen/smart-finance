import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

function BuyMoreModal({ open, onClose, stock, onBuyMore }) {
  const [additionalAmount, setAdditionalAmount] = useState("");

  const handleSubmit = () => {
    if (additionalAmount) {
      onBuyMore(stock._id, parseFloat(additionalAmount));
      setAdditionalAmount("");
    } else {
      alert("Fyll inn et beløp før du fortsetter.");
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
          Kjøp mer av {stock.name}
        </Typography>
        <TextField
          fullWidth
          label="Beløp (NOK)"
          type="number"
          value={additionalAmount}
          onChange={(e) => setAdditionalAmount(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Bekreft
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Avbryt
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default BuyMoreModal;
