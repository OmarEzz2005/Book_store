import { useState } from "react";
import axios from "axios";

export default function Cart({ cart, setCart, currentUser, orders, setOrders }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");


  if (!currentUser) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  // --------------------
  // Cart Manipulation with Backend Sync
  // --------------------
 const increaseQty = async (isbn, title, price) => {
  const item = cart.find(i => i.isbn === isbn);

  try {
    if (item) {
      // Update existing item
      await axios.put(`http://localhost:5000/cart/${currentUser.id}`, { isbn, qty: 1 });
      setCart(cart.map(i => i.isbn === isbn ? { ...i, qty: i.qty + 1 } : i));
    } else {
      // Item not in cart, add it
      await axios.post(`http://localhost:5000/cart`, { cart_id: currentUser.id, isbn, qty: 1 });
      setCart([...cart, { isbn, title, price, qty: 1 }]);
    }
  } catch (err) {
    console.error(err);
    alert("Cannot increase quantity. Maybe stock limit reached.");
  }
};


const decreaseQty = async (isbn) => {
  try {
    await axios.put(`http://localhost:5000/cart/${currentUser.id}`, { isbn, qty: -1 });

    setCart(cart.map(i =>
      i.isbn === isbn ? { ...i, qty: Math.max(i.qty - 1, 1) } : i
    ));
  } catch (err) {
    console.error(err);
    alert("Cannot decrease quantity.");
  }
};





  const removeItem = async (isbn) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${currentUser.id}/${isbn}`);
      setCart(cart.filter(i => i.isbn !== isbn));
    } catch (err) {
      console.error(err);
      alert("Failed to remove item from cart");
    }
  };

  // --------------------
  // Credit Card Validation
  // --------------------
  const validateCard = () => {
    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      alert("Invalid credit card number");
      return false;
    }
    const today = new Date();
    const [year, month] = expiryDate.split("-").map(Number);
    const exp = new Date(year, month - 1);

    if (exp <= today) {
      alert("Credit card is expired");
      return false;
    }

    return true;
  };

  // --------------------
  // Checkout
  // --------------------
  const checkout = async () => {
  if (cart.length === 0) return alert("Cart is empty");
  if (!validateCard()) return;

if (!currentUser?.id) return alert("User not logged in");


  try {
    const res = await axios.post(
      "http://localhost:5000/orders/checkout",
      {
        customer_id: currentUser.id,
        credit_card_no: cardNumber,
        expiry_date: expiryDate
      }
    );

    const newOrder = res.data;
    setOrders([...orders, newOrder]);
    setCart([]);
    setCardNumber("");
    setExpiryDate("");
    alert("Order placed successfully!");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Checkout failed");
  }
};


  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cart.map(item => (
          <div key={item.isbn} className="border p-3 mb-3 rounded">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm">Price: ${item.price}</p>

            <div className="flex items-center gap-2 mt-2">
              <button className="px-2 bg-gray-300 rounded" onClick={() => decreaseQty(item.isbn)}>−</button>
              <span>{item.qty}</span>
              <button className="px-2 bg-gray-300 rounded" onClick={() => increaseQty(item.isbn)}>+</button>
              <button className="ml-auto text-red-500" onClick={() => removeItem(item.isbn)}>Remove</button>
            </div>

            <p className="text-right mt-2 font-semibold">Subtotal: ${item.price * item.qty}</p>
          </div>
        ))
      )}

      <p className="font-bold text-right mt-4">Total: ${total}</p>

      {/* Credit Card */}
      <div className="mt-6 space-y-3">
        <input
          className="input w-full"
          type="text"
          placeholder="Credit Card Number (16 digits)"
          value={cardNumber}
          onChange={e => setCardNumber(e.target.value)}
        />
        <input
          className="input w-full"
          type="month"
          value={expiryDate}
          onChange={e => setExpiryDate(e.target.value)}
        />
      </div>

      <button
        onClick={checkout}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        disabled={cart.length === 0}
      >
        Checkout
      </button>
    </main>
  );
}
