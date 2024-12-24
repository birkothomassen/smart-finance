import React, { useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddStockModal from "../Components/AddStockModal";

function FileUploadPage() {
  // State for modal og aksjer
  const [isModalOpen, setModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);

  // Åpne modal
  const handleClick = () => {
    setModalOpen(true);
  };

  // Lukk modal
  const handleClose = () => {
    setModalOpen(false);
  };

  // Legg til ny aksje
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
      <Button
        variant="contained"
        className="App-button"
        onClick={handleClick}
      >
        Legg til aksje
      </Button>
      <AddStockModal
        open={isModalOpen}
        onClose={handleClose}
        onAddStock={handleAddStock}
      />
      <div className="stock-list">
        {stocks.map((stock, index) => (
          <div key={index} className="stock-item">
            <h3>{stock.name}</h3>
            <p>{stock.price} NOK</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUploadPage;
