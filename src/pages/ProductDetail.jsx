import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCsrfToken } from "../utils/csrftoken.jsx";
import { getReviews, postReview, deleteReview, updateReview } from "../api";
import { 
  Star, 
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
  X
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // ✅ Track selected image

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

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
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
    <div className="mx-auto px-4 py-10 max-w-7xl">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">{product.title}</h1>
        <div className="grid md:grid-cols-2 gap-12">
          {/* ✅ Multiple Images Support */}
          <div className="flex flex-col items-center bg-gray-50 rounded-xl p-6">
            {product.images.length > 0 ? (
              <>
                {/* Main Image */}
                <img
                  src={product.images[selectedImageIndex]?.image_data}
                  alt={product.title}
                  className="max-h-[500px] max-w-full object-contain rounded-lg shadow-md transition-transform hover:scale-105"
                />
                
                {/* Thumbnails */}
                <div className="flex mt-4 space-x-3">
                  {product.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.image_data}
                      alt={`Thumbnail ${index + 1}`}
                      className={`h-16 w-16 object-cover rounded-lg cursor-pointer border-2 ${
                        index === selectedImageIndex ? "border-indigo-500" : "border-transparent"
                      }`}
                      onClick={() => handleImageClick(index)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageOff className="w-24 h-24 mb-4" />
                <p className="text-lg">No images available</p>
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="flex flex-col justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
            <div className="text-lg text-gray-600 leading-relaxed space-y-2">
                {product.description.split("|").map((item, index) => (
              <p key={index} className="border-l-4 border-indigo-500 pl-3">{item.trim()}</p>
            ))}
          </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 mt-6">
            <IndianRupee className="w-6 h-6" />
            <span>{product.unit_price.toFixed(2)}</span>
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
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className={`w-4 h-4 ${index < review.stars ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;

