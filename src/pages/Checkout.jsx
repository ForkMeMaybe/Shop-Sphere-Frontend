// import { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { addItemToCart, placeOrder, fetchCart } from "../api";
// import { ShoppingCart, Package, CreditCard, AlertCircle, CheckCircle, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
//
// const Checkout = () => {
//   const { cartId, cartItems, totalPrice, setCartItems } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//
//   console.log("CartContext:", { cartId, cartItems, totalPrice });
//
//   useEffect(() => {
//     const fetchCartData = async () => {
//       if (!cartId) {
//         console.warn("Cart ID not found!");
//         return;
//       }
//       try {
//         const data = await fetchCart(cartId);
//         console.log("Updated cart data on checkout:", data);
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       }
//     };
//     fetchCartData();
//   }, [cartId]);
//
//   const handlePlaceOrder = async () => {
//     const token = localStorage.getItem("access_token");
//
//     if (!token) {
//       alert("You must log in to place an order.");
//       navigate("/login");
//       return;
//     }
//
//     if (!cartId) {
//       setError("No cart found.");
//       return;
//     }
//
//     setIsSubmitting(true);
//     setError("");
//
//     try {
//       await placeOrder(cartId);
//       localStorage.removeItem("cartId");
//       setCartItems([]);
//       alert("Order placed successfully! 🎉");
//       navigate("/orders");
//     } catch (error) {
//       setError("Failed to place order. Try again.");
//       console.error("Error placing order:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
//             <ShoppingCart className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
//           <p className="text-gray-600">Complete your purchase</p>
//         </div>
//
//         {error && (
//           <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//             <p className="text-red-700">{error}</p>
//           </div>
//         )}
//
//         {cartItems.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
//             <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
//             <a 
//               href="/" 
//               className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
//             >
//               Continue Shopping
//               <ArrowRight className="w-4 h-4 ml-1" />
//             </a>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             {/* Order Summary Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//               <h2 className="text-xl font-semibold text-white flex items-center gap-2">
//                 <Package className="w-5 h-5" />
//                 Order Summary
//               </h2>
//             </div>
//
//             {/* Items List */}
//             <div className="p-6">
//               <ul className="divide-y divide-gray-200">
//                 {cartItems.map((item) => (
//                   <li key={item.id || item.product?.id} className="py-4 flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-blue-100 rounded-lg p-2">
//                         <Package className="w-6 h-6 text-blue-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900">
//                           {item.product?.title || "Unknown Product"}
//                         </h3>
//                         <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
//                       </div>
//                     </div>
//                     <span className="font-medium text-gray-900">
//                       ₹{(item.product?.unit_price * item.quantity).toFixed(2)}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//
//               {/* Total */}
//               <div className="border-t border-gray-200 mt-6 pt-6">
//                 <div className="flex justify-between items-center text-xl font-semibold text-gray-900">
//                   <span>Total</span>
//                   <span>₹{totalPrice.toFixed(2)}</span>
//                 </div>
//               </div>
//
//               {/* Place Order Button */}
//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={isSubmitting}
//                 className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <CreditCard className="w-5 h-5" />
//                     Place Order
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default Checkout;
















import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { fetchCart } from "../api";
import { ShoppingCart, Package, CreditCard, AlertCircle, Loader2 } from "lucide-react";

const Checkout = () => {
  const { cartId, cartItems, totalPrice, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartData = async () => {
      if (!cartId) return;
      try {
        await fetchCart(cartId);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, [cartId]);

  // ✅ Load Razorpay script dynamically
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("You must log in to place an order.");
      navigate("/login");
      return;
    }

    if (!cartId) {
      setError("No cart found.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // ✅ Step 1: Load Razorpay SDK before calling it
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Failed to load Razorpay");

      // ✅ Step 2: Call backend to create Razorpay Order
      const response = await fetch(`${import.meta.env.VITE_API_URL}/store/payments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!response.ok) throw new Error("Failed to create payment order");

      const paymentData = await response.json();

      // ✅ Step 3: Open Razorpay Checkout
      const options = {
        key: paymentData.razorpay_merchant_key,
        amount: paymentData.razorpay_amount,
        currency: paymentData.currency,
        name: "Shop Sphere",
        description: "Order Payment",
        order_id: paymentData.razorpay_order_id,
        handler: async function (response) {
          console.log("Payment Success:", response);

          // ✅ Step 4: Send payment success details to backend
          const verifyResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/store/payments-handler/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          if (!verifyResponse.ok) throw new Error("Payment verification failed");

          // ✅ Step 5: Place Order in Backend
        const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/store/orders/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ cart_id: cartId }), // 🔥 Pass cart_id to place the order
        });

        if (!orderResponse.ok) throw new Error("Failed to place order");

        console.log("✅ Order placed successfully:", await orderResponse.json());

          // ✅ Step 5: Clear cart and redirect to orders page
          localStorage.removeItem("cartId");
          setCartItems([]);
          alert("Payment successful! 🎉");
          navigate("/orders");
        },
        prefill: {
          name: "Your Name",
          email: "your@email.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setError("Payment failed. Try again.");
      console.error("Error during payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id || item.product?.id} className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 rounded-lg p-2">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.product?.title || "Unknown Product"}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      ₹{(item.product?.unit_price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex justify-between items-center text-xl font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* 🔥 Payment Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;

