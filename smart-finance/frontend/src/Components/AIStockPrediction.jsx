import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";

const AIStockPrediction = () => {
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState(null);

  const fetchPrediction = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?ticker=${ticker}`);
      if (!response.ok) {
        console.error("HTTP error:", response.status);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Prediksjonsdata mottatt:", data); // Logg responsen
      setResult(data); // Oppdater resultat
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Kunne ikke hente prediksjonen. Sjekk serveren.");
    }
  };
  
  
  

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Aksjeprediksjon med AI
      </Typography>
      <TextField
        label="Aksjekode (f.eks. AAPL)"
        variant="outlined"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={fetchPrediction}>
        Hent Prediksjon
      </Button>
      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Resultater for {ticker}:</Typography>
          <Typography>Nøyaktighet: {result.accuracy}</Typography>
          <Typography>Presisjon: {result.precision}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AIStockPrediction;
