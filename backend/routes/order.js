import express from "express";
import { db } from "../db.js";

const router = express.Router();

// CHECKOUT
router.post("/checkout", (req, res) => {
  const { customer_id, credit_card_no, expiry_date } = req.body;

  if (!customer_id || !credit_card_no || !expiry_date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // 1. Get cart_id for this customer
  const cartQ = `SELECT cart_id FROM Cart WHERE customer_id = ?`;
  db.query(cartQ, [customer_id], (err, cartRows) => {
    if (err) return res.status(500).json(err);
    if (cartRows.length === 0) return res.status(400).json({ error: "Cart not found" });

    const cart_id = cartRows[0].cart_id;

    // 2. Create order
    const orderQ = `
  INSERT INTO Customer_Order
  (customer_id, order_date, credit_card_no, expiry_date, total_price)
  VALUES (?, CURDATE(), ?, ?, 0)
`;
db.query(orderQ, [customer_id, credit_card_no, expiry_date], (err2, result) => {
  if (err2) return res.status(500).json(err2);

  const orderId = result.insertId;

  // 3. Fetch cart items first and insert into Customer_Order_Book
  const itemsQ = `
    SELECT c.isbn, c.qty, b.price
    FROM Cart_Item c
    JOIN Book b ON c.isbn = b.isbn
    WHERE c.cart_id=?
  `;
  db.query(itemsQ, [cart_id], (err3, cartItems) => {
    if (err3) return res.status(500).json(err3);

    if (cartItems.length === 0) return res.status(400).json({ error: "Cart is empty" });

    const insertValues = cartItems.map(item => [orderId, item.isbn, item.qty, item.price]);
    const insertQ = `INSERT INTO Customer_Order_Book (order_id, isbn, qty, price_at_purchase) VALUES ?`;

    db.query(insertQ, [insertValues], (err4) => {
      if (err4) return res.status(500).json(err4);

      // 4. Clear cart
      db.query("DELETE FROM Cart_Item WHERE cart_id=?", [cart_id], (err5) => {
        if (err5) return res.status(500).json(err5);

        res.json({ message: "Checkout successful", order_id: orderId });
      });
    });
  });
});
  });
});





// Get all customer orders (for admin)
router.get("/customers", (req, res) => {
  const q = `
    SELECT o.order_id, o.order_date, o.status, c.username, b.title, ob.qty
    FROM Customer_Order o
    JOIN Customer_Order_Book ob ON o.order_id = ob.order_id
    JOIN Customer c ON o.customer_id = c.customer_id
    JOIN Book b ON ob.isbn = b.isbn
    ORDER BY o.order_date DESC
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});


// Get all publisher orders (for admin) WITH publisher name
router.get("/publishers", (req, res) => {
  const q = `
    SELECT po.order_id, po.order_date, po.status, pub.name AS publisher_name,
           b.title, pob.qty
    FROM Publisher_Order po
    JOIN Publisher_Order_Book pob ON po.order_id = pob.order_id
    JOIN Book b ON b.isbn = pob.isbn
    JOIN Publisher pub ON po.publisher_id = pub.publisher_id
    ORDER BY po.order_date DESC
  `;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// Confirm customer order
router.put("/customers/:order_id/confirm", (req, res) => {
  const { order_id } = req.params;
  db.query(
    "UPDATE Customer_Order SET status='confirmed' WHERE order_id=?",
    [order_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Order confirmed" });
    }
  );
});

// Delete customer order
router.delete("/customers/:order_id", (req, res) => {
  const { order_id } = req.params;
  db.query(
    "DELETE FROM Customer_Order WHERE order_id=?",
    [order_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Order deleted" });
    }
  );
});

// Similarly for publisher orders
router.put("/publishers/:order_id/confirm", (req, res) => {
  const { order_id } = req.params;
  db.query(
    "UPDATE Publisher_Order SET status='confirmed' WHERE order_id=?",
    [order_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Publisher order confirmed" });
    }
  );
});

router.delete("/publishers/:order_id", (req, res) => {
  const { order_id } = req.params;

  // 1. Delete items first
  db.query(
    "DELETE FROM Publisher_Order_Book WHERE order_id=?",
    [order_id],
    (err) => {
      if (err) return res.status(500).json(err);

      // 2. Delete the order
      db.query(
        "DELETE FROM Publisher_Order WHERE order_id=?",
        [order_id],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "Publisher order deleted" });
        }
      );
    }
  );
});


// GET all orders for a specific customer
router.get("/customer/:customer_id", (req, res) => {
  const customerId = req.params.customer_id;
  const q = `
    SELECT o.order_id, o.order_date, o.status, b.title, ob.qty
    FROM Customer_Order o
    JOIN Customer_Order_Book ob ON o.order_id = ob.order_id
    JOIN Book b ON ob.isbn = b.isbn
    WHERE o.customer_id = ?
    ORDER BY o.order_date DESC
  `;
  db.query(q, [customerId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});


export default router;
