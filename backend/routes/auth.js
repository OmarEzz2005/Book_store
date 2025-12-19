import express from "express";
import { db } from "../db.js";

const router = express.Router();

// SIGNUP
router.post("/signup", (req, res) => {
  const { username, password, role, fname, lname, email, phone, address } = req.body;

  if (!username || !password || !role) return res.status(400).json({ error: "Missing required fields" });

  db.query("SELECT id FROM users WHERE username=?", [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: "Username exists" });

    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, role], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const userId = result.insertId;

      if (role === "customer") {
        db.query("INSERT INTO customers (user_id, fname, lname, email, phone, address) VALUES (?,?,?,?,?,?)",
          [userId, fname, lname, email, phone, address],
          (err) => err ? res.status(500).json({ error: err.message }) : res.json({ message: "Customer registered" })
        );
      } else {
        db.query("INSERT INTO admins (user_id) VALUES (?)", [userId],
          (err) => err ? res.status(500).json({ error: err.message }) : res.json({ message: "Admin registered" })
        );
      }
    });
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username/password required" });

  db.query("SELECT * FROM users WHERE username=? AND password=?", [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];

    if (user.role === "customer") {
      db.query("SELECT * FROM customers WHERE user_id=?", [user.id], (err, customerResults) => {
        if (err) return res.status(500).json(err);
        const customer = customerResults[0];
        res.json({ ...user, ...customer });
      });
    } else {
      res.json({ ...user }); // admins have no extra fields
    }
  });
});

export default router;
