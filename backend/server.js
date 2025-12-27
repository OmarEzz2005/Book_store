import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import cartRoutes from "./routes/cart.js";
import adminRoutes from "./routes/admin.js";
import customerRoutes from "./routes/customer.js";
import publishersRoutes from "./routes/publishers.js";
import ordersRoutes from "./routes/order.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/cart", cartRoutes);
app.use("/admin", adminRoutes);
app.use("/customers", customerRoutes);
app.use("/publishers", publishersRoutes);
app.use("/orders", ordersRoutes);

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
