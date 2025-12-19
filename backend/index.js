import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import booksRoutes from "./routes/books.js";
import cartRoutes from "./routes/cart.js";
import salesRoutes from "./routes/sales.js";
import adminRoutes from "./routes/admin.js";
import customerRoutes from "./routes/customer.js";
import publishersRoutes from "./routes/publishers.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


app.use("/", authRoutes);           
app.use("/", cartRoutes);       
app.use("/", salesRoutes);     
app.use("/", adminRoutes);      
app.use("/customers", customerRoutes);
app.use("/books", booksRoutes);
app.use("/publishers", publishersRoutes);  


// Root route
app.get("/", (req, res) => res.send("Backend running!"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
