import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, totalPrice, removeFromCart } = useContext(CartContext);

  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Your cart is empty. <Link to="/" className="text-blue-600 hover:underline">Go shopping</Link>.
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-gray-100 text-gray-800">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Price</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-t bg-white hover:bg-gray-100">
                    <td className="py-4 px-4 text-left flex items-center gap-4">
                      {/* ✅ Display product image */}
                      <img
                        src={item.product.images[0].image_data || "/default-product.png"} // Fallback image if none exists
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                      {item.product.title}
                    </td>
                    <td className="py-4 px-4">${item.product.unit_price.toFixed(2)}</td>
                    <td className="py-4 px-4">{item.quantity}</td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <h2 className="text-2xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
            <Link to="/checkout">
              <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
