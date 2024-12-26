import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AddStockModal from "../Components/AddStockModal";

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch stocks from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/stocks")
      .then((response) => setStocks(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  }, []);

  // Add stock to backend
  const handleAddStock = (newStock) => {
    axios
      .post("http://localhost:5000/stocks", newStock)
      .then((response) => {
        setStocks((prevStocks) => [...prevStocks, response.data]);
      })
      .catch((error) => {
        console.error("Error adding stock:", error);
        alert("Kunne ikke legge til aksjen. Sjekk serveren.");
      });
    setModalOpen(false);
  };

  // Delete stock from backend
  const handleDeleteStock = (id) => {
    axios
      .delete(`http://localhost:5000/stocks/${id}`)
      .then(() => {
        setStocks((prevStocks) => prevStocks.filter((stock) => stock._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting stock:", error);
        alert("Kunne ikke slette aksjen. Sjekk serveren.");
      });
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 3, mb: 2, textAlign: "left" }}>
        Dine Aksjer
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-start", ml: 4 }}>
        <TableContainer component={Paper} sx={{ width: "50%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Aksjenavn</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Kjøpt for:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Handlinger</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock._id}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell align="right">{stock.price} NOK</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteStock(stock._id)}
                    >
                      Slett
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          ml: 4,
          mt: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Legg til aksje
        </Button>
      </Box>
      <AddStockModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onAddStock={handleAddStock}
      />
    </div>
  );
}

export default StockTable;
