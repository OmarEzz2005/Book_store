export default function Cart({ cart, setCart, currentUser, orders, setOrders }) {
  if (!currentUser) return null; // safety check

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const makeOrder = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    const newOrder = {
      id: Date.now(),
      customer: currentUser.username,
      items: cart.map(item => ({ ...item })), // copy items
      total,
      status: "Pending",
    };

    setOrders([...orders, newOrder]);
    setCart([]);
    alert("Order placed successfully!");
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
            <p>${item.price}</p>
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
