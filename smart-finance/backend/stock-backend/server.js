const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/stocks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const stockSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const Stock = mongoose.model("Stock", stockSchema);

// Routes
app.get("/stocks", async (req, res) => {
  const stocks = await Stock.find();
  res.json(stocks);
});

app.post("/stocks", async (req, res) => {
  const { name, price } = req.body;
  const stock = new Stock({ name, price });
  await stock.save();
  res.json(stock);
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
