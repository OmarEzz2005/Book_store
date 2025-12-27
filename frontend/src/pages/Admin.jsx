import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Admin({ currentUser, setCurrentUser }) {
  const [books, setBooks] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [publisherOrders, setPublisherOrders] = useState([]);
  const [reports, setReports] = useState(null);

  const [book, setBook] = useState({
    isbn: "",
    title: "",
    price: "",
    category: "",
    pub_year: "",
    publisher_id: "",
    threshold: "",
    qty: "",
    authors: [],
    newAuthor: ""
  });

  const [publisher, setPublisher] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("");

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({
    price: "",
    qty: "",
    threshold: "",
    authors: [],
    newAuthor: "",
    publisher_id: ""
  });

  // --- Map category names to IDs
  const categoryToId = (name) => {
    const categories = {
      Science: 1,
      Art: 2,
      Religion: 3,
      History: 4,
      Geography: 5
    };
    return categories[name] || null;
  };




  const idToCategory = (id) => {
    const map = {
      1: "Science",
      2: "Art",
      3: "Religion",
      4: "History",
      5: "Geography"
    };
    return map[id] || "—";
  };



  const groupedCustomerOrders = customerOrders.reduce((acc, order) => {
    const existing = acc.find(o => o.order_id === order.order_id);
    if (existing) {
      existing.books.push({ title: order.title, qty: order.qty });
    } else {
      acc.push({ ...order, books: [{ title: order.title, qty: order.qty }] });
    }
    return acc;
  }, []);





  // --- Fetch Books
  const fetchBooks = () => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error("Error fetching books:", err));
  };

  // --- Fetch Publishers
  const fetchPublishers = () => {
    axios.get("http://localhost:5000/publishers")
      .then(res => {
        console.log(res.data);
        setPublishers(res.data);
      })
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    if (!currentUser) return;

    if (currentUser.role === "admin") {
      // Admin sees all orders
      axios.get("http://localhost:5000/orders/customers")
        .then(res => setCustomerOrders(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Error fetching customer orders:", err));

      axios.get("http://localhost:5000/orders/publishers")
        .then(res => setPublisherOrders(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Error fetching publisher orders:", err));
    } else if (currentUser.role === "customer") {
      // Customers only see their own orders
      const userId = currentUser.id || currentUser.user_id; // <-- important!
      if (!userId) return console.error("User ID missing for fetching orders");

      axios.get(`http://localhost:5000/orders/customers/${userId}`)
        .then(res => setCustomerOrders(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.error("Error fetching customer orders:", err));
    }
  };


  useEffect(() => {
    fetchBooks();
    fetchPublishers(); // fetch always, not conditional
    if (currentUser) fetchOrders(); // only orders depend on user
  }, [currentUser]);;

  // --- Logout / Clear Cart
  const handleLogout = () => {
    console.log("Current user:", currentUser);
    console.log("Fetching customer orders...");
    const userId = currentUser?.id || currentUser?.user_id;
    if (currentUser?.role === "customer" && userId) {
      axios.post(`http://localhost:5000/cart/clear/${userId}`)
        .finally(() => setCurrentUser(null));
    } else {
      setCurrentUser(null);
    }
  };

  // --- Book Input Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({
      ...prev,
      [name]: name === "publisher_id" ? value : value
    }));
  };
  const handlePublisherChange = (e) => setPublisher({ ...publisher, [e.target.name]: e.target.value });

  // --- Add Book
  const handleAddBook = async () => {
    const requiredFields = ["isbn", "title", "price", "category", "pub_year", "publisher_id", "threshold", "qty"];
    for (let key of requiredFields) {
      if (!book[key]) return alert("All fields are required");
    }
    if (!book.authors || book.authors.length === 0) return alert("Add at least 1 author");

    const newBook = {
      isbn: book.isbn,
      title: book.title,
      pub_year: Number(book.pub_year),
      price: Number(book.price),
      stock_qty: Number(book.qty),
      threshold: Number(book.threshold),
      publisher_id: Number(book.publisher_id),
      cat_id: categoryToId(book.category),
      authors: book.authors
    };

    try {
      console.log("Adding Book Payload:", newBook);
      const res = await axios.post("http://localhost:5000/books", newBook);
      setBooks([...books, res.data]);
      setBook({
        isbn: "",
        title: "",
        price: "",
        category: "",
        pub_year: "",
        publisher_id: "",
        threshold: "",
        qty: "",
        authors: [],
        newAuthor: ""
      });
      alert("Book added successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add book");
    }
  };

  // --- Add Publisher
  const handleAddPublisher = () => {
    for (let key in publisher) if (!publisher[key]) return alert("All fields are required");

    axios.post("http://localhost:5000/publishers", publisher)
      .then(res => {
        setPublishers([...publishers, res.data]);
        setPublisher({ name: "", address: "", phone: "" });
        alert("Publisher added successfully");
      })
      .catch(err => alert(err.response?.data?.error || "Failed to add publisher"));
  };



  const handleOrderDelete = (orderId, type) => {
    if (!orderId) return console.error("Invalid order ID");

    const url =
      type === "customer"
        ? `http://localhost:5000/orders/customers/${orderId}`
        : `http://localhost:5000/orders/publishers/${orderId}`;

    axios.delete(url)
      .then(() => {
        if (type === "customer") {
          setCustomerOrders(customerOrders.filter(o => o.order_id !== orderId));
        } else {
          setPublisherOrders(publisherOrders.filter(o => o.order_id !== orderId));
        }
      })
      .catch(err => console.error("Error deleting order:", err));
  };


  // --- Delete Book
  const handleDelete = (isbn) => {
    axios.delete(`http://localhost:5000/books/${isbn}`)
      .then(() => setBooks(books.filter(b => b.isbn !== isbn)))
      .catch(err => console.error(err));
  };

  // --- Edit Book
  const handleEditSave = (isbn) => {
    if (editData.qty < 0) return alert("Quantity cannot be negative");

    const updatedData = {
      price: Number(editData.price),
      qty: Number(editData.qty),
      threshold: Number(editData.threshold),
      authors: editData.authors,
      publisher_id: Number(editData.publisher_id)
    };

    axios.put(`http://localhost:5000/books/${isbn}`, updatedData)
      .then(res => {
        setBooks(books.map(b => (b.isbn === isbn ? res.data : b)));
        setEditId(null);
        setEditData({ price: "", qty: "", threshold: "", authors: [], newAuthor: "", publisher_id: "" });
      })
      .catch(err => console.error(err));
  };

  const handleOrderUpdate = (orderId, type, status) => {
    if (!orderId) return console.error("Invalid order ID");

    const url =
      type === "customer"
        ? `http://localhost:5000/orders/customers/${orderId}/confirm`
        : `http://localhost:5000/orders/publishers/${orderId}/confirm`;

    axios.put(url, { status })
      .then(() => {
        if (type === "customer") {
          setCustomerOrders(customerOrders.map(o => o.order_id === orderId ? { ...o, status } : o));
        } else {
          setPublisherOrders(publisherOrders.map(o => o.order_id === orderId ? { ...o, status } : o));
        }
      })
      .catch(err => console.error("Error updating order:", err));
  };

  // --- Filter Books
  const filteredBooks = books.filter(b =>
    (b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      (b.authors || []).some(a => a.toLowerCase().includes(search.toLowerCase()))) &&
    (categoryFilter
      ? categoryToId(categoryFilter) === b.cat_id
      : true) &&
    (publisherFilter ? b.publisher_id === Number(publisherFilter) : true)
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <div className="flex justify-end mb-4">
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Add Book */}
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">Add New Book</h2>
          {["isbn", "title", "price", "pub_year", "threshold", "qty"].map(key => (
            <input
              key={key}
              className="input mb-2"
              name={key}
              placeholder={key.replace("_", " ").toUpperCase()}
              value={book[key]}
              onChange={handleChange}
            />
          ))}
          <div className="flex gap-2 mb-2">
            <select name="category" value={book.category} onChange={handleChange} className="input flex-1">
              <option value="">Select Category</option>
              {["Science", "Art", "Religion", "History", "Geography"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <select
              name="publisher_id"
              value={book.publisher_id}
              onChange={handleChange}
              className="input flex-1"
            >
              <option value="">Select Publisher</option>
              {publishers.map(p => (
                <option key={p.publisher_id} value={String(p.publisher_id)}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Authors */}
          <div className="mb-2">
            <input
              className="input mb-1"
              placeholder="Enter author name"
              value={book.newAuthor || ""}
              onChange={(e) => setBook({ ...book, newAuthor: e.target.value })}
            />
            <button type="button" className="bg-gray-500 text-white px-2 py-1 rounded mb-1"
              onClick={() => {
                const name = book.newAuthor.trim();
                if (!name) return alert("Author cannot be empty");
                if ((book.authors || []).includes(name)) return alert("Author already added");
                setBook({ ...book, authors: [...(book.authors || []), name], newAuthor: "" });
              }}>Add Author</button>
            <div className="flex flex-wrap gap-2 mt-1">
              {(book.authors || []).map((a, i) => (
                <span key={i} className="bg-blue-200 px-2 py-1 rounded flex items-center gap-1">
                  {a} <button type="button" className="text-red-500 font-bold"
                    onClick={() => setBook({ ...book, authors: book.authors.filter(auth => auth !== a) })}>x</button>
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleAddBook} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Add Book
          </button>
        </div>

        {/* Add Publisher */}
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">Add New Publisher</h2>
          {Object.keys(publisher).map(key => (
            <input
              key={key}
              className="input mb-2"
              name={key}
              placeholder={key.replace("_", " ").toUpperCase()}
              value={publisher[key]}
              onChange={handlePublisherChange}
            />
          ))}
          <button onClick={handleAddPublisher} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Add Publisher
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-4 flex space-x-2">
          <input className="input flex-1" placeholder="Search by Title, ISBN, Authors" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {["Science", "Art", "Religion", "History", "Geography"].map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select className="input" value={publisherFilter} onChange={e => setPublisherFilter(e.target.value)}>
            <option value="">All Publishers</option>
            {publishers.map(p => <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>)}
          </select>
        </div>

        {/* Books List */}
        <h2 className="text-xl font-semibold mb-2">Books</h2>

        <table className="table-auto w-full mb-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ISBN</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Publisher</th>
              <th className="p-2 border">Authors</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No books found
                </td>
              </tr>
            ) : (
              filteredBooks.map(book => (
                <tr key={book.isbn}>
                  <td className="p-2 border">{book.isbn}</td>
                  <td className="p-2 border">{book.title}</td>
                  <td className="p-2 border">{idToCategory(book.cat_id)}</td>
                  <td className="p-2 border">
                    {publishers.find(p => p.publisher_id === book.publisher_id)?.name || "—"}
                  </td>
                  <td className="p-2 border">
                    {(book.authors || []).join(", ")}
                  </td>
                  <td className="p-2 border">{book.price}</td>
                  <td className="p-2 border">
                    {editId === book.isbn ? (
                      <input
                        type="number"
                        className="input w-20"
                        value={editData.qty}
                        onChange={e =>
                          setEditData({ ...editData, qty: e.target.value })
                        }
                      />
                    ) : (
                      book.stock_qty
                    )}
                  </td>

                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => {
                        setEditId(book.isbn);
                        setEditData({
                          qty: book.stock_qty,
                          price: book.price,
                          threshold: book.threshold,
                          authors: book.authors || [],
                          publisher_id: book.publisher_id
                        });
                      }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit Qty
                    </button>

                    {editId === book.isbn && (
                      <button
                        onClick={() => handleEditSave(book.isbn)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(book.isbn)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>



        {/* Customer Orders */}
        <h2 className="text-xl font-semibold mb-2">Customer Orders</h2>
        <table className="table-auto w-full mb-6">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Books</th>
              <th>Total Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No customer orders yet.</td>
              </tr>
            ) : (
              customerOrders.map(o => (
                <tr key={o.order_id}>
                  <td>{o.order_id}</td>
                  <td>{o.username}</td>
                  <td>{o.title}</td>
                  <td>{o.qty}</td>
                  <td>{o.status}</td>
                  <td>
                    <button
                      onClick={() => handleOrderUpdate(o.order_id, "customer", "Confirmed")}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleOrderDelete(o.order_id, "customer")}
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Publisher Orders */}
        <h2 className="text-xl font-semibold mb-2">Publisher Orders</h2>
        <table className="table-auto w-full mb-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border text-right">Order ID</th>
              <th className="p-2 border text-right">Publisher</th>
              <th className="p-2 border text-right">Books</th>
              <th className="p-2 border text-right">Total Qty</th>
              <th className="p-2 border text-right">Status</th>
              <th className="p-2 border text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {publisherOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-right p-2">No publisher orders yet.</td>
              </tr>
            ) : (
              publisherOrders.map(o => (
                <tr key={o.order_id}>
                  <td className="p-2 border text-right">{o.order_id}</td>
                  <td className="p-2 border text-right">{o.publisher_name}</td>
                  <td className="p-2 border text-right">{o.title}</td>
                  <td className="p-2 border text-right">{o.qty}</td>
                  <td className="p-2 border text-right">{o.status}</td>
                  <td className="p-2 border text-right">
                    {o.status.toLowerCase() !== "confirmed" && (
                      <>
                        <button
                          onClick={() => handleOrderUpdate(o.order_id, "publisher", "confirmed")}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleOrderDelete(o.order_id, "publisher")}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>


      </main>
      <Footer />
    </div>
  );
}
