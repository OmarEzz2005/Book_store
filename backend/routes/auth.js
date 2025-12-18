import express from "express";
import { db } from "../db.js";

const router = express.Router();

// CUSTOMER LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM Customer WHERE username=? AND password=?",
    [username, password],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(401).json("Invalid login");
      res.json(data[0]);
    }
  );
});

export default router;
