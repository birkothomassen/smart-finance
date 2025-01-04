import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StockTable from "../Components/StockTable";
import AIStockPrediction from "../Components/AIStockPrediction";

function FileUploadPage() {
  const [stocks, setStocks] = useState([]);


  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h3" className="App-title">
          Smart Finance
        </Typography>
      </header>
      <StockTable stocks={stocks} />
      <AIStockPrediction />
    </div>
  );
}

export default FileUploadPage;
