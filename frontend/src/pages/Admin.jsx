import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function Admin({ currentUser, setCurrentUser }) {
  // --- States ---
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [publishers, setPublishers] = useState([]);
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
  });

  const [publisher, setPublisher] = useState({
    publisher_id: "",
    name: "",
    address: "",
    phone: "",
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


  // --- Fetch data on mount ---
  useEffect(() => {
    fetchBooks();
    fetchOrders();
    fetchPublishers();
  }, []);

  const fetchBooks = () => {
    axios.get("http://localhost:5000/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  const fetchOrders = () => {
    axios.get("http://localhost:5000/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
  };

  const fetchPublishers = () => {
    axios.get("http://localhost:5000/publishers")
      .then(res => setPublishers(res.data))
      .catch(err => console.error(err));
  };

  // --- Logout ---
  const handleLogout = () => setCurrentUser(null);

  // --- Handlers ---
  const handleChange = (e) => setBook({ ...book, [e.target.name]: e.target.value });
  const handlePublisherChange = (e) => setPublisher({ ...publisher, [e.target.name]: e.target.value });


  // --- Add Publisher ---
  const handleAddPublisher = () => {
    for (let key in publisher) if (!publisher[key]) return alert("All fields are required");

    axios.post("http://localhost:5000/publishers", publisher)
      .then(res => {
        setPublishers([...publishers, res.data]);
        setPublisher({ publisher_id: "", name: "", address: "", phone: "" });
        alert("Publisher added successfully");
      })
      .catch(err => alert(err.response?.data?.error || "Failed to add publisher"));
  };

  // --- Delete Book ---
  const handleDelete = (isbn) => {
    axios.delete(`http://localhost:5000/books/${isbn}`)
      .then(() => setBooks(books.filter(b => b.isbn !== isbn)))
      .catch(err => console.error(err));
  };

  // --- Save edited book ---
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
        setEditData({ price: "", qty: "", threshold: "" });
      })
      .catch(err => console.error(err));
  };

  // --- Update Order Status ---
  const handleOrderUpdate = (orderId, status) => {
    axios.put(`http://localhost:5000/orders/${orderId}`, { status })
      .then(res => setOrders(orders.map(o => (o.id === orderId ? res.data : o))))
      .catch(err => console.error(err));
  };

  // --- Fetch Reports ---
  const fetchReport = (type) => {
    axios.get(`http://localhost:5000/reports/${type}`)
      .then(res => setReports(res.data))
      .catch(err => console.error(err));
  };

  // --- Filter books ---
  const filteredBooks = books.filter(b =>
    (
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.includes(search) ||
      (b.authors || []).some(a => a.toLowerCase().includes(search.toLowerCase()))
    ) &&
    (categoryFilter ? b.category === categoryFilter : true) &&
    (publisherFilter ? b.publisher_id === Number(publisherFilter) : true)
  );

  // --- Separate Customer & Publisher Orders ---
  const customerOrders = orders.filter(o => o.type === "customer");
  const publisherOrders = orders.filter(o => o.type === "publisher");

  // --- JSX ---
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 p-6 max-w-5xl mx-auto">

        {/* Logout */}
        <div className="flex justify-end mb-4">
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Add Book */}
        <div className="border p-4 rounded mb-6">
          <h2 className="font-semibold mb-3">Add New Book</h2>

          {/* Other inputs */}
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
            {/* Category dropdown */}
            <select
              name="category"
              value={book.category}
              onChange={handleChange}
              className="input flex-1"
            >
              <option value="">Select Category</option>
              <option value="Science">Science</option>
              <option value="Art">Art</option>
              <option value="Religion">Religion</option>
              <option value="History">History</option>
              <option value="Geography">Geography</option>
            </select>

            {/* Publisher dropdown */}
            <select
              name="publisher_id"
              value={book.publisher_id}
              onChange={handleChange}
              className="input flex-1"
            >
              <option value="">Select Publisher</option>
              {publishers.map(p => (
                <option key={p.publisher_id} value={p.publisher_id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>


          {/* Authors input */}
          <div className="mb-2">
            <input
              className="input mb-1"
              placeholder="Enter author name"
              value={book.newAuthor || ""}
              onChange={(e) => setBook({ ...book, newAuthor: e.target.value })}
            />
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 mb-1"
              onClick={() => {
                const name = (book.newAuthor || "").trim();
                if (!name) return alert("Author name cannot be empty");
                const authorsArr = book.authors || [];
                if (authorsArr.includes(name)) return alert("Author already added");
                setBook({
                  ...book,
                  authors: [...authorsArr, name],
                  newAuthor: ""
                });
              }}
              type="button"
            >
              Add Author
            </button>

            {/* Show added authors */}
            <div className="flex flex-wrap gap-2 mt-1">
              {(book.authors || []).map((a, i) => (
                <span key={i} className="bg-blue-200 px-2 py-1 rounded flex items-center gap-1">
                  {a}
                  <button
                    className="text-red-500 font-bold"
                    type="button"
                    onClick={() => {
                      setBook({ ...book, authors: book.authors.filter(auth => auth !== a) });
                    }}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Add Book Button */}
          <button
            onClick={() => {
              // Validate authors
              if (!book.authors || book.authors.length === 0) return alert("Please add at least one author");

              // Validate other fields
              for (let key of ["isbn", "title", "price", "category", "pub_year", "publisher_id", "threshold", "qty"]) {
                if (!book[key]) return alert("All fields are required");
              }

              // Prepare new book object
              const newBook = {
                ...book,
                price: Number(book.price),
                pub_year: Number(book.pub_year),
                threshold: Number(book.threshold),
                qty: Number(book.qty),
                publisher_id: Number(book.publisher_id),
              };

              axios.post("http://localhost:5000/books", newBook)
                .then(res => {
                  setBooks([...books, res.data]);
                  setBook({ isbn: "", title: "", price: "", category: "", pub_year: "", publisher_id: "", threshold: "", qty: "", authors: [], newAuthor: "" });
                  alert("Book added successfully");
                })
                .catch(err => alert(err.response?.data?.error || "Failed to add book"));
            }}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
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

        {/* Search Books */}
        <div className="mb-4 flex space-x-2">
          <input className="input flex-1" placeholder="Search by Title , ISBN or Authors" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Science">Science</option>
            <option value="Art">Art</option>
            <option value="Religion">Religion</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
          </select>
          <select className="input" value={publisherFilter} onChange={e => setPublisherFilter(e.target.value)}>
            <option value="">All Publishers</option>
            {publishers.map(p => <option key={p.publisher_id} value={p.publisher_id}>{p.name}</option>)}
          </select>
        </div>

        {/* Book List */}
        <div className="mb-10">
          <h2 className="font-semibold mb-2">Inventory</h2>
          {filteredBooks.length === 0 ? <p className="text-gray-500">No books found.</p> : filteredBooks.map(b => (
            <div key={b.isbn} className="border p-3 rounded mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-gray-600">ISBN: {b.isbn}</p>
                  <p className="text-sm">Category: {b.category}</p>
                  <p className="text-sm">
                    Publisher:{" "}
                    {publishers.find(p => p.publisher_id === b.publisher_id)?.name || "Unknown"}
                  </p>

                  <p className="text-sm">
                    Authors: {b.authors && b.authors.length > 0 ? b.authors.join(", ") : "N/A"}
                  </p>

                  {b.qty <= b.threshold && <p className="text-red-500 font-semibold mt-1">⚠ Low Stock</p>}
                  {b.auto_order && <p className="text-yellow-600 font-semibold mt-1">🔄 Auto-order placed</p>}
                </div>
                <div className="space-x-2">
                  <button
                    className="text-blue-500"
                    onClick={() => {
                      setEditId(b.isbn);
                      setEditData({
                        price: b.price,
                        qty: b.qty,
                        threshold: b.threshold,
                        authors: b.authors || [],
                        newAuthor: "",
                        publisher_id: b.publisher_id
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="text-red-500" onClick={() => handleDelete(b.isbn)}>Delete</button>
                </div>
              </div>

              {editId === b.isbn && (
                <div className="mt-3 space-y-2">
                  {["price", "qty", "threshold"].map(field => (
                    <input
                      key={field}
                      className="input"
                      type="number"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={editData[field]}
                      onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
                    />
                  ))}
                  <select
                    className="input"
                    value={editData.publisher_id}
                    onChange={(e) =>
                      setEditData({ ...editData, publisher_id: Number(e.target.value) })
                    }
                  >
                    {publishers.map(p => (
                      <option key={p.publisher_id} value={p.publisher_id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  {/* Edit Authors */}
                  <div>
                    <input
                      className="input mb-1"
                      placeholder="Add author"
                      value={editData.newAuthor}
                      onChange={(e) =>
                        setEditData({ ...editData, newAuthor: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-2 py-1 rounded mb-1"
                      onClick={() => {
                        const name = editData.newAuthor.trim();
                        if (!name) return alert("Author name cannot be empty");
                        if (editData.authors.includes(name)) return alert("Author already exists");

                        setEditData({
                          ...editData,
                          authors: [...editData.authors, name],
                          newAuthor: ""
                        });
                      }}
                    >
                      Add Author
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {editData.authors.map((a, i) => (
                        <span key={i} className="bg-blue-200 px-2 py-1 rounded flex items-center gap-1">
                          {a}
                          <button
                            type="button"
                            className="text-red-500 font-bold"
                            onClick={() =>
                              setEditData({
                                ...editData,
                                authors: editData.authors.filter(x => x !== a)
                              })
                            }
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="bg-green-500 text-white px-4 py-1 rounded" onClick={() => handleEditSave(b.isbn)}>Save Changes</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Orders Management */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Customer Orders</h2>
          {customerOrders.length === 0 ? <p className="text-gray-500">No customer orders yet.</p> : customerOrders.map(order => (
            <div key={order.id} className="border p-4 rounded mb-4">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer:</strong> {order.customer}</p>
              <p><strong>Total:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div className="mt-2">
                <p className="font-semibold">Items:</p>
                {order.items.map((item, i) => <p key={i} className="text-sm">- {item.title} (${item.price})</p>)}
              </div>
              {order.status === "Pending" && (
                <div className="mt-3 space-x-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => handleOrderUpdate(order.id, "Confirmed")}>Confirm</button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => handleOrderUpdate(order.id, "Cancelled")}>Cancel</button>
                </div>
              )}
            </div>
          ))}

          <h2 className="text-xl font-bold mb-4 mt-8">Publisher Orders</h2>
          {publisherOrders.length === 0 ? <p className="text-gray-500">No publisher orders yet.</p> : publisherOrders.map(order => (
            <div key={order.id} className="border p-4 rounded mb-4">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Book ISBN:</strong> {order.book_isbn}</p>
              <p><strong>Quantity:</strong> {order.qty}</p>
              <p><strong>Status:</strong> {order.status}</p>
              {order.status === "Pending" && (
                <button className="bg-green-500 text-white px-3 py-1 rounded mt-2" onClick={() => handleOrderUpdate(order.id, "Confirmed")}>Confirm</button>
              )}
            </div>
          ))}
        </div>

        {/* Reports */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">Reports</h2>
          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => fetchReport("sales_month")}>Sales Last Month</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => fetchReport("sales_day")}>Sales by Day</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => fetchReport("top_customers")}>Top 5 Customers</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => fetchReport("top_books")}>Top 10 Books</button>
            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => fetchReport("book_orders")}>Book Orders Count</button>
          </div>
          {reports && (
            <div className="mt-4 border p-3 rounded bg-gray-50">
              <pre>{JSON.stringify(reports, null, 2)}</pre>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
