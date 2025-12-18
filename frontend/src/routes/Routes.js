import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login"; 
import Signup from "../pages/Signup"; 
import Dashboard from "../pages/Dashboard"; 
import Admin from "../pages/Admin"; 
import Books from "../pages/Books"; 
import Cart from "../pages/Cart"; 
import ProtectedRoute from "./ProtectedRoute";


export default function AppRoutes({
  currentUser,
  setCurrentUser,
  users,
  setUsers,
  cart,
  setCart,
  books,
  setBooks,
  orders,
  setOrders,
}) {
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/"
        element={<Login users={users} setCurrentUser={setCurrentUser} />}
      />
      <Route
        path="/signup"
        element={<Signup setUsers={setUsers} setCurrentUser={setCurrentUser} />}
      />

      {/* Customer */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute currentUser={currentUser} role="customer">
            <Dashboard
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              orders={orders}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/books"
        element={
          <ProtectedRoute currentUser={currentUser} role="customer">
            <Books
              books={books}
              cart={cart}
              setCart={setCart}
              currentUser={currentUser}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute currentUser={currentUser} role="customer">
            <Cart
              cart={cart}
              setCart={setCart}
              currentUser={currentUser}
              orders={orders}
              setOrders={setOrders}
            />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute currentUser={currentUser} role="admin">
            <Admin
              books={books}
              setBooks={setBooks}
              orders={orders}
              setOrders={setOrders}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
            />
          </ProtectedRoute>
        }
      />
    </Routes> 
  );
}
