import axios from "axios";

export default function Cart({ cart, setCart, currentUser, orders, setOrders }) {
  if (!currentUser) return null; // safety check

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const makeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      // Create sale in backend
      const res = await axios.post(`http://localhost:5000/sales/${currentUser.customer_id}`, {
        items: cart.map(item => ({
          isbn: item.isbn,
          qty: item.qty,
          price: item.price
        })),
      });

      const newOrder = res.data; // backend returns saved sale with items

      // Update frontend state
      setOrders([...orders, newOrder]);
      setCart([]); // clear cart
      alert("Order placed successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cart.map((item, i) => (
          <div key={i} className="border p-2 mb-2 rounded">
            <p className="font-semibold">{item.title}</p>
            <p>Qty: {item.qty}</p>
            <p>${item.price * item.qty}</p>
          </div>
        ))
      )}

      <p className="font-bold text-right mt-4">Total: ${total}</p>

      <button
        onClick={makeOrder}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        disabled={cart.length === 0}
      >
        Make Order (COD)
      </button>
    </main>
  );
}
