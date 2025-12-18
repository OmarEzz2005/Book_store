import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Admin({ books, setBooks, orders = [], setOrders = () => {}, currentUser, setCurrentUser }) {
  const [book, setBook] = useState({
    isbn: "",
    title: "",
    price: "",
    category: "",
    pub_year: "",
    publisher_id: "",
    threshold: "",
    qty: "",
  });

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ price: "", qty: "", threshold: "" });

  // Input change for Add Book form
  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  // Add new book
  const handleAddBook = () => {
    for (let key in book) {
      if (!book[key]) {
        alert("All fields are required");
        return;
      }
    }
    setBooks([
      ...books,
      {
        id: Date.now(),
        ...book,
        price: Number(book.price),
        qty: Number(book.qty),
        threshold: Number(book.threshold),
        pub_year: Number(book.pub_year),
      },
    ]);

    setBook({
      isbn: "",
      title: "",
      price: "",
      category: "",
      pub_year: "",
      publisher_id: "",
      threshold: "",
      qty: "",
    });
  };

  // Delete book safely
  const handleDelete = (id) => {
    const hasOrders = orders.some(order =>
      order.items.some(item => item.id === id)
    );
    if (hasOrders) {
      alert("Cannot delete a book with existing orders!");
      return;
    }
    setBooks(books.filter(b => b.id !== id));
  };

  // Save edited book
  const handleEditSave = (id) => {
    setBooks(
      books.map(b =>
        b.id === id
          ? {
              ...b,
              ...editData,
              price: Number(editData.price),
              qty: Number(editData.qty),
              threshold: Number(editData.threshold),
            }
          : b
      )
    );
    setEditId(null);
    setEditData({ price: "", qty: "", threshold: "" });
  };

  // Filter books
  const filteredBooks = books.filter(
    b => b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search)
  );

  return (
    <div className="min-h-screen flex flex-col">
       <Navbar currentUser={currentUser} />
      <main className="flex-1 p-6 max-w-4xl mx-auto">

         {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Add Book */}
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">Add New Book</h2>
          {Object.keys(book).map(key => (
            <input
              key={key}
              className="input mb-2"
              name={key}
              placeholder={key.replace("_", " ").toUpperCase()}
              value={book[key]}
              onChange={handleChange}
            />
          ))}
          <button
            onClick={handleAddBook}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Add Book
          </button>
        </div>

        {/* Search */}
        <input
          className="input mb-4"
          placeholder="Search by Title or ISBN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Book List */}
        <div className="mb-10">
          <h2 className="font-semibold mb-2">Inventory</h2>
          {filteredBooks.length === 0 ? (
            <p className="text-gray-500">No books found.</p>
          ) : (
            filteredBooks.map(b => (
              <div key={b.id} className="border p-3 rounded mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-sm text-gray-600">ISBN: {b.isbn}</p>
                    <p className="text-sm">Category: {b.category}</p>
                    <p className="text-sm">Publisher ID: {b.publisher_id}</p>
                    {b.qty <= b.threshold && (
                      <p className="text-red-500 font-semibold mt-1">⚠ Low Stock</p>
                    )}
                  </div>

                  <div className="space-x-2">
                    <button
                      className="text-blue-500"
                      onClick={() => {
                        setEditId(b.id);
                        setEditData({
                          price: b.price,
                          qty: b.qty,
                          threshold: b.threshold,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button className="text-red-500" onClick={() => handleDelete(b.id)}>
                      Delete
                    </button>
                  </div>
                </div>

                {editId === b.id && (
                  <div className="mt-3 space-y-2">
                    {["price", "qty", "threshold"].map(field => (
                      <input
                        key={field}
                        className="input"
                        type="number"
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={editData[field]}
                        onChange={(e) =>
                          setEditData({ ...editData, [field]: e.target.value })
                        }
                      />
                    ))}
                    <button
                      className="bg-green-500 text-white px-4 py-1 rounded"
                      onClick={() => handleEditSave(b.id)}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Orders Management */}
        <div>
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="border p-4 rounded mb-4">
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Customer:</strong> {order.customer}</p>
                <p><strong>Total:</strong> ${order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <div className="mt-2">
                  <p className="font-semibold">Items:</p>
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm">- {item.title} (${item.price})</p>
                  ))}
                </div>

                {order.status === "Pending" && (
                  <div className="mt-3 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        setOrders(
                          orders.map(o =>
                            o.id === order.id ? { ...o, status: "Confirmed" } : o
                          )
                        )
                      }
                    >
                      Confirm
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() =>
                        setOrders(
                          orders.map(o =>
                            o.id === order.id ? { ...o, status: "Cancelled" } : o
                          )
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
