import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  ChartTooltip,
  Legend
);

const AIStockPrediction = () => {
  const [ticker, setTicker] = useState("");
  const [result, setResult] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Legg til denne linjen for å opprette state for modalen
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funksjoner for å åpne og lukke modalen
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const fetchPrediction = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/predict?ticker=${ticker}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Kunne ikke hente prediksjonen. Sjekk serveren.");
    }
  };

  const fetchSimulation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/simulate?ticker=${ticker}&amount=1000&start_date=2020-01-01`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSimulationData(data);
    } catch (error) {
      console.error("Error fetching simulation:", error);
      alert("Kunne ikke hente simuleringen. Sjekk serveren.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Aksjeprediksjon med AI
        <IconButton aria-label="info" onClick={handleOpen} style={{ marginLeft: "10px" }}>
          <InfoIcon color="primary" />
        </IconButton>
      </Typography>

      {/* Modal */}
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Hva er "Aksjeprediksjon med AI"?
          </Typography>
          <Typography variant="body1">
            Aksjeprediksjonen er basert på en Random Forest-modell som analyserer historiske aksjedata 
            for å estimere sannsynligheten for oppgang eller nedgang i aksjeprisen. Modellen bruker 
            følgende nøkkelpunkter:
          </Typography>
          <ul>
            <li>
              Historiske prisendringer (1 dag, 7 dager, 3 måneder og 1 år) for å fange opp trender.
            </li>
            <li>
              "Streak"-verdier, som viser om aksjen har hatt flere dager på rad med oppgang eller nedgang.
            </li>
            <li>
              Åpnings-, høyeste, laveste og sluttkurs samt handelsvolum for hver dag.
            </li>
          </ul>
          <Typography variant="body1" gutterBottom>
            Modellen trenes på historiske data og evaluerer for hver dag om sluttkursen neste dag vil 
            være høyere enn dagens sluttkurs. Prediksjonene brukes til å gi anbefalinger som "Kjøp" eller 
            "Ikke kjøp".
          </Typography>
          <Typography variant="body1" gutterBottom>
            I simuleringen tester vi algoritmens beslutninger over tid og sammenligner med en strategi 
            der man kjøper aksjer hver dag for en fast sum. Interessant å bemerke seg at algoritmen ikke handler bedre enn å kjøpe hver dag.
          </Typography>
          <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
            Lukk
          </Button>
        </Box>
      </Modal>

      <TextField
        label="Ticker (f.eks. AAPL)"
        variant="outlined"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        sx={{ mb: 2, width: "200px" }}
      />

      <Box sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={fetchPrediction}
          sx={{ mr: 2 }}
          disabled={isLoading}
        >
          Hent Prediksjon
        </Button>
        <Button variant="contained" onClick={fetchSimulation} disabled={isLoading}>
          {isLoading ? "Simulerer..." : "Test Algoritmen"}
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Simuleringen pågår...
          </Typography>
        </Box>
      )}

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

      {simulationData && !isLoading && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Simuleringsresultater:</Typography>
          <Line
            data={{
              labels: simulationData.dates.filter((_, index) => index % 10 === 0),
              datasets: [
                {
                  label: "Algoritmens balanse",
                  data: simulationData.balances_algorithm.filter((_, index) => index % 10 === 0),
                  borderColor: "rgba(75,192,192,1)",
                  backgroundColor: "rgba(75,192,192,0.1)",
                  borderWidth: 2,
                  tension: 0.4,
                  fill: false,
                },
                {
                  label: "Kjøp hver dag balanse",
                  data: simulationData.balances_buy_daily.filter((_, index) => index % 10 === 0),
                  borderColor: "rgba(255,99,132,1)",
                  backgroundColor: "rgba(255,99,132,0.1)",
                  borderWidth: 2,
                  tension: 0.4,
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
                  ticks: { maxTicksLimit: 15 },
                },
                y: {
                  title: { display: true, text: "Balanse (NOK)" },
                  ticks: {
                    callback: function (value) {
                      return value.toLocaleString();
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
