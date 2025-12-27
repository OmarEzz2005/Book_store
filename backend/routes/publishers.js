import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", (req, res) => {
  db.query("SELECT * FROM Publisher", (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    res.json(results);
  });
});

// -------------------------
// GET single publisher by ID
// -------------------------
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM Publisher WHERE publisher_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ error: "Publisher not found" });
    res.json(results[0]);
  });
});

// -------------------------
// CREATE a new publisher
// -------------------------
router.post("/", (req, res) => {
  const { name, address, phone } = req.body;
  if (!name || !address || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO Publisher (name, address, phone) VALUES (?, ?, ?)",
    [name, address, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error", details: err });
      res.json({ publisher_id: result.insertId, name, address, phone });
    }
  );
});

// -------------------------
// UPDATE an existing publisher
// -------------------------
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, address, phone } = req.body;

  if (!name || !address || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(
    "UPDATE Publisher SET name = ?, address = ?, phone = ? WHERE publisher_id = ?",
    [name, address, phone, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Database error", details: err });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Publisher not found" });
      res.json({ publisher_id: Number(id), name, address, phone });
    }
  );
});


router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM Publisher WHERE publisher_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error", details: err });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Publisher not found" });
    res.json({ message: "Publisher deleted successfully" });
  });
});

export default router;
