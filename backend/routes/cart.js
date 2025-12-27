import express from "express";
import { db } from "../db.js";

const router = express.Router();

// ADD TO CART
router.post("/", (req, res) => {
  const { cart_id, isbn, qty } = req.body;

  const q = `
    INSERT INTO Cart_Item (cart_id, isbn, qty)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE qty = qty + VALUES(qty)
  `;

  db.query(q, [cart_id, isbn, qty], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Cart updated");
  });
});




router.get("/:cart_id", (req, res) => {
  const q = `
    SELECT b.isbn, b.title, b.price, c.qty
    FROM Cart_Item c
    JOIN Book b ON b.isbn = c.isbn
    WHERE c.cart_id=?
  `;
  db.query(q, [req.params.cart_id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});



router.put("/:cart_id", (req, res) => {
  const { isbn, qty } = req.body;
  const { cart_id } = req.params;

  // Update quantity but never go below 1
  const q = `
    UPDATE Cart_Item
    SET qty = GREATEST(qty + ?, 1)
    WHERE cart_id = ? AND isbn = ?
  `;

  db.query(q, [qty, cart_id, isbn], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Item not found in cart" });

    res.json({ message: "Cart updated" });
  });
});








router.delete("/:cart_id/:isbn", (req, res) => {
  db.query(
    "DELETE FROM Cart_Item WHERE cart_id=? AND isbn=?",
    [req.params.cart_id, req.params.isbn],
    err => err ? res.status(500).json(err) : res.json("Item removed")
  );
});



export default router;


