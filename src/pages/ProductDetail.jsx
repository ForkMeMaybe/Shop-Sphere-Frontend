// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
// import { useCsrfToken } from "../utils/csrftoken.jsx"; // ✅ CSRF Token
// import { getReviews, postReview, deleteReview, updateReview } from "../api"; // ✅ API Calls
//
// const ProductDetail = () => {
//   const { id } = useParams();
//   const { addToCart } = useContext(CartContext);
//   const { user } = useAuth(); // ✅ Get Logged-in User
//   const csrfToken = useCsrfToken();
//
//   const [product, setProduct] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [newReview, setNewReview] = useState({ description: "", stars: 5 });
//   const [submitting, setSubmitting] = useState(false);
//
//   useEffect(() => {
//     const fetchProductAndReviews = async () => {
//       try {
//         // ✅ Fetch Product Details
//         const productResponse = await fetch(`https://shop-sphere-app.onrender.com/store/products/${id}/`);
//         if (!productResponse.ok) throw new Error("Failed to load product");
//         const productData = await productResponse.json();
//         setProduct(productData);
//
//         // ✅ Fetch Reviews
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
//   // ✅ Handle New Review Submission
//   const handleSubmitReview = async () => {
//     if (!newReview.description.trim()) return;
//
//     setSubmitting(true);
//     try {
//       const response = await postReview(id, newReview, csrfToken);
//       setReviews([...reviews, response]); // ✅ Add new review to list
//       setNewReview({ description: "", stars: 5 });
//     } catch (err) {
//       console.error("Error submitting review:", err);
//       setError("Failed to submit review.");
//     } finally {
//       setSubmitting(false);
//     }
//   };
//
//   // ✅ Handle Review Deletion
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
//   // ✅ Handle Review Update
//   const handleUpdateReview = async (reviewId, updatedData) => {
//     try {
//       const updatedReview = await updateReview(id, reviewId, updatedData, csrfToken);
//       setReviews(reviews.map((r) => (r.id === reviewId ? updatedReview : r)));
//     } catch (err) {
//       console.error("Error updating review:", err);
//       setError("Failed to update review.");
//     }
//   };
//
//   if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading product...</h2>;
//   if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
//   if (!product) return <h2 className="text-center text-gray-500 text-xl mt-10">Product not found.</h2>;
//
//   return (
//     <div className="container mx-auto px-4 py-10">
//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Left Side - Product Image */}
//         <div className="flex justify-center items-center">
//           {product.images.length > 0 && product.images[0]?.image_data ? (
//             <img
//               src={product.images[0].image_data}
//               alt={product.title}
//               className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
//             />
//           ) : (
//             <img
//               src="/placeholder.jpg"
//               alt="No image available"
//               className="max-h-[500px] max-w-full object-contain rounded-lg opacity-50"
//             />
//           )}
//         </div>
//
//         {/* Right Side - Product Info */}
//         <div>
//           <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
//           <p className="text-lg text-gray-500 mt-2">{product.description}</p>
//
//           <div className="mt-4">
//             <span className="text-2xl font-semibold text-blue-600">₹{product.unit_price.toFixed(2)}</span>
//             <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${product.inventory > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//               {product.inventory > 0 ? "In Stock" : "Out of Stock"}
//             </span>
//           </div>
//
//           {/* ✅ Display Review Count & Average Rating */}
//           <div className="mt-4 text-gray-700">
//             <p className="text-lg font-semibold">Rating: ⭐ {(product.average_rating ?? 0).toFixed(1)} / 5</p>
//             <p className="text-sm">{product.review_count} Reviews</p>
//           </div>
//
//           <button
//             onClick={() => addToCart(product)}
//             className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//
//       {/* ✅ Reviews Section */}
//       <div className="mt-12">
//         <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
//
//         {reviews.length > 0 ? (
//           reviews.map((review) => (
//             <div key={review.id} className="border-b pb-4 mb-4">
//               <p className="text-gray-800 font-semibold">{review.user}</p>
//               <p className="text-yellow-500">⭐ {review.stars} / 5</p>
//               <p className="text-gray-600">{review.description}</p>
//               <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
//
//               {/* ✅ Show delete button if user owns the review */}
//               {user?.username === review.user && (
//                 <button
//                   onClick={() => handleDeleteReview(review.id)}
//                   className="text-red-500 text-sm mt-1"
//                 >
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No reviews yet.</p>
//         )}
//
//         {/* ✅ Leave a Review Form */}
//         {user && (
//           <div className="mt-6">
//             <h3 className="text-lg font-semibold">Write a Review</h3>
//             <textarea
//               value={newReview.description}
//               onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
//               className="w-full border p-2 rounded-md mt-2"
//               rows="3"
//               placeholder="Write your review..."
//             />
//             <select
//               value={newReview.stars}
//               onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
//               className="border p-2 rounded-md mt-2"
//             >
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <option key={num} value={num}>
//                   {num} Stars
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleSubmitReview}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600 disabled:opacity-50"
//               disabled={submitting}
//             >
//               {submitting ? "Submitting..." : "Submit Review"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
//
// export default ProductDetail;
//










import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
import { useCsrfToken } from "../utils/csrftoken.jsx"; // ✅ CSRF Token
import { getReviews, postReview, deleteReview, updateReview } from "../api"; // ✅ API Calls

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useAuth(); // ✅ Get Logged-in User
  const csrfToken = useCsrfToken();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({ description: "", stars: 5 });
  const [editingReviewId, setEditingReviewId] = useState(null); // ✅ Track which review is being edited
  const [updatedReview, setUpdatedReview] = useState({ description: "", stars: 5 });

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        // ✅ Fetch Product Details
        const productResponse = await fetch(`https://shop-sphere-app.onrender.com/store/products/${id}/`);
        if (!productResponse.ok) throw new Error("Failed to load product");
        const productData = await productResponse.json();
        setProduct(productData);

        // ✅ Fetch Reviews
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

  // ✅ Handle Review Update Submission
  const handleSaveEdit = async (reviewId) => {
    try {
      const updatedReviewData = await updateReview(id, reviewId, updatedReview, csrfToken);
      setReviews(reviews.map((r) => (r.id === reviewId ? updatedReviewData : r)));
      setEditingReviewId(null); // ✅ Exit edit mode
    } catch (err) {
      console.error("Error updating review:", err);
      setError("Failed to update review.");
    }
  };

  // ✅ Handle Review Deletion
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(id, reviewId, csrfToken);
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error deleting review:", err);
      setError("Failed to delete review.");
    }
  };

  if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading product...</h2>;
  if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
  if (!product) return <h2 className="text-center text-gray-500 text-xl mt-10">Product not found.</h2>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-8">
        {/* ✅ Left Side - Product Image (Restored) */}
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

        {/* ✅ Right Side - Product Info */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-lg text-gray-500 mt-2">{product.description}</p>

          <div className="mt-4">
            <span className="text-2xl font-semibold text-blue-600">₹{product.unit_price.toFixed(2)}</span>
            <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${product.inventory > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {product.inventory > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* ✅ Display Review Count & Average Rating */}
          <div className="mt-4 text-gray-700">
            <p className="text-lg font-semibold">Rating: ⭐ {(product.average_rating ?? 0).toFixed(1)} / 5</p>
            <p className="text-sm">{product.review_count} Reviews</p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-full md:w-auto"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* ✅ Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <p className="text-gray-800 font-semibold">{review.user}</p>
              <p className="text-yellow-500">⭐ {review.stars} / 5</p>

              {/* ✅ Edit Mode */}
              {editingReviewId === review.id ? (
                <>
                  <textarea
                    value={updatedReview.description}
                    onChange={(e) => setUpdatedReview({ ...updatedReview, description: e.target.value })}
                    className="w-full border p-2 rounded-md mt-2"
                    rows="2"
                  />
                  <select
                    value={updatedReview.stars}
                    onChange={(e) => setUpdatedReview({ ...updatedReview, stars: parseInt(e.target.value) })}
                    className="border p-2 rounded-md mt-2"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} Stars
                      </option>
                    ))}
                  </select>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(review.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingReviewId(null)}
                      className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-600">{review.description}</p>
                  <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>

                  {/* ✅ Show Edit & Delete buttons for user’s own reviews */}
                  {user?.username === review.user && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingReviewId(review.id);
                          setUpdatedReview({ description: review.description, stars: review.stars });
                        }}
                        className="text-blue-500 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

