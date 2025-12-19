import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Admin login (optional if handled by auth.js)
// router.post("/login", ...)

// Low stock books
router.get("/low-stock", (req, res) => {
  db.query("SELECT * FROM Book WHERE qty <= threshold", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Order from publisher
router.post("/order-publisher", (req, res) => {
  const { isbn, publisher_id, qty } = req.body;
  db.query(
    "INSERT INTO Orders_From_Publishers (isbn, publisher_id, qty, order_date, status) VALUES (?, ?, ?, NOW(), 'Pending')",
    [isbn, publisher_id, qty],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Order sent to publisher");
    }
  );
});

export default router;
