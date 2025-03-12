// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";
// import { useCsrfToken } from "../utils/csrftoken.jsx";
// import { getReviews, postReview, deleteReview, updateReview } from "../api";
// import { 
//   Star, 
//   StarHalf,
//   Package,
//   Loader2,
//   AlertCircle,
//   MessageSquare,
//   Edit2,
//   Trash2,
//   Send,
//   IndianRupee,
//   ImageOff,
//   PenLine,
//   Check,
//   X
// } from "lucide-react";
//
// const API_BASE_URL = import.meta.env.VITE_API_URL;
//
// const ProductDetail = () => {
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useAuth();
//   const csrfToken = useCsrfToken();
//
//   const [product, setProduct] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newReview, setNewReview] = useState({ description: "", stars: 5 });
//   const [editingReviewId, setEditingReviewId] = useState(null);
//   const [updatedReview, setUpdatedReview] = useState({ description: "", stars: 5 });
//
//   useEffect(() => {
//     const fetchProductAndReviews = async () => {
//       try {
//         const productResponse = await fetch(`${API_BASE_URL}/store/products/${id}/`);
//         if (!productResponse.ok) throw new Error("Failed to load product");
//         const productData = await productResponse.json();
//         setProduct(productData);
//
//         const reviewsData = await getReviews(id);
//         setReviews(reviewsData);
//       } catch (err) {
//         setError("Failed to fetch product details or reviews.");
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchProductAndReviews();
//   }, [id]);
//
//   const handleSaveEdit = async (reviewId) => {
//     try {
//       const updatedReviewData = await updateReview(id, reviewId, updatedReview, csrfToken);
//       setReviews(reviews.map((r) => (r.id === reviewId ? updatedReviewData : r)));
//       setEditingReviewId(null);
//     } catch (err) {
//       console.error("Error updating review:", err);
//       setError("Failed to update review.");
//     }
//   };
//
//   const handleDeleteReview = async (reviewId) => {
//     try {
//       await deleteReview(id, reviewId, csrfToken);
//       setReviews(reviews.filter((r) => r.id !== reviewId));
//     } catch (err) {
//       console.error("Error deleting review:", err);
//       setError("Failed to delete review.");
//     }
//   };
//
//   const renderStars = (rating) => {
//     return [...Array(5)].map((_, index) => (
//       <Star
//         key={index}
//         className={`w-4 h-4 ${
//           index < rating 
//             ? "text-yellow-400 fill-yellow-400" 
//             : "text-gray-300"
//         }`}
//       />
//     ));
//   };
//
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
//         <h2 className="text-2xl font-semibold text-gray-700">Loading product...</h2>
//       </div>
//     );
//   }
//
//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <AlertCircle className="w-16 h-16 text-red-500" />
//         <h2 className="text-2xl font-semibold text-red-500">{error}</h2>
//       </div>
//     );
//   }
//
//   if (!product) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
//         <Package className="w-16 h-16 text-gray-400" />
//         <h2 className="text-2xl font-semibold text-gray-500">Product not found.</h2>
//       </div>
//     );
//   }
//
//   return (
//     <div className="container mx-auto px-4 py-10 max-w-7xl">
//       <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
//         <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">{product.title}</h1>
//         <div className="grid md:grid-cols-2 gap-12">
//           <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6">
//             {product.images.length > 0 && product.images[0]?.image_data ? (
//               <img
//                 src={product.images[0].image_data}
//                 alt={product.title}
//                 className="max-h-[500px] max-w-full object-contain rounded-lg shadow-md transition-transform hover:scale-105"
//               />
//             ) : (
//               <div className="flex flex-col items-center justify-center text-gray-400">
//                 <ImageOff className="w-24 h-24 mb-4" />
//                 <p className="text-lg">No image available</p>
//               </div>
//             )}
//           </div>
//           <div className="flex flex-col justify-between">
//             <div>
//               <p className="text-lg text-gray-600 leading-relaxed mb-6">{product.description}</p>
//               <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
//                 <IndianRupee className="w-6 h-6" />
//                 <span>{product.unit_price.toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Reviews Section */}
//       <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//         <div className="flex items-center gap-3 mb-6">
//           <MessageSquare className="w-6 h-6 text-blue-600" />
//           <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
//         </div>
//
//         {reviews.length > 0 ? (
//           <div className="space-y-6">
//             {reviews.map((review) => (
//               <div key={review.id} className="bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-semibold text-gray-800">{review.user}</p>
//                     <div className="flex items-center gap-1 my-2">
//                       {renderStars(review.stars)}
//                     </div>
//                   </div>
//                   {user?.username === review.user && (
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           setEditingReviewId(review.id);
//                           setUpdatedReview({ description: review.description, stars: review.stars });
//                         }}
//                         className="text-blue-500 hover:text-blue-600 transition-colors p-1"
//                       >
//                         <Edit2 className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteReview(review.id)}
//                         className="text-red-500 hover:text-red-600 transition-colors p-1"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 
//                 {editingReviewId === review.id ? (
//                   <div className="mt-4 space-y-4">
//                     <textarea
//                       value={updatedReview.description}
//                       onChange={(e) => setUpdatedReview({ ...updatedReview, description: e.target.value })}
//                       className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
//                       rows="3"
//                     />
//                     <div className="flex items-center gap-4">
//                       <select
//                         value={updatedReview.stars}
//                         onChange={(e) => setUpdatedReview({ ...updatedReview, stars: parseInt(e.target.value) })}
//                         className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
//                       >
//                         {[1, 2, 3, 4, 5].map((num) => (
//                           <option key={num} value={num}>{num} Stars</option>
//                         ))}
//                       </select>
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleSaveEdit(review.id)}
//                           className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//                         >
//                           <Check className="w-4 h-4" />
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditingReviewId(null)}
//                           className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                           <X className="w-4 h-4" />
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     <p className="text-gray-600 mt-2">{review.description}</p>
//                     <p className="text-xs text-gray-400 mt-2">
//                       {new Date(review.date).toLocaleDateString('en-US', {
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </p>
//                   </>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
//             <p>No reviews yet. Be the first to review this product!</p>
//           </div>
//         )}
//
//         {/* Leave a Review Form */}
//         {user && (
//           <div className="mt-8 bg-gray-50 rounded-lg p-6">
//             <div className="flex items-center gap-2 mb-4">
//               <PenLine className="w-5 h-5 text-blue-600" />
//               <h3 className="text-lg font-semibold text-gray-800">Write a Review</h3>
//             </div>
//             <textarea
//               value={newReview.description}
//               onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
//               className="w-full border border-gray-200 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
//               rows="3"
//               placeholder="Share your thoughts about this product..."
//             />
//             <div className="flex items-center gap-4 mt-4">
//               <select
//                 value={newReview.stars}
//                 onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
//                 className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
//               >
//                 {[1, 2, 3, 4, 5].map((num) => (
//                   <option key={num} value={num}>{num} Stars</option>
//                 ))}
//               </select>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await postReview(id, newReview, csrfToken);
//                     setReviews([...reviews, response]);
//                     setNewReview({ description: "", stars: 5 });
//                   } catch (err) {
//                     console.error("Error submitting review:", err);
//                     setError("Failed to submit review.");
//                   }
//                 }}
//                 className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Send className="w-4 h-4" />
//                 Submit Review
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default ProductDetail;













import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCsrfToken } from "../utils/csrftoken.jsx";
import { getReviews, postReview, deleteReview, updateReview } from "../api";
import {
  Star,
  StarHalf,
  Package,
  Loader2,
  AlertCircle,
  MessageSquare,
  Edit2,
  Trash2,
  Send,
  IndianRupee,
  ImageOff,
  PenLine,
  Check,
  X,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth();
  const csrfToken = useCsrfToken();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({ description: "", stars: 5 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [updatedReview, setUpdatedReview] = useState({ description: "", stars: 5 });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const productResponse = await fetch(`${API_BASE_URL}/store/products/${id}/`);
        if (!productResponse.ok) throw new Error("Failed to load product");
        const productData = await productResponse.json();
        setProduct(productData);

        const reviewsData = await getReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        setError("Failed to fetch product details or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [id]);

  const handleSaveEdit = async (reviewId) => {
    try {
      const updatedReviewData = await updateReview(id, reviewId, updatedReview, csrfToken);
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReviewData : r)));
      setEditingReviewId(null);
    } catch (err) {
      console.error("Error updating review:", err);
      setError("Failed to update review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId, csrfToken);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review.");
    }
  };

  const formatDescription = (description) => {
    return description.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0">
        {paragraph.trim()}
      </p>
    ));
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-700">Loading product...</h2>
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

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Package className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-500">Product not found.</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">{product.title}</h1>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative">
              <div className="flex justify-center items-center bg-gray-50 rounded-xl p-6 aspect-square">
                {product.images.length > 0 ? (
                  <>
                    <img
                      src={product.images[selectedImageIndex].image_data}
                      alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                      className="max-h-[500px] max-w-full object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                        >
                          <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageOff className="w-24 h-24 mb-4" />
                    <p className="text-lg">No image available</p>
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image.image_data}
                        alt={`${product.title} - Thumbnail ${index + 1}`}
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="prose prose-lg text-gray-600 mb-6">
                {formatDescription(product.description)}
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                  <IndianRupee className="w-6 h-6" />
                  <span>{product.unit_price.toFixed(2)}</span>
                </div>
                {product.inventory > 0 && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">In Stock ({product.inventory} available)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-lg p-4 transition-colors hover:bg-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{review.user}</p>
                    <div className="flex items-center gap-1 my-2">
                      {renderStars(review.stars)}
                    </div>
                  </div>
                  {user?.username === review.user && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingReviewId(review.id);
                          setUpdatedReview({ description: review.description, stars: review.stars });
                        }}
                        className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingReviewId === review.id ? (
                  <div className="mt-4 space-y-4">
                    <textarea
                      value={updatedReview.description}
                      onChange={(e) => setUpdatedReview({ ...updatedReview, description: e.target.value })}
                      className="w-full border border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
                      rows="3"
                    />
                    <div className="flex items-center gap-4">
                      <select
                        value={updatedReview.stars}
                        onChange={(e) => setUpdatedReview({ ...updatedReview, stars: parseInt(e.target.value) })}
                        className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num}>{num} Stars</option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(review.id)}
                          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingReviewId(null)}
                          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 mt-2">{review.description}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}

        {/* Leave a Review Form */}
        {user && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <PenLine className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Write a Review</h3>
            </div>
            <textarea
              value={newReview.description}
              onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
              className="w-full border border-gray-200 p-3 rounded-lg mt-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-800 bg-white"
              rows="3"
              placeholder="Share your thoughts about this product..."
            />
            <div className="flex items-center gap-4 mt-4">
              <select
                value={newReview.stars}
                onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
                className="border border-gray-200 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 bg-white"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{num} Stars</option>
                ))}
              </select>
              <button
                onClick={async () => {
                  try {
                    const response = await postReview(id, newReview, csrfToken);
                    setReviews([...reviews, response]);
                    setNewReview({ description: "", stars: 5 });
                  } catch (err) {
                    console.error("Error submitting review:", err);
                    setError("Failed to submit review.");
                  }
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
