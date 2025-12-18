export default function BookCard({ book, addToCart }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg">{book.title}</h3>
      <p className="text-gray-600">Author: {book.author}</p>
      <p className="text-gray-800 font-bold">${book.price}</p>
      <button
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => addToCart(book)}
      >
        Add to Cart
      </button>
    </div>
  );
}
