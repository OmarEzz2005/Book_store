import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import AppRoutes from "./routes/Routes";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // Fetch books from backend
  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  // Fetch orders for current user
  useEffect(() => {
    if (!currentUser) return;

    axios.get(`http://localhost:5000/orders/${currentUser.customer_id}`)
      .then(res => setOrders(res.data))
      .catch(err => console.error("Error fetching orders:", err));
  }, [currentUser]);

  return (
    <Router>
      <AppRoutes
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        books={books}
        setBooks={setBooks}
        cart={cart}
        setCart={setCart}
        orders={orders}
        setOrders={setOrders}
      />
    </Router>
  );
}
