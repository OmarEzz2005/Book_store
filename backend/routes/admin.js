import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Admin login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM Admin WHERE username=? AND password=?",
    [username, password],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(401).json("Invalid admin");
      res.json(data[0]);
    }
  );
});

// Low stock books
router.get("/low-stock", (req, res) => {
  const q = "SELECT * FROM Book WHERE qty <= threshold";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Order from publisher
router.post("/order-publisher", (req, res) => {
  const { isbn, publisher_id, qty } = req.body;

  db.query(
    `INSERT INTO Orders_From_Publishers 
     (isbn, publisher_id, qty, order_date, status)
     VALUES (?, ?, ?, NOW(), 'Pending')`,
    [isbn, publisher_id, qty],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Order sent to publisher");
    }
  );
});

export default router;
