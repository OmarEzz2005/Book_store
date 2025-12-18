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
router.post("/", (req, res) => {
  db.query("INSERT INTO Book SET ?", req.body, (err) => {
    if (err) return res.status(500).json(err);
    res.json("Book added");
  });
});

export default router;
