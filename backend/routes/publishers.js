import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET all publishers
router.get("/", (req, res) => {
  db.query("SELECT * FROM Publisher", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// ADD publisher
router.post("/", (req, res) => {
  const { publisher_id, name, address, phone } = req.body;
  if (!publisher_id || !name || !address || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const newPublisher = { publisher_id, name, address, phone };
  db.query("INSERT INTO Publisher SET ?", newPublisher, (err) => {
    if (err) return res.status(500).json({ error: "Failed to add publisher", details: err });
    res.status(201).json(newPublisher);
  });
});

export default router;
