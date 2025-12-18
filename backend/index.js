import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bookstore",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ======================
// SIGNUP ROUTE
// ======================
app.post("/signup", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Step 1: Check if username exists in users table
  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: "Username already exists" });

    // Step 2: Insert into users table
    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, role], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 3: Insert into role-specific table
      if (role === "admin") {
        db.query("INSERT INTO Admin (username, password) VALUES (?, ?)", [username, password], (err) => {
          if (err) return res.status(500).json({ error: err.message });
          return res.json({ message: "Admin registered successfully" });
        });
      } else {
        db.query(
          "INSERT INTO Customer (username, password, fname, lname, email, phone, address) VALUES (?, ?, '', '', '', '', '')",
          [username, password],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.json({ message: "Customer registered successfully" });
          }
        );
      }
    });
  });
});

// ======================
// LOGIN ROUTE
// ======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check credentials in users table
  db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "Invalid username or password" });

    const user = results[0];
    res.json({
      id: user.id,
      username: user.username,
      role: user.role
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
