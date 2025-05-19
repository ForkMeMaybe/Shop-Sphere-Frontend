// import { useContext, useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchProducts } from "../api";
// import { Link } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { ShoppingBag, Star, Package, ShoppingCart, Heart, Eye } from "lucide-react";
// import ProductFilters from "../components/ProductFilters";
//
// const PRODUCTS_PER_PAGE = 8;
//
// const Home = () => {
//   const cartContext = useContext(CartContext);
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState({
//     collectionId: "",
//     minPrice: "",
//     maxPrice: "",
//     sortBy: ""
//   });
//
//   useEffect(() => {
//     // Reset page when filters change
//     setPage(1);
//   }, [filters]);
//
//   if (!cartContext) {
//     return <h2 className="text-center text-red-500 text-xl mt-10">Error: CartContext is not available.</h2>;
//   }
//
//   const { addToCart } = cartContext;
//
//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//
//   const clearFilters = () => {
//     setFilters({
//       collectionId: "",
//       minPrice: "",
//       maxPrice: "",
//       sortBy: ""
//     });
//   };
//
//   const {
//     data,
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ["products", page, filters],
//     queryFn: () => fetchProducts(page, PRODUCTS_PER_PAGE, filters),
//     keepPreviousData: true,
//     staleTime: 1000 * 60 * 5,
//   });
//
//   if (isLoading)
//     return (
//       <div className="flex items-center justify-center min-h-screen w-screen">
//         <div className="text-center">
//           <ShoppingBag className="w-16 h-16 text-indigo-600 animate-bounce mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-800">Loading products...</h2>
//         </div>
//       </div>
//     );
//
//   if (error)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <h2 className="text-center text-red-500 text-xl mt-10 bg-red-50 px-6 py-4 rounded-lg shadow">{error.message}</h2>
//       </div>
//     );
//
//   const { products, total } = data;
//   const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
//
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-16">
//         <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Featured Products</h2>
//         
//         {/* Product Filters Component */}
//         <ProductFilters 
//           onFilterChange={handleFilterChange} 
//           filters={filters}
//           clearFilters={clearFilters}
//         />
//
//         {/* Status message for filtered results */}
//         {(filters.collectionId || filters.minPrice || filters.maxPrice || filters.sortBy) && (
//           <div className="mb-6">
//             <p className="text-gray-600">
//               Showing {products.length} {products.length === 1 ? 'result' : 'results'} 
//               {total > PRODUCTS_PER_PAGE ? ` (page ${page} of ${totalPages})` : ''}
//             </p>
//           </div>
//         )}
//
//         {/* Products Grid */}
//         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
//           {products.length > 0 ? (
//             products.map((product) => (
//               <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
//                 <Link to={`/product/${product.id}`} className="relative block">
//                   <div className="relative h-64 overflow-hidden">
//                     {product.images.length > 0 && product.images[0]?.image_data ? (
//                       <img
//                         src={product.images[0].image_data}
//                         alt={product.title}
//                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                       />
//                     ) : (
//                       <img src="/placeholder.jpg" alt="No image available" className="w-full h-full object-cover opacity-50" />
//                     )}
//                     <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
//                         <Heart className="w-5 h-5 text-gray-600" />
//                       </button>
//                       <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
//                         <Eye className="w-5 h-5 text-gray-600" />
//                       </button>
//                     </div>
//                   </div>
//                 </Link>
//                 <div className="p-6 flex flex-col justify-between min-h-[200px]">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-2 min-h-[3rem] line-clamp-2">
//                     <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition">
//                       {product.title}
//                     </Link>
//                   </h3>
//                   <div className="flex items-center gap-2 mb-4">
//                     <div className="flex items-center">
//                       {[...Array(5)].map((_, i) => (
//                         <Star key={i} className={`w-4 h-4 ${i < Math.round(product.average_rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
//                       ))}
//                     </div>
//                     <span className="text-sm text-gray-500">({product.average_rating?.toFixed(1) || "0.0"})</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-2xl font-bold text-indigo-600">₹{product.unit_price.toFixed(2)}</p>
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       <ShoppingCart className="w-5 h-5" />
//                       <span>Add to Cart</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="col-span-full text-center py-12">
//               <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h2 className="text-xl text-gray-500">No products found matching your filters.</h2>
//               <button 
//                 onClick={clearFilters}
//                 className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//               >
//                 Clear Filters
//               </button>
//             </div>
//           )}
//         </div>
//
//         {/* Pagination Controls */}
//         {products.length > 0 && (
//           <div className="mt-12 flex justify-center gap-4">
//             <button
//               disabled={page === 1}
//               onClick={() => setPage((prev) => prev - 1)}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-gray-600 font-medium">Page {page} of {totalPages}</span>
//             <button
//               disabled={page === totalPages}
//               onClick={() => setPage((prev) => prev + 1)}
//               className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default Home;







import { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { ShoppingBag, Star, Package, ShoppingCart, Heart, Eye } from "lucide-react";
import ProductFilters from "../components/ProductFilters";

const PRODUCTS_PER_PAGE = 8;

const Home = () => {
  const cartContext = useContext(CartContext);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    collectionId: "",
    minPrice: "",
    maxPrice: "",
    sortBy: ""
  });

  useEffect(() => {
    setPage(1); // Reset page when filters change
  }, [filters]);

  if (!cartContext) {
    return <h2 className="text-center text-red-500 text-xl mt-10">Error: CartContext is not available.</h2>;
  }

  const { addToCart } = cartContext;

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      collectionId: "",
      minPrice: "",
      maxPrice: "",
      sortBy: ""
    });
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", page, filters],
    queryFn: () => fetchProducts(page, PRODUCTS_PER_PAGE, filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen w-screen">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-indigo-600 animate-bounce mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Loading products...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-center text-red-500 text-xl mt-10 bg-red-50 px-6 py-4 rounded-lg shadow">{error.message}</h2>
      </div>
    );

  const { products, total } = data;
  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Featured Products</h2>
        
        <ProductFilters 
          onFilterChange={handleFilterChange} 
          filters={filters}
          clearFilters={clearFilters}
        />

        {(filters.collectionId || filters.minPrice || filters.maxPrice || filters.sortBy) && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {products.length} {products.length === 1 ? 'result' : 'results'} 
              {total > PRODUCTS_PER_PAGE ? ` (page ${page} of ${totalPages})` : ''}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${product.id}`} className="relative block">
                  <div className="relative h-64 overflow-hidden">
                    {product.images.length > 0 && product.images[0]?.image_data ? (
                      <img
                        src={product.images[0].image_data}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <img src="/placeholder.jpg" alt="No image available" className="w-full h-full object-cover opacity-50" />
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 transition-colors">
                        <Heart className="w-5 h-5 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white border border-gray-200 rounded-full shadow hover:bg-gray-100 transition-colors">
                        <Eye className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="p-6 flex flex-col justify-between min-h-[200px]">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 min-h-[3rem] line-clamp-2">
                    <Link to={`/product/${product.id}`} className="hover:text-indigo-600 transition">
                      {product.title}
                    </Link>
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(product.average_rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
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
              <h2 className="text-xl text-gray-500">No products found matching your filters.</h2>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <div className="mt-12 flex justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

