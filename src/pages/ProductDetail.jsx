import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://shop-sphere-app.onrender.com/store/products/${id}/`);
        if (!response.ok) throw new Error("Failed to load product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading product...</h2>;
  if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
  if (!product) return <h2 className="text-center text-gray-500 text-xl mt-10">Product not found.</h2>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Side - Product Image */}
        <div className="flex justify-center items-center">
          {product.images.length > 0 && product.images[0]?.image_data ? (
            <img
              src={product.images[0].image_data}
              alt={product.title}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <img
              src="/placeholder.jpg"
              alt="No image available"
              className="max-h-[500px] max-w-full object-contain rounded-lg opacity-50"
            />
          )}
        </div>

        {/* Right Side - Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-lg text-gray-500 mt-2">{product.description}</p>

          <div className="mt-4">
            <span className="text-2xl font-semibold text-blue-600">${product.unit_price.toFixed(2)}</span>
            <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${product.inventory > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {product.inventory > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

