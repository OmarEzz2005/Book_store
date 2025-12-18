import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // import cart icon

export default function Navbar({ currentUser, cart }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">Bookstore</Link>

      <div className="space-x-4 flex items-center">
        {currentUser?.role === "customer" && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/books" className="hover:underline">Books</Link>

            <Link to="/cart" className="hover:underline relative flex items-center">
              <FaShoppingCart size={20} className="mr-1" />
              Cart
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
          </>
        )}

        {currentUser?.role === "admin" && (
          <Link to="/admin" className="hover:underline">Admin Panel</Link>
        )}
      </div>
    </nav>
  );
}
