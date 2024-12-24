import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Button } from "@mui/material";
import AddStockModal from "../Components/AddStockModal";

function StockTable({ stocks }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [localStocks, setLocalStocks] = useState(stocks);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddStock = (newStock) => {
    setLocalStocks([...localStocks, newStock]);
    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Dine Aksjer
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TableContainer component={Paper} sx={{ width: "80%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Aksjenavn</strong></TableCell>
                <TableCell align="right"><strong>Pris (NOK)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localStocks.map((stock, index) => (
                <TableRow key={index}>
                  <TableCell>{stock.name}</TableCell>
                  <TableCell align="right">{stock.price} NOK</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
        >
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
