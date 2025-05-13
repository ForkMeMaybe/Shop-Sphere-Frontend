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
  Clock,
  CheckCircle2,
  Box,
  Gift,
  ArrowRight
} from "lucide-react";

const Checkout = () => {
  const { cartId, cartItems, totalPrice, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isPayNowLoading, setIsPayNowLoading] = useState(false);
  const [isCODLoading, setIsCODLoading] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
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

    setIsPayNowLoading(true);
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
          // console.log("Payment Success:", response);
          setIsProcessingPayment(true);

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

          // console.log("✅ Order placed successfully:", await orderResponse.json());

          setTimeout(() => {
            setIsProcessingPayment(false);
            localStorage.removeItem("cartId");
            setCartItems([]);
            alert("Payment successful! 🎉");
            navigate("/orders");
          }, 3000);
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
      setIsPayNowLoading(false);
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

    setIsCODLoading(true);
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

      // console.log("✅ COD Order placed successfully:", await orderResponse.json());

      setTimeout(() => {
        setIsCODLoading(false);
        localStorage.removeItem("cartId");
        setCartItems([]);
        alert("Order placed successfully! Your payment will be collected on delivery.");
        navigate("/orders");
      }, 3000);
    } catch (error) {
      setError("Failed to place order. Try again.");
      console.error("Error placing COD order:", error);
      setIsCODLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 transform hover:scale-105 transition-transform duration-300 shadow-xl">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">Checkout</h1>
          <p className="text-lg text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Processing Payment Overlay */}
        {isProcessingPayment && (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg mb-8 border-2 border-indigo-100 animate-pulse">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <CheckCircle2 className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-gray-700 text-xl font-medium">Processing your payment...</p>
            <p className="text-gray-500 mt-2">Please don't close this window</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-shake">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            {/* Order Summary Header */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                <p className="text-gray-500 mt-1">{cartItems.length} items in cart</p>
              </div>
              <div className="flex items-center text-2xl font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                <IndianRupee className="w-6 h-6 mr-1" />
                {totalPrice.toFixed(2)}
              </div>
            </div>

            {/* Cart Items */}
            <div className="mb-8 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      {/* <Gift className="w-8 h-8 text-indigo-600" /> */}
                      <img
                        src={item.product.images[0]?.image_data || "/default-product.png"}
                        alt={item.product.title}
                        className="w-52 h-28 object-cover rounded-lg shadow-md ring-1 ring-gray-200"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{item.product?.title || "Unknown Product"}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{(item.product?.unit_price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <Truck className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                  <p className="text-sm text-gray-600">2-3 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <Shield className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Secure Payment</h3>
                  <p className="text-sm text-gray-600">SSL encrypted checkout</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Returns</h3>
                  <p className="text-sm text-gray-600">30 days return policy</p>
                </div>
              </div>
            </div>

            {/* Payment Buttons */}
            <div className="space-y-4">
              <button 
                onClick={handlePlaceOrder}
                disabled={isPayNowLoading || isCODLoading || isProcessingPayment}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-3 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isPayNowLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    <span className="font-semibold">Pay Now</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button 
                onClick={handleCODOrder}
                disabled={isPayNowLoading || isCODLoading || isProcessingPayment}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 shadow-lg hover:shadow-xl"
              >
                {isCODLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-6 h-6" />
                    <span className="font-semibold">Cash on Delivery (COD)</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
