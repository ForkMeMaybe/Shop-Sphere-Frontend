// import { useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { fetchCart } from "../api";
// import { ShoppingCart, Package, CreditCard, AlertCircle, Loader2, Wallet } from "lucide-react";
//
// const Checkout = () => {
//   const { cartId, cartItems, totalPrice, setCartItems } = useContext(CartContext);
//   const navigate = useNavigate();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");
//
//   useEffect(() => {
//     const fetchCartData = async () => {
//       if (!cartId) return;
//       try {
//         await fetchCart(cartId);
//       } catch (error) {
//         console.error("Error fetching cart data:", error);
//       }
//     };
//     fetchCartData();
//   }, [cartId]);
//
//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.async = true;
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };
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
//       const razorpayLoaded = await loadRazorpay();
//       if (!razorpayLoaded) throw new Error("Failed to load Razorpay");
//
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/store/payments/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `JWT ${token}`,
//         },
//         body: JSON.stringify({ amount: totalPrice }),
//       });
//
//       if (!response.ok) throw new Error("Failed to create payment order");
//
//       const paymentData = await response.json();
//
//       const options = {
//         key: paymentData.razorpay_merchant_key,
//         amount: paymentData.razorpay_amount,
//         currency: paymentData.currency,
//         name: "Shop Sphere",
//         description: "Order Payment",
//         order_id: paymentData.razorpay_order_id,
//         handler: async function (response) {
//           console.log("Payment Success:", response);
//
//           const verifyResponse = await fetch(
//             `${import.meta.env.VITE_API_URL}/store/payments-handler/`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(response),
//             }
//           );
//
//           if (!verifyResponse.ok) throw new Error("Payment verification failed");
//
//           const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/store/orders/`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `JWT ${token}`,
//             },
//             body: JSON.stringify({ cart_id: cartId, payment_status: "C" }),
//           });
//
//           if (!orderResponse.ok) throw new Error("Failed to place order");
//
//           console.log("✅ Order placed successfully:", await orderResponse.json());
//
//           localStorage.removeItem("cartId");
//           setCartItems([]);
//           alert("Payment successful! 🎉");
//           navigate("/orders");
//         },
//         prefill: {
//           name: "Your Name",
//           email: "your@email.com",
//           contact: "9999999999",
//         },
//         theme: { color: "#3399cc" },
//       };
//
//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       setError("Payment failed. Try again.");
//       console.error("Error during payment:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const handleCODOrder = async () => {
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
//       const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/store/orders/`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `JWT ${token}`,
//         },
//         body: JSON.stringify({ cart_id: cartId, payment_status: "P" }),
//       });
//
//       if (!orderResponse.ok) throw new Error("Failed to place order");
//
//       console.log("✅ COD Order placed successfully:", await orderResponse.json());
//
//       localStorage.removeItem("cartId");
//       setCartItems([]);
//       alert("Order placed successfully! Your payment will be collected on delivery.");
//       navigate("/orders");
//     } catch (error) {
//       setError("Failed to place order. Try again.");
//       console.error("Error placing COD order:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
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
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//             <div className="p-6">
//               {/* ✅ Order Summary */}
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
//               <ul className="divide-y divide-gray-200">
//                 {cartItems.map((item) => (
//                   <li key={item.id || item.product?.id} className="py-4 flex justify-between items-center">
//                     <div className="flex items-center gap-4">
//                       <div className="bg-blue-100 rounded-lg p-2">
//                         <Package className="w-6 h-6 text-blue-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900">{item.product?.title || "Unknown Product"}</h3>
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
//               <div className="border-t border-gray-200 mt-6 pt-6">
//                 <div className="flex justify-between items-center text-xl font-semibold text-gray-900">
//                   <span>Total</span>
//                   <span>₹{totalPrice.toFixed(2)}</span>
//                 </div>
//               </div>
//
//               <button onClick={handlePlaceOrder} className="mt-8 w-full bg-blue-600 text-white py-4 px-6 rounded-xl">Pay Now</button>
//               <button onClick={handleCODOrder} className="mt-4 w-full bg-gray-600 text-white py-4 px-6 rounded-xl">Cash on Delivery (COD)</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default Checkout;
//


















import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { fetchCart } from "../api";
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  AlertCircle, 
  Loader2, 
  Wallet,
  IndianRupee,
  Truck,
  Shield,
  Clock
} from "lucide-react";

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
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Failed to load Razorpay");

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

      const options = {
        key: paymentData.razorpay_merchant_key,
        amount: paymentData.razorpay_amount,
        currency: paymentData.currency,
        name: "Shop Sphere",
        description: "Order Payment",
        order_id: paymentData.razorpay_order_id,
        handler: async function (response) {
          console.log("Payment Success:", response);

          const verifyResponse = await fetch(
            `${import.meta.env.VITE_API_URL}/store/payments-handler/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            }
          );

          if (!verifyResponse.ok) throw new Error("Payment verification failed");

          const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/store/orders/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
            body: JSON.stringify({ cart_id: cartId, payment_status: "C" }),
          });

          if (!orderResponse.ok) throw new Error("Failed to place order");

          console.log("✅ Order placed successfully:", await orderResponse.json());

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
        theme: { color: "#4F46E5" },
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

  const handleCODOrder = async () => {
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
      const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/store/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ cart_id: cartId, payment_status: "P" }),
      });

      if (!orderResponse.ok) throw new Error("Failed to place order");

      console.log("✅ COD Order placed successfully:", await orderResponse.json());

      localStorage.removeItem("cartId");
      setCartItems([]);
      alert("Order placed successfully! Your payment will be collected on delivery.");
      navigate("/orders");
    } catch (error) {
      setError("Failed to place order. Try again.");
      console.error("Error placing COD order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 transform hover:scale-105 transition-transform duration-300">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-lg text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <Shield className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
            <p className="text-gray-600 text-sm">Your payment information is encrypted and secure</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <Truck className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Get your products delivered quickly and safely</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <Clock className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">Our support team is always here to help you</p>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <p className="text-2xl text-gray-600 mb-6">Your cart is empty</p>
            <button 
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {/* Order Summary */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              <ul className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <li key={item.id || item.product?.id} className="py-6 flex justify-between items-center group">
                    <div className="flex items-center gap-6">
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-3 group-hover:scale-105 transition-transform duration-300">
                        <Package className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{item.product?.title || "Unknown Product"}</h3>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <IndianRupee className="w-4 h-4 mr-1" />
                      <span>{(item.product?.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Total Section */}
              <div className="border-t border-gray-100 mt-8 pt-8">
                <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                  <span>Total Amount</span>
                  <div className="flex items-center">
                    <IndianRupee className="w-5 h-5 mr-1" />
                    <span>{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Buttons */}
              <div className="mt-8 space-y-4">
                <button 
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span className="font-semibold">Pay Now</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleCODOrder}
                  disabled={isSubmitting}
                  className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-900 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Wallet className="w-6 h-6" />
                      <span className="font-semibold">Cash on Delivery (COD)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
