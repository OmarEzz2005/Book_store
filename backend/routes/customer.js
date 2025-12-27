import express from "express";
import { db } from "../db.js";

const router = express.Router();

// GET CUSTOMER
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM Customer WHERE customer_id=?",
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json("Not found");
      res.json(data[0]);
    }
  );
});

// UPDATE CUSTOMER
router.put("/:id", (req, res) => {
  const { username, password, fname, lname, email, phone, address } = req.body;

  const q = `
    UPDATE Customer
    SET username=?, password=?, fname=?, lname=?, email=?, phone=?, address=?
    WHERE customer_id=?
  `;

  db.query(q,
    [username, password, fname, lname, email, phone, address, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Profile updated");
    }
  );
});


// GET CUSTOMER ORDERS
router.get("/customer/:id", (req, res) => {
  const q = `
    SELECT o.order_id, o.order_date, o.total_price,
           b.isbn, b.title, ob.qty, ob.price_at_purchase
    FROM Customer_Order o
    JOIN Customer_Order_Book ob ON o.order_id = ob.order_id
    JOIN Book b ON b.isbn = ob.isbn
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});



export default router;
