import React, { useState } from "react";
import { Button, TextField, Typography, Box, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  const [result, setResult] = useState(null); // Prediksjonsresultater
  const [simulationData, setSimulationData] = useState(null); // Simuleringsresultater
  const [isLoading, setIsLoading] = useState(false); // Loader-tilstand

  // Funksjon for å hente prediksjon
  const fetchPrediction = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?ticker=${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data); // Lagre prediksjonsresultatet
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Kunne ikke hente prediksjonen. Sjekk serveren.");
    }
  };

  // Funksjon for å hente simulering
  const fetchSimulation = async () => {
    setIsLoading(true); // Start loaderen
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/simulate?ticker=${ticker}&amount=1000&start_date=2020-01-01`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSimulationData(data); // Lagre simuleringen
    } catch (error) {
      console.error("Error fetching simulation:", error);
      alert("Kunne ikke hente simuleringen. Sjekk serveren.");
    } finally {
      setIsLoading(false); // Stopp loaderen
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
        sx={{ mb: 2, width: "200px" }}
      />

      {/* Knapp for prediksjon */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={fetchPrediction}
          sx={{ mr: 2 }}
          disabled={isLoading}
        >
          Hent Prediksjon
        </Button>

        {/* Knapp for simulering */}
        <Button variant="contained" onClick={fetchSimulation} disabled={isLoading}>
          {isLoading ? "Simulerer..." : "Test Algoritmen"}
        </Button>
      </Box>

      {/* Loader */}
      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Simuleringen pågår...
          </Typography>
        </Box>
      )}

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
      {simulationData && !isLoading && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Simuleringsresultater:</Typography>
          <Line
            data={{
                labels: simulationData.dates.filter((_, index) => index % 10 === 0), // Reduser datapunkter for bedre ytelse
                datasets: [
                {
                    label: "Algoritmens balanse",
                    data: simulationData.balances_algorithm.filter((_, index) => index % 10 === 0),
                    borderColor: "rgba(75,192,192,1)",
                    backgroundColor: "rgba(75,192,192,0.1)",
                    borderWidth: 2,
                    tension: 0.4, // Gjør linjen glatt
                    fill: false,
                },
                {
                    label: "Kjøp hver dag balanse",
                    data: simulationData.balances_buy_daily.filter((_, index) => index % 10 === 0),
                    borderColor: "rgba(255,99,132,1)",
                    backgroundColor: "rgba(255,99,132,0.1)",
                    borderWidth: 2,
                    tension: 0.4, // Gjør linjen glatt
                    fill: false,
                },
                ],
            }}
            options={{
                responsive: true,
                plugins: {
                legend: { display: true, position: "top" },
                tooltip: { enabled: true },
                },
                scales: {
                x: {
                    title: { display: true, text: "Dato" },
                    ticks: {
                    maxTicksLimit: 15, // Viser færre datoer
                    },
                },
                y: {
                    title: { display: true, text: "Balanse (NOK)" },
                    ticks: {
                    callback: function (value) {
                        return value.toLocaleString(); // Formaterer tall
                    },
                    },
                },
                },
            }}
            />

        </Box>
      )}
    </Box>
  );
};

export default AIStockPrediction;
