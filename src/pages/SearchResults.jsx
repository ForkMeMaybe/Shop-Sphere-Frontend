// import { useLocation, Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { ImageOff, IndianRupee, Star, ShoppingCart, Heart, Eye, Search, FilterX } from "lucide-react";
//
// const SearchResults = () => {
//   const location = useLocation();
//   const { results, query } = location.state || { results: [], query: "" };
//   const [searchResults, setSearchResults] = useState(results);
//
//   useEffect(() => {
//     setSearchResults(results);
//   }, [results]);
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
//         <div className="container mx-auto px-4 text-center">
//           <Search className="h-12 w-12 mx-auto mb-4 text-white/90" />
//           <h1 className="text-4xl font-bold mb-3">Search Results</h1>
//           <p className="text-xl opacity-90 mb-4">Showing results for "{query}"</p>
//           <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center">
//             <span className="text-lg">{searchResults.length} items found</span>
//           </div>
//         </div>
//       </div>
//
//       <div className="container mx-auto px-4 py-12 max-w-7xl">
//         {searchResults.length > 0 ? (
//           <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
//             {searchResults.map((product) => (
//               <div
//                 key={product.id}
//                 className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
//               >
//                 {/* Product Image */}
//                 <Link to={`/product/${product.id}`} className="relative block">
//                   <div className="relative h-80 overflow-hidden">
//                     {product.images.length > 0 && product.images[0]?.image_data ? (
//                       <img
//                         src={product.images[0].image_data}
//                         alt={product.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     ) : (
//                       <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
//                         <ImageOff className="w-16 h-16 text-gray-400" />
//                         <p className="text-sm text-gray-500 mt-2">No image available</p>
//                       </div>
//                     )}
//                     {/* Quick Action Buttons */}
//                     <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
//                         <Heart className="w-6 h-6 text-gray-600" />
//                       </button>
//                       <button className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
//                         <Eye className="w-6 h-6 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//
//                 {/* Product Info */}
//                 <div className="p-8">
//                   <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
//                     <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition">
//                       {product.title}
//                     </Link>
//                   </h3>
//
//                   {/* Star Rating */}
//                   <div className="flex items-center gap-2 mb-4">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           className={`w-5 h-5 ${
//                             i < Math.round(product.average_rating || 0)
//                               ? "text-yellow-400 fill-current"
//                               : "text-gray-300"
//                           }`}
//                         />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-500">
//                       ({product.average_rating?.toFixed(1) || "0.0"})
//                     </span>
//                   </div>
//
//                   <p className="text-gray-600 text-base mb-6 line-clamp-3 min-h-[4.5rem]">
//                     {product.description}
//                   </p>
//
//                   <div className="flex flex-col gap-4">
//                     <p className="text-3xl font-bold text-indigo-600">₹{product.unit_price.toFixed(2)}</p>
//                     <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full">
//                       <ShoppingCart className="w-5 h-5" />
//                       <span className="font-semibold">Add to Cart</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <FilterX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h2>
//             <p className="text-gray-600">
//               We couldn't find any matches for "{query}". Try checking your spelling or using different keywords.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default SearchResults;



import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext"; // ✅ Import CartContext
import { ImageOff, IndianRupee, Star, ShoppingCart, Heart, Eye, Search, FilterX } from "lucide-react";

const SearchResults = () => {
  const location = useLocation();
  const { results, query } = location.state || { results: [], query: "" };
  const [searchResults, setSearchResults] = useState(results);

  const cartContext = useContext(CartContext);
  if (!cartContext) {
    return <h2 className="text-center text-red-500 text-xl mt-10">Error: CartContext is not available.</h2>;
  }

  const { addToCart } = cartContext; // ✅ Extract addToCart function

  useEffect(() => {
    setSearchResults(results);
  }, [results]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Search className="h-12 w-12 mx-auto mb-4 text-white/90" />
          <h1 className="text-4xl font-bold mb-3">Search Results</h1>
          <p className="text-xl opacity-90 mb-4">Showing results for "{query}"</p>
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-2 flex items-center justify-center">
            <span className="text-lg">{searchResults.length} items found</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {searchResults.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <Link to={`/product/${product.id}`} className="relative block">
                  <div className="relative h-80 overflow-hidden">
                    {product.images.length > 0 && product.images[0]?.image_data ? (
                      <img
                        src={product.images[0].image_data}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50">
                        <ImageOff className="w-16 h-16 text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">No image available</p>
                      </div>
                    )}
                    {/* Quick Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Heart className="w-6 h-6 text-gray-600" />
                      </button>
                      <button className="p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                        <Eye className="w-6 h-6 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                    <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition">
                      {product.title}
                    </Link>
                  </h3>

                  {/* Star Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(product.average_rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.average_rating?.toFixed(1) || "0.0"})
                    </span>
                  </div>

                  <p className="text-gray-600 text-base mb-6 line-clamp-3 min-h-[4.5rem]">
                    {product.description}
                  </p>

                  <div className="flex flex-col gap-4">
                    <p className="text-3xl font-bold text-indigo-600">₹{product.unit_price.toFixed(2)}</p>
                    {/* ✅ Fixed: Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors w-full"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-semibold">Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FilterX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Results Found</h2>
            <p className="text-gray-600">
              We couldn't find any matches for "{query}". Try checking your spelling or using different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;

