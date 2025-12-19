import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get customer info by user id
router.get("/:id", (req, res) => {
  const userId = req.params.id;

  const query = `
    SELECT u.id AS userId, u.username, u.role, c.fname, c.lname, c.email, c.phone, c.address
    FROM users u
    JOIN customers c ON u.id = c.user_id
    WHERE u.id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ error: "Customer not found" });
    res.json(results[0]);
  });
});

// Update customer info
router.put("/:id", (req, res) => {
  const userId = req.params.id;
  const { username, password, fname, lname, email, phone, address } = req.body;

  // Update users table
  db.query(
    "UPDATE users SET username=?, password=? WHERE id=?",
    [username, password, userId],
    (err) => {
      if (err) return res.status(500).json(err);

      // Update customers table
      db.query(
        "UPDATE customers SET fname=?, lname=?, email=?, phone=?, address=? WHERE user_id=?",
        [fname, lname, email, phone, address, userId],
        (err2) => {
          if (err2) return res.status(500).json(err2);

          res.json({ id: userId, username, fname, lname, email, phone, address });
        }
      );
    }
  );
});

export default router;
