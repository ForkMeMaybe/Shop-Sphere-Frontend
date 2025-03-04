import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../api";

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

  if (!token) return <h2 className="text-center text-xl text-red-500 mt-10">Please log in to view your orders.</h2>;
  if (loading) return <h2 className="text-center text-xl mt-10">Loading orders...</h2>;
  if (error) return <h2 className="text-center text-red-500 mt-10">{error}</h2>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No orders placed yet.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order, orderIndex) => (
            <li key={orderIndex} className="p-4 border border-gray-300 rounded-lg shadow-md">
              <p className="text-gray-500">Placed At: {new Date(order.placed_at).toLocaleString()}</p>
              <p
                className={`text-sm font-semibold ${
                  order.payment_status === "Pending" ? "text-yellow-500" : "text-green-600"
                }`}
              >
                Status: {order.payment_status}
              </p>

              {/* ✅ Ordered Items */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Items:</h3>
                <ul className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-4 border-b py-3">
                      <img
                        src={item.product.images[0]?.image_data || "/default-product.png"}
                        alt={item.product.title}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      <div>
                        <p className="text-lg font-medium">{item.product.title}</p>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-800 font-semibold">${item.unit_price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;

