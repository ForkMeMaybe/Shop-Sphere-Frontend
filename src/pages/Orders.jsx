import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../api";
import { 
  Package2, 
  Clock, 
  ShoppingBag, 
  AlertCircle,
  Loader2,
  PackageCheck,
  BadgeCheck,
  Clock4
} from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        console.warn("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const data = await fetchOrders();
        console.log("Fetched orders:", data);

        if (!Array.isArray(data)) {
          console.error("Unexpected response format:", data);
          throw new Error("Invalid response format. Expected an array.");
        }

        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        
        if (err.message.includes("Failed to refresh token")) {
          console.warn("Logging out user...");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        } else {
          setError("Failed to load orders.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-semibold text-red-500">Please log in to view your orders</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-700">Loading orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-semibold text-red-500">{error}</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 mx-auto px-4 py-10 w-screen min-h-screen ">
      <div className="flex items-center justify-center gap-3 mb-10">
        <Package2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-800">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
          <p className="text-xl text-gray-500">No orders placed yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {orders.map((order, orderIndex) => (
            <div key={orderIndex} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              {/* Order Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-600">
                      {new Date(order.placed_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.payment_status === "Pending" ? (
                      <Clock4 className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <BadgeCheck className="w-4 h-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      order.payment_status === "Pending" 
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <PackageCheck className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Order Items</h3>
                </div>
                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <img
                        src={item.product.images[0]?.image_data || "/default-product.png"}
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{item.product.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <p>Quantity: {item.quantity}</p>
                          <p className="font-semibold text-blue-600">₹{item.unit_price.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
