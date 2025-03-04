import { useEffect, useState, useContext } from "react";
import { fetchProducts } from "../api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Home = () => {
  const cartContext = useContext(CartContext);
  if (!cartContext) {
    return <h2 className="text-center text-red-500 text-xl mt-10">Error: CartContext is not available.</h2>;
  }

  const { addToCart } = cartContext;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.results || data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading products...</h2>;
  if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Featured Products</h1>

      {/* ✅ Grid Layout Like Amazon/Flipkart */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition-transform transform hover:scale-105"
            >
              {/* ✅ Product Image */}
              <Link to={`/product/${product.id}`}>
                {product.images.length > 0 && product.images[0]?.image_data ? (
                  <img
                    src={product.images[0].image_data}
                    alt={product.title}
                    className="w-full h-52 object-cover rounded-md"
                  />
                ) : (
                  <img
                    src="/placeholder.jpg"
                    alt="No image available"
                    className="w-full h-52 object-cover rounded-md opacity-50"
                  />
                )}
              </Link>

              {/* ✅ Product Info */}
              <h3 className="text-lg font-semibold mt-4 text-gray-800">
                <Link to={`/product/${product.id}`} className="hover:text-blue-500 transition">
                  {product.title}
                </Link>
              </h3>
              <p className="text-gray-500 text-sm mt-1">₹{product.unit_price}</p>

              {/* ✅ Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition w-full"
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : (
          <h2 className="col-span-3 text-center text-gray-500 text-xl">No products available.</h2>
        )}
      </div>
    </div>
  );
};

export default Home;

