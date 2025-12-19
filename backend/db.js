import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bookstore",
});

db.connect(err => {
  if (err) console.error("Database connection error:", err);
  else console.log("Connected to MySQL database");
});
