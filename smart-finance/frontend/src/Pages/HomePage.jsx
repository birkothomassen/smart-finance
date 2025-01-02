import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import StockTable from "../Components/StockTable";

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
    </div>
  );
}

export default FileUploadPage;
