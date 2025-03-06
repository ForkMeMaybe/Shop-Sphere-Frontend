import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { ShoppingCart, Package, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { updateCartItem, addItemToCart } from "../api"; // ✅ Import updateCartItem from API

const Cart = () => {
  const { cartItems, totalPrice, removeFromCart } = useContext(CartContext);
  const cartId = localStorage.getItem("cartId"); // Ensure you have cart_id stored

  const increaseQuantity = async (itemId, quantity) => {
    try {
      await addItemToCart(cartId, itemId, quantity);
      window.location.reload(); // ✅ Refresh to show updated quantity
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  const decreaseQuantity = async (itemId, quantity) => {
    try {
      await updateCartItem(cartId, itemId, quantity);
      window.location.reload(); // ✅ Refresh to show updated quantity
    } catch (error) {
      console.error("Failed to update cart item quantity:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ShoppingCart className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">Review and manage your selected items</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Product Details</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Price</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-600">Quantity</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-blue-50 transition-colors duration-200">
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-6">
                          <div className="relative flex-shrink-0">
                            <img
                              src={item.product.images[0].image_data || "/default-product.png"}
                              alt={item.product.title}
                              className="w-24 h-24 object-cover rounded-lg shadow-sm ring-1 ring-gray-200"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{item.product.title}</h3>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-6">
                        <span className="text-lg font-semibold text-gray-900">
                          ₹{item.product.unit_price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="inline-flex items-center justify-center min-w-[40px] px-3 py-1 bg-gray-100 rounded-full text-gray-700 font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.product.id, 1)}
                            className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="py-6 px-6 text-center">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Total:</span>
                  <span className="text-3xl font-bold text-gray-900">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Continue Shopping
                  </Link>
                  <Link 
                    to="/checkout" 
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
