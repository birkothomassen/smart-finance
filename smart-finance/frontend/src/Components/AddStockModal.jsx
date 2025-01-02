import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button, List, ListItem } from "@mui/material";

function AddStockModal({ open, onClose, onAddStock }) {
  const [query, setQuery] = useState(""); // Søketekst
  const [results, setResults] = useState([]); // Resultater fra søket
  const [selectedStock, setSelectedStock] = useState(null); // Valgt aksje
  const [formData, setFormData] = useState({ price: "", purchasePrice: "" }); // Brukerinput for beløp brukt og kurs

  const API_KEY = "3DGU6W67BI8485NG"; // Alpha Vantage API-nøkkel

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Skriv inn et gyldig søk.");
      return;
    }

    try {
      const API_URL = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`;
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.bestMatches && data.bestMatches.length > 0) {
        const formattedResults = data.bestMatches.map((match) => ({
          name: match["2. name"],
          symbol: match["1. symbol"],
        }));
        setResults(formattedResults);
      } else {
        setResults([]);
        alert("Ingen resultater funnet for søket. Prøv en annen søketekst.");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("En feil oppstod under søk. Sjekk API-nøkkelen eller prøv igjen senere.");
    }
  };

  const handleSubmit = () => {
    if (selectedStock && formData.price && formData.purchasePrice) {
      const newStock = {
        ...selectedStock,
        price: parseFloat(formData.price),
        purchasePrice: parseFloat(formData.purchasePrice), // Legg til purchasePrice
      };
      onAddStock(newStock);
      setSelectedStock(null);
      setFormData({ price: "", purchasePrice: "" });
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
          {results.length > 0 ? (
            results.map((stock, index) => (
              <ListItem
                key={index}
                button
                onClick={() => setSelectedStock(stock)}
              >
                {stock.name} ({stock.symbol})
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Ingen resultater funnet.
            </Typography>
          )}
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
              label="Kurs ved kjøp"
              type="number"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
              margin="normal"
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
