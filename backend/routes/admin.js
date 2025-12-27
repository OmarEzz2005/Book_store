import express from "express";
import { db } from "../db.js";

const router = express.Router();

// LOW STOCK BOOKS
router.get("/low-stock", (req, res) => {
  const q = `
    SELECT *
    FROM Book
    WHERE stock_qty < threshold
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// CONFIRM PUBLISHER ORDER
router.put("/confirm-order/:orderId", (req, res) => {
  const { orderId } = req.params;

  db.query(
    "UPDATE Publisher_Order SET status='Confirmed' WHERE order_id=?",
    [orderId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Order confirmed and stock updated");
    }
  );
});




router.get("/publisher-orders", (req, res) => {
  const q = `
    SELECT po.order_id, po.order_date, po.status,
           b.title, pob.qty
    FROM Publisher_Order po
    JOIN Publisher_Order_Book pob ON po.order_id = pob.order_id
    JOIN Book b ON b.isbn = pob.isbn
    WHERE po.status='Pending'
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});






router.get("/reports/last-month", (req, res) => {
  db.query(`
    SELECT SUM(total_price) AS total_sales
    FROM Customer_Order
    WHERE order_date >= CURDATE() - INTERVAL 1 MONTH
  `, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0]);
  });
});




router.get("/reports/by-date/:date", (req, res) => {
  db.query(`
    SELECT SUM(total_price) AS total_sales
    FROM Customer_Order
    WHERE order_date=?
  `, [req.params.date], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0]);
  });
});



router.get("/reports/top-customers", (req, res) => {
  db.query(`
    SELECT c.customer_id, c.username, SUM(o.total_price) total
    FROM Customer_Order o
    JOIN Customer c ON c.customer_id=o.customer_id
    WHERE o.order_date >= CURDATE() - INTERVAL 3 MONTH
    GROUP BY c.customer_id
    ORDER BY total DESC
    LIMIT 5
  `, (err, data) => res.json(data));
});




router.get("/reports/top-books", (req, res) => {
  db.query(`
    SELECT b.title, SUM(ob.qty) sold
    FROM Customer_Order_Book ob
    JOIN Book b ON b.isbn=ob.isbn
    WHERE ob.order_id IN (
      SELECT order_id FROM Customer_Order
      WHERE order_date >= CURDATE() - INTERVAL 3 MONTH
    )
    GROUP BY b.isbn
    ORDER BY sold DESC
    LIMIT 10
  `, (err, data) => res.json(data));
});




router.get("/reports/book-reorders/:isbn", (req, res) => {
  db.query(`
    SELECT COUNT(*) AS times_ordered
    FROM Publisher_Order_Book
    WHERE isbn=?
  `, [req.params.isbn], (err, data) => res.json(data[0]));
});


export default router;
