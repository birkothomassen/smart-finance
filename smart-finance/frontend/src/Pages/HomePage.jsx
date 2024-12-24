import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddStockModal from "../Components/AddStockModal";
import StockTable from "../Components/StockTable";

function FileUploadPage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);

  const handleClick = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleAddStock = (newStock) => {
    setStocks([...stocks, newStock]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Typography variant="h3" className="App-title">
          Min Side
        </Typography>
      </header>
      <Button variant="contained" onClick={handleClick}>
        Legg til aksje
      </Button>
      <AddStockModal
        open={isModalOpen}
        onClose={handleClose}
        onAddStock={handleAddStock}
      />
      <StockTable stocks={stocks} />
    </div>
  );
}

export default FileUploadPage;
