import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Books({ currentUser, cart, setCart }) {
  const [books, setBooks] = useState([]);

  // Fetch books from backend
  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (book) => {
    if (!currentUser) {
      alert("Please log in to add books to cart");
      return;
    }

    // Check if already in cart
    if (cart.some(item => item.isbn === book.isbn)) {
      alert("Book already in cart");
      return;
    }

    // Call backend to add to cart
    axios.post(`http://localhost:5000/cart/${currentUser.customer_id}`, {
      isbn: book.isbn,
      qty: 1
    })
    .then(res => {
      setCart([...cart, res.data]); // Update cart in frontend
      alert(`${book.title} added to cart`);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} cart={cart} />

      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Books</h1>

        {books.length === 0 ? (
          <p className="text-gray-500">No books available.</p>
        ) : (
          books.map(book => (
            <div key={book.isbn} className="border p-4 mb-3 rounded">
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-gray-600">Publisher ID: {book.publisher_id}</p>
              <p className="font-bold">${book.price}</p>
              <p className="text-sm">Category: {book.category}</p>
              <p className="text-sm">Available: {book.qty}</p>

              <button
                onClick={() => addToCart(book)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
