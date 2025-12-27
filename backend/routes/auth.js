import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.post("/signup", (req, res) => {
  const { username, password, role, fname, lname, email, phone, address } = req.body;

  if (role === "customer") {
    // Insert into Customer table
    const q = `
      INSERT INTO Customer (username, password, fname, lname, email, phone, address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(q, [username, password, fname, lname, email, phone, address], (err, result) => {
      if (err) return res.status(500).json(err);

      // create cart automatically
      db.query("INSERT INTO Cart (customer_id) VALUES (?)", [result.insertId]);

      res.json("Customer registered");
    });
  } else if (role === "admin") {
    // Insert into Admin table
    const q = `
      INSERT INTO Admin (username, password)
      VALUES (?, ?)
    `;
    db.query(q, [username, password], (err, result) => {
      if (err) return res.status(500).json(err);

      res.json("Admin registered");
    });
  } else {
    return res.status(400).json({ error: "Invalid role" });
  }
});


// LOGIN (CUSTOMER OR ADMIN)
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const customerQ = `
    SELECT customer_id AS id, 'customer' AS role
    FROM Customer
    WHERE username=? AND password=?
  `;

  db.query(customerQ, [username, password], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0) return res.json(data[0]);

    const adminQ = `
      SELECT admin_id AS id, 'admin' AS role
      FROM Admin
      WHERE username=? AND password=?
    `;

    db.query(adminQ, [username, password], (err2, data2) => {
      if (err2) return res.status(500).json(err2);
      if (data2.length === 0) return res.status(401).json("Invalid credentials");
      res.json(data2[0]);
    });
  });
});

export default router;
