import express from "express";
import { db } from "../db.js";

const router = express.Router();

// ADD TO CART
router.post("/", (req, res) => {
  const { cart_id, isbn, qty } = req.body;

  db.query(
    "INSERT INTO Cart_Item VALUES (?,?,?)",
    [cart_id, isbn, qty],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Added to cart");
    }
  );
});

export default router;
