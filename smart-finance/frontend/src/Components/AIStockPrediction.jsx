import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LineController,
    CategoryScale, // Nødvendig for X-aksen
    LinearScale, // Nødvendig for Y-aksen
    Title,
    Tooltip,
    Legend
  } from 'chart.js';
  
  ChartJS.register(
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
  );
  

const AIStockPrediction = () => {
  const [ticker, setTicker] = useState(""); // Aksjekode
  const [result, setResult] = useState(null); // Prediksjonsresultat
  const [simulationData, setSimulationData] = useState(null); // Simuleringsresultater

  // Funksjon for å hente prediksjon
  const fetchPrediction = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/predict?ticker=${ticker}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data); // Lagre prediksjonen
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Kunne ikke hente prediksjonen. Sjekk serveren.");
    }
  };

  // Funksjon for å hente simulering
  const fetchSimulation = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/simulate?ticker=${ticker}&amount=1000&start_date=2010-01-01`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSimulationData(data); // Lagre simuleringen
    } catch (error) {
      console.error("Error fetching simulation:", error);
      alert("Kunne ikke hente simuleringen. Sjekk serveren.");
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      {/* Overskrift */}
      <Typography variant="h5" gutterBottom>
        Aksjeprediksjon med AI
      </Typography>
      
      {/* Tekstfelt for aksjekode */}
      <TextField
        label="Ticker (f.eks. AAPL)"
        variant="outlined"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        sx={{ mb: 2, width: "200px" }} // Gjør tekstfeltet mindre
      />

      {/* Knapp for prediksjon */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={fetchPrediction} sx={{ mr: 2 }}>
          Hent Prediksjon
        </Button>

        {/* Knapp for simulering */}
        <Button variant="contained" onClick={fetchSimulation}>
          Test Algoritmen
        </Button>
      </Box>

      {/* Vise prediksjonsresultater */}
      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Prediksjonsresultater:</Typography>
          <Typography>
            Sannsynlighet for oppgang: {(result.next_day_probability_up * 100).toFixed(2)}%
          </Typography>
          <Typography>
            <strong>Anbefaling: {result.recommendation}</strong>
          </Typography>
        </Box>
      )}

      {/* Graf som viser simuleringen */}
      {simulationData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Simuleringsresultater:</Typography>
          <Line
            data={{
              labels: simulationData.dates, // Datoer fra simuleringen
              datasets: [
                {
                  label: "Algoritmens balanse",
                  data: simulationData.balances_algorithm, // Algoritmens balanse
                  borderColor: "rgba(75,192,192,1)",
                  fill: false,
                },
                {
                  label: "Kjøp hver dag balanse",
                  data: simulationData.balances_buy_daily, // Kjøp hver dag-strategiens balanse
                  borderColor: "rgb(255, 40, 87)",
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "Dato" } },
                y: { title: { display: true, text: "Balanse (NOK)" } },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AIStockPrediction;
