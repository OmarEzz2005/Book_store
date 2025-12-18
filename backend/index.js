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

  // Check if username exists in users table
  const checkQuery = "SELECT * FROM users WHERE username = ?";
  db.query(checkQuery, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0)
      return res.status(400).json({ error: "Username already exists" });

    // Insert into users table
    const insertUsers = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";
    db.query(insertUsers, [username, password, role], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Also insert into Admin or Customer
      if (role === "admin") {
        db.query("INSERT INTO Admin (username, password) VALUES (?, ?)", [username, password]);
      } else {
        db.query(
          "INSERT INTO Customer (username, password, fname, lname, email, phone, address) VALUES (?, ?, '', '', '', '', '')",
          [username, password]
        );
      }

      res.json({ message: "User registered successfully" });
    });
  });
});

// ======================
// LOGIN ROUTE
// ======================
app.post("/login", (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required" });
  }

  const table = role === "admin" ? "Admin" : "Customer";
  const idField = role === "admin" ? "admin_id" : "customer_id";

  const query = `SELECT * FROM ${table} WHERE username = ? AND password = ?`;
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(400).json({ error: "Invalid username or password" });

    const user = results[0];
    res.json({
      id: user[idField],
      username: user.username,
      role: role,
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
