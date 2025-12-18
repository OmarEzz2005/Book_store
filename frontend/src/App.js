import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";

import { usersDB, booksDB, ordersDB } from "./pseudoDB";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(usersDB);
  const [books, setBooks] = useState(booksDB);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(ordersDB);

  return (
    <Router>
      <AppRoutes
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        users={users}
        setUsers={setUsers}
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
