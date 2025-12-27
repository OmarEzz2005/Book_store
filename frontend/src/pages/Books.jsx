import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Books({ currentUser, cart, setCart }) {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");

  useEffect(() => {
    fetchBooks();
    fetchPublishers();
  }, []);

  const fetchBooks = () => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  const fetchPublishers = () => {
    axios.get("http://localhost:5000/publishers")
      .then(res => setPublishers(res.data))
      .catch(err => console.error(err));
  };



const categories = {
  1: "Science",
  2: "Art",
  3: "Religion",
  4: "History",
  5: "Geography"
};




  
  const addToCart = (book) => {
    if (!currentUser) {
      alert("Please log in to add books to cart");
      return;
    }

    if (book.qty === 0) {
      alert("This book is out of stock");
      return;
    }

    // Check if book is already in cart
    const existingItem = cart.find(item => item.isbn === book.isbn);

    if (existingItem) {
      if (existingItem.qty >= book.qty) {
        alert("Cannot add more than available stock");
        return;
      }

      const updatedCart = cart.map(item =>
        item.isbn === book.isbn ? { ...item, qty: item.qty + 1 } : item
      );
      setCart(updatedCart);

      // Update backend cart
      axios.put(`http://localhost:5000/cart/${currentUser.id}`, { isbn: book.isbn, qty: 1 })
        .catch(err => console.error(err));
    }  else {
  const newItem = { isbn: book.isbn, title: book.title, price: book.price, qty: 1 };
  setCart([...cart, newItem]);

  // Add to backend cart - send correct fields
  axios.post("http://localhost:5000/cart", {
    cart_id: currentUser.id,  // <-- required
    isbn: book.isbn,
    qty: 1
  }).catch(err => console.error(err));
}

    alert(`${book.title} added to cart`);
  };

  const filteredBooks = books.filter(b =>
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      (b.authors || []).some(a => a.toLowerCase().includes(search.toLowerCase()))) &&
    (categoryFilter ? b.cat_id === Number(categoryFilter) : true) &&
    (publisherFilter ? b.publisher_id === Number(publisherFilter) : true)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} cart={cart} />

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Books</h1>

        {/* Search & Filters */}
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            className="input flex-1"
            placeholder="Search by title, ISBN, or author"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
  className="input"
  value={categoryFilter}
  onChange={e => setCategoryFilter(e.target.value)}
>
  <option value="">All Categories</option>
  {[
    { id: 1, name: "Science" },
    { id: 2, name: "Art" },
    { id: 3, name: "Religion" },
    { id: 4, name: "History" },
    { id: 5, name: "Geography" }
  ].map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>
          <select
            className="input"
            value={publisherFilter}
            onChange={e => setPublisherFilter(e.target.value)}
          >
            <option value="">All Publishers</option>
            {publishers.map(p => (
              <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <p className="text-gray-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map(book => (
              <div key={book.isbn} className="border p-4 rounded flex flex-col justify-between">
                <div>
                  <h2 className="font-semibold text-lg">{book.title}</h2>
                  <p className="text-gray-600 text-sm">ISBN: {book.isbn}</p>
                  <p className="text-sm">Category: {categories[book.cat_id] || "N/A"}</p>
                  <p className="text-sm">
                    Publisher: {publishers.find(p => p.publisher_id === book.publisher_id)?.name || "Unknown"}
                  </p>
                  <p className="text-sm">
                    Authors: {book.authors && book.authors.length > 0 ? book.authors.join(", ") : "N/A"}
                  </p>
                  <p className="font-bold mt-2">${book.price}</p>
                  <p className="text-sm">Available: {book.qty}</p>
                </div>

                <button
                  onClick={() => addToCart(book)}
                  disabled={book.qty === 0}
                  className={`mt-4 px-3 py-1 rounded text-white ${book.qty === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
                >
                  {book.qty === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
