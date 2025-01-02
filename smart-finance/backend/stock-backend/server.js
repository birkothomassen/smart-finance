const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB-tilkobling
mongoose.connect("mongodb://localhost:27017/stocks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Definer Stock-modellen
const stockSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  price: Number,
  purchasePrice: Number, // Legg til purchasePrice
});

const Stock = mongoose.model("Stock", stockSchema);

// Hent alle aksjer
app.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Legg til ny aksje
app.post("/stocks", async (req, res) => {
  const { name, symbol, price, purchasePrice } = req.body; // Ta imot purchasePrice
  const stock = new Stock({ name, symbol, price, purchasePrice });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Slett aksje
app.delete("/stocks/:id", async (req, res) => {
  try {
    await Stock.findByIdAndDelete(req.params.id);
    res.json({ message: "Aksjen er slettet" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start serveren
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
