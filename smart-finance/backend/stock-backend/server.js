const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const sqlite3 = require("sqlite3").verbose();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000", // Lokal utvikling
    "https://your-frontend-url.com", // Sett inn URL-en til frontend-distribusjonen din
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());

// Koble til SQLite-databasen
const dbPath = process.env.DB_PATH || "./stocks.db";
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database.");
});

// Opprett nødvendige tabeller
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS stocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      price REAL NOT NULL,
      purchasePrice REAL NOT NULL,
      userId INTEGER NOT NULL,
      FOREIGN KEY (userId) REFERENCES users (id)
    )
  `);
});

// Middleware for autentisering
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secret_key");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden" });
  }
};

// Registrer en ny bruker
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
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        (err) => {
          if (err) {
            if (err.code === "SQLITE_CONSTRAINT") {
              res.status(400).json({ message: "Brukernavnet er allerede i bruk" });
            } else {
              res.status(500).json({ message: err.message });
            }
          } else {
            res.status(201).json({ message: "Bruker opprettet" });
          }
        }
      );
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Logg inn en bruker
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid username or password" });

    const token = jwt.sign({ userId: user.id }, "secret_key", { expiresIn: "1h" });
    res.json({ token });
  });
});

// Hent brukerdata
app.get("/user", authenticate, (req, res) => {
  db.get(`SELECT id, username FROM users WHERE id = ?`, [req.userId], (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });
});

// Hent aksjer for innlogget bruker
app.get("/stocks", authenticate, (req, res) => {
  db.all(`SELECT * FROM stocks WHERE userId = ?`, [req.userId], (err, stocks) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(stocks);
  });
});

// Legg til ny aksje
app.post("/stocks", authenticate, (req, res) => {
  const { name, symbol, price, purchasePrice } = req.body;

  if (!name || !symbol || !price || !purchasePrice) {
    return res.status(400).json({ message: "Alle feltene er påkrevd." });
  }

  db.run(
    `INSERT INTO stocks (name, symbol, price, purchasePrice, userId) VALUES (?, ?, ?, ?, ?)`,
    [name, symbol, price, purchasePrice, req.userId],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ id: this.lastID, name, symbol, price, purchasePrice });
    }
  );
});

// Slett aksje
app.delete("/stocks/:id", authenticate, (req, res) => {
  db.run(
    `DELETE FROM stocks WHERE id = ? AND userId = ?`,
    [req.params.id, req.userId],
    function (err) {
      if (err) return res.status(500).json({ message: err.message });
      if (this.changes === 0) {
        return res.status(404).json({ message: "Aksjen ble ikke funnet eller tilhører ikke deg." });
      }
      res.json({ message: "Aksjen er slettet" });
    }
  );
});

// Start serveren
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running!");
});


