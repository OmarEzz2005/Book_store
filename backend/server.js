import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import authorRoutes from "./routes/authors.js";
import publisherRoutes from "./routes/publishers.js";
import cartRoutes from "./routes/cart.js";
import salesRoutes from "./routes/sales.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/admin", adminRoutes);

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
