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
import BuyMoreModal from "../Components/BuyMoreModal";

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/stocks")
      .then((response) => setStocks(response.data))
      .catch((error) => console.error("Error fetching stocks:", error));
  }, []);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      const updatedPrices = {};
      for (const stock of stocks) {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=3DGU6W67BI8485NG`
          );
          const price = parseFloat(response.data["Global Quote"]["05. price"]);
          updatedPrices[stock.symbol] = price || stock.purchasePrice;
        } catch (error) {
          console.error(`Error fetching price for ${stock.symbol}:`, error);
          updatedPrices[stock.symbol] = stock.purchasePrice;
        }
      }
      setCurrentPrices(updatedPrices);
    };

    if (stocks.length > 0) {
      fetchCurrentPrices();
    }
  }, [stocks]);

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

  const handleBuyMore = (id, additionalAmount) => {
    axios
      .patch(`http://localhost:5000/stocks/${id}`, { additionalAmount })
      .then((response) => {
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock._id === id
              ? { ...stock, price: stock.price + additionalAmount }
              : stock
          )
        );
      })
      .catch((error) => {
        console.error("Error buying more stock:", error);
        alert("Kunne ikke oppdatere aksjen. Sjekk serveren.");
      });
    setSelectedStock(null);
  };

  const calculateTotalValue = () => {
    let totalPurchaseValue = 0; // Summen av kjøpsbeløp
    let totalCurrentValue = 0; // Nåværende totalverdi

    stocks.forEach((stock) => {
      const currentPrice = currentPrices[stock.symbol];
      const purchasePrice = stock.purchasePrice || 0; // Kurs ved kjøp
      const purchaseValue = stock.price || 0; // Total kjøpsverdi

      if (currentPrice && purchasePrice && purchaseValue) {
        totalPurchaseValue += purchaseValue; // Legger til kjøpsbeløp
        totalCurrentValue += (currentPrice / purchasePrice) * purchaseValue; // Beregner nåværende verdi basert på kursoppgang
      }
    });

    const isPositive = totalCurrentValue >= totalPurchaseValue;
    return {
      totalValue: totalCurrentValue.toFixed(2), // Nåværende totalverdi
      totalPurchaseValue: totalPurchaseValue.toFixed(2), // Total kjøpsverdi
      isPositive,
    };
  };

  const { totalValue, totalPurchaseValue, isPositive } = calculateTotalValue();

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "70%" }}>
        <Typography variant="h4" sx={{ mt: 3, mb: 2, textAlign: "left" }}>
          Dine Aksjer
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => setModalOpen(true)}
        >
          Legg til Aksje
        </Button>
        <TableContainer component={Paper}>
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
                  <strong>Kurs ved kjøp:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Nåværende kurs:</strong>
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
                    {stock.purchasePrice ? `${stock.purchasePrice} NOK` : "Ikke satt"}
                  </TableCell>
                  <TableCell align="right">
                    {currentPrices[stock.symbol]
                      ? `${currentPrices[stock.symbol].toFixed(2)} NOK`
                      : "Laster..."}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDeleteStock(stock._id)}
                      sx={{ mr: 1 }}
                    >
                      Slett
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setSelectedStock(stock)}
                    >
                      Kjøp Mer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Oversikt over total verdi */}
      <Box
        sx={{
          width: "25%",
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          p: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6">Total kjøpsverdi:</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {`${totalPurchaseValue} NOK`}
        </Typography>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Nåværende totalverdi:
        </Typography>
        <Typography
          variant="h4"
          sx={{ color: isPositive ? "green" : "red", fontWeight: "bold" }}
        >
          {`${totalValue} NOK`}
        </Typography>
      </Box>

      <AddStockModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddStock={handleAddStock}
      />
      {selectedStock && (
        <BuyMoreModal
          open={!!selectedStock}
          onClose={() => setSelectedStock(null)}
          stock={selectedStock}
          onBuyMore={handleBuyMore}
        />
      )}
    </div>
  );
}

export default StockTable;
