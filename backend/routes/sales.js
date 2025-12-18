import express from "express";
import { db } from "../db.js";

const router = express.Router();

// MAKE SALE
router.post("/", (req, res) => {
  const { customer_id, total } = req.body;

  db.query(
    "INSERT INTO Sales (customer_id, sale_date, total) VALUES (?, NOW(), ?)",
    [customer_id, total],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ sale_id: result.insertId });
    }
  );
});

export default router;
