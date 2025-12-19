import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");

  const [form, setForm] = useState({
    username: "",
    password: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      alert("Username and password are required");
      return;
    }

    if (
      role === "customer" &&
      (!form.fname || !form.lname || !form.email)
    ) {
      alert("Please fill all customer fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/signup", {
        ...form,
        role,
      });

      alert("Account created successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        {/* Customer-only fields */}
        {role === "customer" && (
          <>
            <input
              className="border p-2 w-full mb-3 rounded"
              name="fname"
              placeholder="First Name"
              value={form.fname}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-3 rounded"
              name="lname"
              placeholder="Last Name"
              value={form.lname}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-3 rounded"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-3 rounded"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              className="border p-2 w-full mb-3 rounded"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </>
        )}

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
