// import { useEffect, useState, useContext } from "react";
// import { fetchProducts } from "../api";
// import { Link } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
//
// const Home = () => {
//   const cartContext = useContext(CartContext);
//   if (!cartContext) {
//     return <h2 className="text-center text-red-500 text-xl mt-10">Error: CartContext is not available.</h2>;
//   }
//
//   const { addToCart } = cartContext;
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//
//   useEffect(() => {
//     const loadProducts = async () => {
//       try {
//         const data = await fetchProducts();
//         setProducts(data.results || data);
//       } catch (err) {
//         setError("Failed to load products.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadProducts();
//   }, []);
//
//   if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading products...</h2>;
//   if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
//
//   return (
//     <div className="container mx-auto px-4 py-10">
//       <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Featured Products</h1>
//
//       {/* ✅ Grid Layout Like Amazon/Flipkart */}
//       <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <div
//               key={product.id}
//               className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition-transform transform hover:scale-105"
//             >
//               {/* ✅ Product Image */}
//               <Link to={`/product/${product.id}`}>
//                 {product.images.length > 0 && product.images[0]?.image_data ? (
//                   <img
//                     src={product.images[0].image_data}
//                     alt={product.title}
//                     className="w-full h-52 object-cover rounded-md"
//                   />
//                 ) : (
//                   <img
//                     src="/placeholder.jpg"
//                     alt="No image available"
//                     className="w-full h-52 object-cover rounded-md opacity-50"
//                   />
//                 )}
//               </Link>
//
//               {/* ✅ Product Info */}
//               <h3 className="text-lg font-semibold mt-4 text-gray-800">
//                 <Link to={`/product/${product.id}`} className="hover:text-blue-500 transition">
//                   {product.title}
//                 </Link>
//               </h3>
//               <p className="text-gray-500 text-sm mt-1">₹{product.unit_price}</p>
//
//               {/* ✅ Add to Cart Button */}
//               <button
//                 onClick={() => addToCart(product)}
//                 className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition w-full"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           ))
//         ) : (
//           <h2 className="col-span-3 text-center text-gray-500 text-xl">No products available.</h2>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default Home;
//

















import { useEffect, useState, useContext } from "react";
import { fetchProducts } from "../api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingBag, Star, TrendingUp, Package, Search, ShoppingCart, Heart, Eye } from "lucide-react";

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-indigo-600 animate-bounce mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Loading products...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-center text-red-500 text-xl mt-10 bg-red-50 px-6 py-4 rounded-lg shadow">{error}</h2>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-white/90" />
          <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">Discover amazing products at unbeatable prices</p>
          <div className="flex justify-center space-x-12">
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 mb-2" />
              <span>Top Trending</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Star className="h-8 w-8 mb-2" />
              <span>Best Rated</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <Package className="h-8 w-8 mb-2" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Featured Products</h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="relative block">
                  <div className="relative h-64 overflow-hidden">
                    {product.images.length > 0 && product.images[0]?.image_data ? (
                      <img
                        src={product.images[0].image_data}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src="/placeholder.jpg"
                        alt="No image available"
                        className="w-full h-full object-cover opacity-50"
                      />
                    )}
                    {/* Quick Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition">
                      {product.title}
                    </Link>
                  </h3>

                  {/* ✅ Dynamic Star Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.average_rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">({product.average_rating?.toFixed(1) || "0.0"})</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-indigo-600">₹{product.unit_price.toFixed(2)}</p>
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl text-gray-500">No products available.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

