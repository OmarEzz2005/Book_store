export default function CartItem({ item }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h3 className="font-semibold">{item.title}</h3>
        <p className="text-gray-600">{item.author}</p>
      </div>
      <p className="font-bold">${item.price}</p>
    </div>
  );
}
