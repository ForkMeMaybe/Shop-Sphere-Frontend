// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context
// import { useCsrfToken } from "../utils/csrftoken.jsx"; // ✅ CSRF Token
// import { getReviews, postReview, deleteReview, updateReview } from "../api"; // ✅ API Calls
//
// const API_BASE_URL = import.meta.env.VITE_API_URL;
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
//   const [editingReviewId, setEditingReviewId] = useState(null); // ✅ Track which review is being edited
//   const [updatedReview, setUpdatedReview] = useState({ description: "", stars: 5 });
//
//   useEffect(() => {
//     const fetchProductAndReviews = async () => {
//       try {
//         // ✅ Fetch Product Details
//         const productResponse = await fetch(`${API_BASE_URL}/store/products/${id}/`);
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
//   if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading product...</h2>;
//   if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
//   if (!product) return <h2 className="text-center text-gray-500 text-xl mt-10">Product not found.</h2>;
//
//   return (
//     <div className="container mx-auto px-4 py-10">
//       <div className="grid md:grid-cols-2 gap-8">
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
//         <div>
//           <h1 className="text-4xl font-bold text-gray-800">{product.title}</h1>
//           <p className="text-lg text-gray-500 mt-2">{product.description}</p>
//           <div className="mt-4">
//             <span className="text-2xl font-semibold text-blue-600">₹{product.unit_price.toFixed(2)}</span>
//             <span className={`ml-4 px-3 py-1 text-sm font-medium rounded-full ${product.inventory > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//               {product.inventory > 0 ? "In Stock" : "Out of Stock"}
//             </span>
//           </div>
//           <div className="mt-4 text-gray-700">
//             <p className="text-lg font-semibold">Rating: ⭐ {(product.average_rating ?? 0).toFixed(1)} / 5</p>
//             <p className="text-sm">{product.review_count} Reviews</p>
//           </div>
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
//                 <option key={num} value={num}>{num} Stars</option>
//               ))}
//             </select>
//             <button
//               onClick={async () => {
//                 try {
//                   const response = await postReview(id, newReview, csrfToken);
//                   setReviews([...reviews, response]);
//                   setNewReview({ description: "", stars: 5 });
//                 } catch (err) {
//                   console.error("Error submitting review:", err);
//                   setError("Failed to submit review.");
//                 }
//               }}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600 disabled:opacity-50"
//             >
//               Submit Review
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
import { useAuth } from "../context/AuthContext";
import { useCsrfToken } from "../utils/csrftoken.jsx";
import { getReviews, postReview, deleteReview, updateReview } from "../api";

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

  if (loading) return <h2 className="text-center text-2xl font-semibold mt-10">Loading product...</h2>;
  if (error) return <h2 className="text-center text-red-500 text-xl mt-10">{error}</h2>;
  if (!product) return <h2 className="text-center text-gray-500 text-xl mt-10">Product not found.</h2>;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">{product.title}</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center items-center">
          {product.images.length > 0 && product.images[0]?.image_data ? (
            <img
              src={product.images[0].image_data}
              alt={product.title}
              className="max-h-[500px] max-w-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <img src="/placeholder.jpg" alt="No image available" className="max-h-[500px] max-w-full object-contain rounded-lg opacity-50" />
          )}
        </div>
        <div>
          <p className="text-lg text-gray-500 mt-2">{product.description}</p>
          <p className="text-xl font-bold text-blue-600 mt-2">₹{product.unit_price.toFixed(2)}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <p className="text-gray-800 font-semibold">{review.user}</p>
              <p className="text-yellow-500">⭐ {review.stars} / 5</p>
              <p className="text-gray-600">{review.description}</p>
              <p className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</p>
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
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        {/* Leave a Review Form */}
        {user && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Write a Review</h3>
            <textarea
              value={newReview.description}
              onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
              className="w-full border p-2 rounded-md mt-2"
              rows="3"
              placeholder="Write your review..."
            />
            <select
              value={newReview.stars}
              onChange={(e) => setNewReview({ ...newReview, stars: parseInt(e.target.value) })}
              className="border p-2 rounded-md mt-2"
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
              className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-600"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

