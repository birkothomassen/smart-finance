import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, List, ListItem } from "@mui/material";

function AddStockModal({ open, onClose, onAddStock }) {
  const [query, setQuery] = useState(""); // Søketekst
  const [results, setResults] = useState([]); // Resultater fra søket
  const [selectedStock, setSelectedStock] = useState(null); // Valgt aksje
  const [formData, setFormData] = useState({ price: "", purchaseDate: "" }); // Brukerinnput for pris og dato

  const API_KEY = "3DGU6W67BI8485NG"; // Alpha Vantage API-nøkkel

  // Søk etter aksjer
  const handleSearch = () => {
    if (!query) {
      alert("Skriv inn et søk for å finne aksjer.");
      return;
    }
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.bestMatches) {
          const formattedResults = data.bestMatches.map((match) => ({
            name: match["2. name"],
            symbol: match["1. symbol"],
          }));
          setResults(formattedResults);
        } else {
          setResults([]);
        }
      })
      .catch((err) => console.error("Error fetching stock data:", err));
  };

  // Lagre aksjen
  const handleSubmit = () => {
    if (selectedStock && formData.price && formData.purchaseDate) {
      const newStock = {
        ...selectedStock,
        price: parseFloat(formData.price),
        purchaseDate: formData.purchaseDate,
      };
      onAddStock(newStock);
      setSelectedStock(null);
      setFormData({ price: "", purchaseDate: "" });
      setQuery("");
      setResults([]);
    } else {
      alert("Fyll inn alle feltene før du lagrer.");
    }
  };

  if (!open) return null;

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
          label="Søk etter aksjenavn eller kode"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          margin="normal"
          variant="outlined"
        />
        <Button variant="contained" onClick={handleSearch} sx={{ mt: 2 }}>
          Søk
        </Button>
        <List>
          {results.map((stock, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setSelectedStock(stock)}
            >
              {stock.name} ({stock.symbol})
            </ListItem>
          ))}
        </List>
        {selectedStock && (
          <>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Valgt aksje: {selectedStock.name} ({selectedStock.symbol})
            </Typography>
            <TextField
              fullWidth
              label="Beløp brukt (NOK)"
              type="number"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Kjøpsdato"
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </>
        )}
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Lagre
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
