import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard({ currentUser, setCurrentUser, orders }) {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: currentUser?.username || "",
    password: "",
    fname: currentUser?.fname || "",
    lname: currentUser?.lname || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || "",
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    const { username, password, fname, lname, email, phone, address } = userInfo;
    if (!username || !password || !fname || !lname || !email || !phone || !address) {
      alert("All fields are required.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters, include one uppercase letter and one number.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return false;
    }
    const phoneRegex = /^[0-9]{7,}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must contain only numbers and be at least 7 digits.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateFields()) return;
    setCurrentUser({ ...currentUser, ...userInfo });
    setEditMode(false);
    alert("Information updated successfully!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} cart={[]} /> {/* pass cart if needed */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-3xl font-bold mb-6">Customer Dashboard</h1>

          {/* Personal Info */}
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

            {editMode ? (
              <div className="space-y-2">
                {["username", "password", "fname", "lname", "email", "phone", "address"].map((field) => (
                  <input
                    key={field}
                    className="border p-2 w-full rounded"
                    type={field === "password" ? "password" : "text"}
                    name={field}
                    placeholder={field.replace("_", " ").toUpperCase()}
                    value={userInfo[field]}
                    onChange={handleChange}
                  />
                ))}
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <p><strong>Username:</strong> {currentUser?.username}</p>
                <p><strong>First Name:</strong> {userInfo.fname}</p>
                <p><strong>Last Name:</strong> {userInfo.lname}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Phone:</strong> {userInfo.phone}</p>
                <p><strong>Address:</strong> {userInfo.address}</p>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
                  onClick={() => setEditMode(true)}
                >
                  Edit Info
                </button>
              </div>
            )}
          </div>

          {/* Dashboard Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

            {/* Browse Books */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Browse Books</h2>
              <p className="text-gray-600 mb-4">Explore all available books by category, author, or publisher.</p>
              <Link
                to="/books"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Books
              </Link>
            </div>

            {/* Shopping Cart */}
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Shopping Cart</h2>
              <p className="text-gray-600 mb-4">View items added to your cart and proceed to checkout.</p>
              <Link
                to="/cart"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Go to Cart
              </Link>
            </div>

            {/* Logout Button */}
            <div className="bg-white p-6 rounded shadow flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold mb-2">Account</h2>
              <p className="text-gray-600 mb-4">Log out from your account.</p>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>

          </div>

          {/* Past Orders Section */}
          <div className="bg-white p-6 rounded shadow">
            <div
              className="flex items-center cursor-pointer mb-4"
              onClick={() => setShowOrders(!showOrders)}
            >
              <h2 className="text-xl font-semibold">Past Orders</h2>
              <span className="ml-2 text-gray-500">{showOrders ? "▲" : "▼"}</span>
            </div>

            {showOrders && (
              <div>
                {(!orders || orders.length === 0) ? (
                  <p className="text-gray-500">No past orders found.</p>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="border p-3 rounded mb-3">
                      <p><strong>Order ID:</strong> {order.id}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <div className="mt-1">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-sm">- {item.title} (${item.price})</p>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

        </div>
      </main>
      <Footer />
    </div>
    
  );
}
