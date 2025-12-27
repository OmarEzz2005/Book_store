import express from "express";
import { db } from "../db.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
  SELECT 
    b.isbn,
    b.title,
    b.price,
    b.stock_qty,
    b.threshold,
    b.publisher_id,
    b.cat_id,
    GROUP_CONCAT(a.name) AS authors
  FROM Book b
  LEFT JOIN Book_Author ba ON b.isbn = ba.isbn
  LEFT JOIN Author a ON ba.author_id = a.author_id
  GROUP BY b.isbn;
`);

    
    const books = rows.map(book => ({
      ...book,
      authors: book.authors ? book.authors.split(",") : []
    }));

    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});



router.post("/", async (req, res) => {
  try {
    const { isbn, title, pub_year, price, stock_qty, threshold, publisher_id, cat_id, authors } = req.body;

    // --- Validate required fields
    if (!isbn || !title || !pub_year || !price || !stock_qty || !threshold || !publisher_id || !cat_id)
      return res.status(400).json({ error: "All fields are required" });

    // --- Insert book
    await new Promise((resolve, reject) => {
      const q = `
        INSERT INTO Book (isbn, title, pub_year, price, stock_qty, threshold, publisher_id, cat_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(q, [isbn, title, pub_year, price, stock_qty, threshold, publisher_id, cat_id], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // --- Insert authors if any
    if (authors && authors.length > 0) {
      for (const name of authors) {
        let authorId = await new Promise((resolve, reject) => {
          db.query("SELECT author_id FROM Author WHERE name=?", [name], (err, data) => {
            if (err) return reject(err);
            if (data.length > 0) resolve(data[0].author_id);
            else {
              db.query("INSERT INTO Author (name) VALUES (?)", [name], (err2, result) => {
                if (err2) return reject(err2);
                resolve(result.insertId);
              });
            }
          });
        });

        // Insert into Book_Author
        await new Promise((resolve, reject) => {
          db.query("INSERT INTO Book_Author (isbn, author_id) VALUES (?, ?)", [isbn, authorId], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      }
    }

    res.json({ isbn, title, pub_year, price, stock_qty, threshold, publisher_id, cat_id, authors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



router.put("/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const { qty, price, threshold, publisher_id } = req.body;
  const stock_qty = qty; // define stock_qty from qty

  try {
    // Update only qty (and other fields if needed)
    await db.promise().query(
      `UPDATE Book
       SET stock_qty = ?
       WHERE isbn = ?`,
      [stock_qty, isbn]
    );

    // Fetch updated book
    const [updated] = await db.promise().query(
      "SELECT * FROM Book WHERE isbn = ?",
      [isbn]
    );

    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update book" });
  }
});



router.delete("/:isbn", async (req, res) => {
  const { isbn } = req.params;

  try {
    // First, delete from Book_Author (foreign key dependency)
    await db.promise().query("DELETE FROM Book_Author WHERE isbn = ?", [isbn]);

    // Then, delete from Book
    const [result] = await db.promise().query("DELETE FROM Book WHERE isbn = ?", [isbn]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete book" });
  }
});




export default router;
