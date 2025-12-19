import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET ALL BOOKS
router.get("/", (req, res) => {
  const q = `
    SELECT b.*, p.name AS publisher
    FROM Book b
    LEFT JOIN Publisher p ON b.publisher_id = p.publisher_id
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ADD BOOK (ADMIN)
// ADD BOOK (ADMIN)
router.post("/", (req, res) => {
  try {
    const { isbn, title, price, category, pub_year, publisher_id, threshold, qty } = req.body;

    // Validate required fields
    if (!isbn || !title || !price || !category || !pub_year || !publisher_id || !threshold || !qty) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Convert numeric fields
    const newBook = {
      isbn,
      title,
      price: Number(price),
      category,
      pub_year: Number(pub_year),
      publisher_id: Number(publisher_id),
      threshold: Number(threshold),
      qty: Number(qty),
    };

    // Insert into DB
    db.query("INSERT INTO Book SET ?", newBook, (err, result) => {
      if (err) {
        console.error("DB Error:", err);

        // Foreign key constraint error
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({ error: "Invalid publisher ID. Please select a valid publisher." });
        }

        return res.status(500).json({ error: "Failed to add book", details: err.sqlMessage });
      }

      // Return the newly inserted book
      res.status(201).json(newBook);
    });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});


export default router;