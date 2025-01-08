import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StockTable from "../Components/StockTable";
import AIStockPrediction from "../Components/AIStockPrediction";
import "./HomePage.css";

function HomePage() {
  const [stocks, setStocks] = useState([]);


  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h2" className="App-title">
          Smart Finance
        </Typography>
      </header>
      <div className="table-container">
        <StockTable stocks={stocks} />
      </div>
      <div className="AI-pred">
        <AIStockPrediction />
      </div>
    </div>
  );
}

export default HomePage;
