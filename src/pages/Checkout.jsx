import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { addItemToCart, placeOrder, fetchCart } from "../api"; // ✅ Import API calls

const Checkout = () => {
  const { cartId, cartItems, totalPrice, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  console.log("CartContext:", { cartId, cartItems, totalPrice });

  // ✅ Fetch latest cart data when Checkout page loads
  useEffect(() => {
    const fetchCartData = async () => {
      if (!cartId) {
        console.warn("Cart ID not found!");
        return;
      }
      try {
        const data = await fetchCart(cartId);
        console.log("Updated cart data on checkout:", data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, [cartId]);

  const handlePlaceOrder = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        alert("You must log in to place an order.");
        navigate("/login"); // ✅ Redirect to login if user is anonymous
        return;
      }

      if (!cartId) {
        setError("No cart found.");
        return;
      }

      setIsSubmitting(true);
      setError("");

      try {
        await placeOrder(cartId); // ✅ Place order in backend

        // ✅ Remove cart ID from local storage since cart is deleted
        localStorage.removeItem("cartId");

        // ✅ Clear cart items from memory
        setCartItems([]);

        alert("Order placed successfully! 🎉");
        navigate("/orders");
      } catch (error) {
        setError("Failed to place order. Try again.");
        console.error("Error placing order:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Checkout</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          Your cart is empty. <a href="/" className="text-blue-600 hover:underline">Go shopping</a>.
        </div>
      ) : (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 text-gray-900">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <ul className="divide-y divide-gray-300">
            {cartItems.map((item) => (
              <li key={item.id || item.product?.id} className="py-3 flex justify-between">
                <span>{item.product?.title || "Unknown Product"} (x{item.quantity})</span>
                <span>${(item.product?.unit_price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t mt-4 pt-4 flex justify-between text-xl font-semibold">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span> {/* ✅ FIX: Use totalPrice from CartContext */}
          </div>

          {/* ✅ Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className={`w-full bg-green-600 text-white py-3 rounded-md mt-6 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

