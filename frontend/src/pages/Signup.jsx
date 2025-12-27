import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

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

  const validateFields = () => {
    const { username, password, fname, lname, email, phone, address } = form;
    
    if (!username.trim() || !password.trim()) {
      alert("Username and password are required");
      return false;
    }

    if (role === "customer") {
      if (!fname.trim() || !lname.trim() || !email.trim() || !phone.trim() || !address.trim()) {
        alert("Please fill all customer fields");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return false;
      }

      const phoneRegex = /^[0-9]{7,}$/;
      if (!phoneRegex.test(phone)) {
        alert("Phone number must contain only numbers and be at least 7 digits");
        return false;
      }
    }

    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters, include one uppercase letter and one number");
        return false;
      }
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/auth/signup", {
        ...form,
        role,
      });

      alert("Account created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
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
          aria-label="Username"
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
          aria-label="Password"
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          aria-label="Role"
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
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
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
