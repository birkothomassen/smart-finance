const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const app = express();
app.use(cors());
app.use(express.json());

// Koble til MongoDB
mongoose.connect("mongodb://localhost:27017/stocks", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Mongoose-modeller
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Stock = mongoose.model("Stock", stockSchema);

// Middleware for autentisering
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secret_key");
    req.userId = decoded.userId; // Legg userId til i forespørselen
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden" });
  }
};


app.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).withMessage("Brukernavn må være minst 3 tegn."),
    body("password").isLength({ min: 5 }).withMessage("Passord må være minst 5 tegn."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();
      res.status(201).json({ message: "Bruker opprettet" });
    } catch (err) {
      if (err.code === 11000) {
        res.status(400).json({ message: "Brukernavnet er allerede i bruk" });
      } else {
        res.status(500).json({ message: err.message });
      }
    }
  }
);


app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Ruter for aksjer (beskyttet med authenticate)
app.get("/stocks", authenticate, async (req, res) => {
  try {
    const stocks = await Stock.find({ userId: req.userId }); // Hent kun aksjer for brukeren
    res.json(stocks);
  } catch (err) {
    console.error("Feil ved henting av aksjer:", err);
    res.status(500).json({ message: err.message });
  }
});



app.post("/stocks", authenticate, async (req, res) => {
  const { name, symbol, price, purchasePrice } = req.body;

  if (!name || !symbol || !price || !purchasePrice) {
    return res.status(400).json({ message: "Alle feltene er påkrevd." });
  }

  try {
    const stock = new Stock({
      name,
      symbol,
      price,
      purchasePrice,
      userId: req.userId, // Bruker ID fra token
    });

    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (err) {
    console.error("Feil ved lagring av aksjen:", err);
    res.status(400).json({ message: err.message });
  }
});


app.delete("/stocks/:id", authenticate, async (req, res) => {
  try {
    const stock = await Stock.findOneAndDelete({ _id: req.params.id, userId: req.userId }); // Slett kun aksjer for innlogget bruker

    if (!stock) {
      return res.status(404).json({ message: "Aksjen ble ikke funnet eller tilhører ikke deg." });
    }

    res.json({ message: "Aksjen er slettet" });
  } catch (err) {
    console.error("Feil ved sletting av aksjen:", err);
    res.status(500).json({ message: err.message });
  }
});

// Start serveren
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
