import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import AppRoutes from "./routes/Routes";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);


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
