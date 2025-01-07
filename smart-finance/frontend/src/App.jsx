import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline"; // For å nullstille styling og bruke MUI-baseline
import HomePage from "./Pages/HomePage"; // Sørg for riktig sti til HomePage

// Opprett et tilpasset tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E3A8A", // Mørk blå
    },
    secondary: {
      main: "#FFD700", // Gull
    },
    success: {
      main: "#22C55E", // Grønn for positive verdier
    },
    error: {
      main: "#EF4444", // Rød for negative verdier
    },
    background: {
      default: "#F9FAFB", // Lys grå bakgrunn
    },
    text: {
      primary: "#1E1E1E", // Mørk tekstfarge
      secondary: "#6B7280", // Lys grå tekst
    },
  },
  typography: {
    fontFamily: "Poppins, Arial, sans-serif", // Bruk Poppins som hovedfont
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Sett HomePage som hovedrute */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
