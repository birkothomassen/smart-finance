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

app.delete("/stocks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await Stock.findByIdAndDelete(id);
      res.json({ message: "Aksje slettet" });
    } catch (error) {
      console.error("Error deleting stock:", error);
      res.status(500).json({ error: "Kunne ikke slette aksjen" });
    }
  });

  //buy more
  app.patch("/stocks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { additionalAmount } = req.body;
      const stock = await Stock.findById(id);
      stock.price += additionalAmount;
      await stock.save();
      res.json(stock);
    } catch (error) {
      console.error("Error updating stock:", error);
      res.status(500).json({ error: "Kunne ikke oppdatere aksjen" });
    }
  });
  