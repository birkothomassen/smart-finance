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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const calculatePercentageChange = (purchasePrice, currentPrice) => {
    if (!purchasePrice || !currentPrice) return "";
    const change = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    const formattedChange = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    return { formattedChange, isPositive: change >= 0 };
  };

  const calculateTotalValue = () => {
    let totalPurchaseValue = 0;
    let totalCurrentValue = 0;

    stocks.forEach((stock) => {
      const currentPrice = currentPrices[stock.symbol];
      if (currentPrice) {
        totalPurchaseValue += stock.purchasePrice * (stock.price / stock.purchasePrice);
        totalCurrentValue += currentPrice * (stock.price / stock.purchasePrice);
      }
    });

    const isPositive = totalCurrentValue >= totalPurchaseValue;
    return {
      totalValue: totalCurrentValue.toFixed(2),
      isPositive,
    };
  };

  const { totalValue, isPositive } = calculateTotalValue();

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
                  <strong>Kurs ved kjøp:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Nåværende kurs:</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Handlinger</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Total verdi:</strong>
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
                      ? (
                        <>
                          {`${currentPrices[stock.symbol].toFixed(2)} NOK `}
                          <span
                            style={{
                              color: calculatePercentageChange(
                                stock.purchasePrice,
                                currentPrices[stock.symbol]
                              ).isPositive
                                ? "green"
                                : "red",
                            }}
                          >
                            {calculatePercentageChange(
                              stock.purchasePrice,
                              currentPrices[stock.symbol]
                            ).formattedChange}
                          </span>
                        </>
                      )
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
                  <TableCell align="right">
                    <span style={{ color: isPositive ? "green" : "red" }}>
                      {`${totalValue} NOK`}
                    </span>
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
