import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Books({ books, cart, setCart, currentUser }) {
  const addToCart = (book) => {
    if (!currentUser) {
      alert("Please log in to add books to cart");
      return;
    }

    // Prevent adding duplicates
    if (cart.some((item) => item.id === book.id)) {
      alert("Book already in cart");
      return;
    }

    setCart([...cart, book]);
    alert(`${book.title} added to cart`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} cart={cart} />

      <main className="flex-1 p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Books</h1>

        {books.length === 0 ? (
          <p className="text-gray-500">No books available.</p>
        ) : (
          books.map((book) => (
            <div key={book.id} className="border p-4 mb-3 rounded">
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-gray-600">{book.author}</p>
              <p className="font-bold">${book.price}</p>

              <button
                onClick={() => addToCart(book)}
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}
