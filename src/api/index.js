import secureFetch from "../utils/api";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Fetch Addresses for the Authenticated User
export const fetchAddress = async () => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to fetch addresses.");
  }

  // Fetch the logged-in user's customer ID
  const userResponse = await secureFetch("/store/customers/me/", {
    headers: { ...getAuthHeaders() },
  });

  if (!userResponse.ok) throw new Error("Failed to fetch customer details");

  const userData = await userResponse.json();
  const customerId = userData.id;

  // Fetch addresses using the customer ID
  const response = await secureFetch(`/store/customers/${customerId}/addresses/`, {
    headers: { ...getAuthHeaders() },
  });

  if (!response.ok) throw new Error("Failed to fetch addresses");

  return response.json();
};

// ✅ Add a New Address for the Logged-in User
export const addAddress = async (addressData) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to add an address.");
  }

  // Fetch the logged-in user's customer ID
  const userResponse = await secureFetch("/store/customers/me/", {
    headers: { ...getAuthHeaders() },
  });

  if (!userResponse.ok) throw new Error("Failed to fetch customer details");

  const userData = await userResponse.json();
  const customerId = userData.id;

  // Add an address using the customer ID
  const response = await secureFetch(`/store/customers/${customerId}/addresses/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        ...addressData,
        customer: customerId,  // 🔥 Explicitly adding customer ID
      }),
    });


  if (!response.ok) throw new Error("Failed to add address");

  return response.json();
};


// ✅ Update an Existing Address for the Logged-in User
export const updateAddress = async (addressId, updatedData) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to update an address.");
  }

  // Fetch the logged-in user's customer ID
  const userResponse = await secureFetch("/store/customers/me/", {
    headers: { ...getAuthHeaders() },
  });

  if (!userResponse.ok) throw new Error("Failed to fetch customer details");

  const userData = await userResponse.json();
  const customerId = userData.id;

  // Update the address using the customer ID and address ID
  const response = await secureFetch(`/store/customers/${customerId}/addresses/${addressId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update address");

  return response.json();
};


export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/store/products/?search=${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }

    const data = await response.json();
    return data.results; // ✅ Return only the product results
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};


export const postReview = async (productId, reviewData) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to post a review.");
  }

  const response = await fetch(`${API_BASE_URL}/store/products/${productId}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `JWT ${token}`, // ✅ Require authentication
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    throw new Error("Failed to post review");
  }

  return await response.json(); // ✅ Return new review data
};

export const deleteReview = async (productId, reviewId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to delete a review.");
  }

  const response = await fetch(`${API_BASE_URL}/store/products/${productId}/reviews/${reviewId}/`, {
    method: "DELETE",
    headers: {
      "Authorization": `JWT ${token}`,  // ✅ Require authentication
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete review");
  }

  return true; // ✅ Successfully deleted
};

export const getReviews = async (productId) => {
  const response = await fetch(`${API_BASE_URL}/store/products/${productId}/reviews/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }

  return response.json();
};

// ✅ Update a Review
export const updateReview = async (productId, reviewId, updatedData, csrfToken) => {
  const response = await fetch(`${API_BASE_URL}/store/products/${productId}/reviews/${reviewId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken, // ✅ Required for security
      ...getAuthHeaders(),
    },
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) throw new Error("Failed to update review");

  return response.json(); // ✅ Return updated review
};


// ✅ Helper to Get JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return { Authorization: `JWT ${token}` };
};

// ✅ Send OTP
export const sendOTP = async (email) => {
  const response = await fetch(`${API_BASE_URL}/send_otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("Failed to send OTP");
  return response.json();
};

// ✅ Verify OTP
export const verifyOTP = async (email, otp) => {
  const response = await fetch(`${API_BASE_URL}/verify_otp/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) throw new Error(data.message || "Failed to verify OTP");
  return true;
};

export const updateUserInfo = async (token, userData) => {
  return secureFetch("/auth/users/me/", {
    method: "PATCH",  // ✅ Use PATCH to update only specific fields
    headers: { 
      "Content-Type": "application/json", 
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),  // ✅ Convert object to JSON string
  });
};

export const updatePassword = async (token, userData) => {
  return secureFetch("/auth/users/set_password/", {
    method: "POST",  // ✅ Use PATCH to update only specific fields
    headers: { 
      "Content-Type": "application/json", 
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),  // ✅ Convert object to JSON string
  });
};

// ✅ Register a New User
export const registerUser = async (userData) => {
  return secureFetch("/auth/users/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const registerCustomer = async (token, userData) => {
  return secureFetch("/store/customers/me/", {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json", 
      ...getAuthHeaders(),
    },
    body: JSON.stringify(userData),
  });
};

export const getCustomerInfo = async () => {
  const response = await secureFetch("/store/customers/me/", {
    headers: { ...getAuthHeaders() },
  });

  if (!response.ok) throw new Error("Failed to fetch customer info");

  return response.json(); 
};

// ✅ Get User Info (Fix: Convert response to JSON)
export const getUserInfo = async () => {
  const response = await secureFetch("/auth/users/me/", {
    headers: { ...getAuthHeaders() },
  });

  if (!response.ok) throw new Error("Failed to fetch user info");

  return response.json(); // ✅ Convert to JSON
};

export const fetchOrders = async () => {
  try {
    const response = await secureFetch("/store/orders/", {
      headers: { ...getAuthHeaders() },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json(); // ✅ Convert response to JSON
    // console.log("✅ Orders API Response:", data);

    return data; // ✅ Return parsed JSON
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
};

// ✅ Place an Order
// export const placeOrder = async (cartId) => {
//   return secureFetch("/store/orders/", {
//     method: "POST",
//     headers: { ...getAuthHeaders() },
//     body: JSON.stringify({ cart_id: cartId }),
//   });
// };
export const placeOrder = async (cartId) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication required to place an order.");
  }

  return secureFetch("/store/orders/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`, // ✅ Only send auth when required
    },
    body: JSON.stringify({ cart_id: cartId }),
  });
};

// ✅ Create a New Cart
export const createCart = async () => {
  try {
    const response = await secureFetch("/store/carts/", { method: "POST" });

    const data = await response.json(); // ✅ Convert response to JSON

    // console.log("CreateCart API Parsed Response:", data); // 🔥 Debugging log

    if (!data || !data.id) {
      throw new Error("Invalid cart response: Missing cart ID");
    }

    return data; // ✅ Return parsed response
  } catch (error) {
    console.error("Error creating cart:", error);
    throw error;
  }
};



// ✅ Fetch Existing Cart
export const fetchCart = async (cartId) => {
  const response = await fetch(`${API_BASE_URL}/store/carts/${cartId}/`, {
    method: "GET",
    credentials: "include", // ✅ Ensure cookies are sent
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log("FetchCart Response:", response); // ✅ Debugging

  if (response.redirected) {
    console.error("FetchCart was redirected. Possible authentication issue.");
    return null;
  }

  return response.json();
};


// ✅ Add Item to Cart
export const addItemToCart = async (cartId, productId, quantity) => {
  const token = localStorage.getItem("access_token");

  return secureFetch(`/store/carts/${cartId}/items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `JWT ${token}` }), // ✅ Include auth only if logged in
    },
    body: JSON.stringify({ product_id: productId, quantity }),
  });
};


// ✅ Update Item Quantity in Cart
export const updateCartItem = async (cartId, itemId, quantity) => {
  return secureFetch(`/store/carts/${cartId}/items/${itemId}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ quantity }),
  });
};

export const removeCartItem = async (cartId, itemId) => {
  const response = await fetch(`${API_BASE_URL}/store/carts/${cartId}/items/${itemId}/`, {
    method: "DELETE",
    credentials: "include", // ✅ Ensure cookies are sent
    headers: {
      "Content-Type": "application/json",
    },
  });

  // console.log("RemoveCartItem Response:", response); // ✅ Debugging

  if (response.redirected) {
    console.error("RemoveCartItem was redirected. Possible authentication issue.");
    return null;
  }

  return response.ok;
};


export const fetchProducts = async (page = 1, pageSize = 8, filters = {}) => {
  try {
    // Extract filter parameters
    const { collectionId, minPrice, maxPrice, sortBy } = filters;
    
    // Build query parameters
    let queryParams = `page=${page}&page_size=${pageSize}`;
    
    // Add collection filter if provided
    if (collectionId) {
      queryParams += `&collection_id=${collectionId}`;
    }
    
    // Add price range filters if provided
    if (minPrice !== undefined && minPrice !== '') {
      queryParams += `&unit_price__gt=${minPrice}`;
    }
    
    if (maxPrice !== undefined && maxPrice !== '') {
      queryParams += `&unit_price__lt=${maxPrice}`;
    }
    
    // Add sorting if provided
    if (sortBy) {
      queryParams += `&ordering=${sortBy}`;
    }
    
    const response = await secureFetch(`/store/products/?${queryParams}`);
    const data = await response.json();

    if (!data || !Array.isArray(data.results)) {
      throw new Error("Unexpected API response");
    }

    return {
      products: data.results,
      total: data.count, // total product count for pagination
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: [],
      total: 0,
    };
  }
};

export const fetchCollections = async () => {
  try {
    const response = await secureFetch("/store/collections/");
    const data = await response.json();

    // console.log("Fetched collections:", data);

    if (!data || !Array.isArray(data)) {
      throw new Error("Unexpected API response for collections");
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
};


// export const fetchProducts = async (page = 1, pageSize = 8) => {
//   try {
//     const response = await secureFetch(`/store/products/?page=${page}&page_size=${pageSize}`);
//     const data = await response.json();
//
//     if (!data || !Array.isArray(data.results)) {
//       throw new Error("Unexpected API response");
//     }
//
//     return {
//       products: data.results,
//       total: data.count, // total product count for pagination
//     };
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     return {
//       products: [],
//       total: 0,
//     };
//   }
// };


// ✅ Fetch Product Details
export const fetchProductDetail = async (id) => {
  try {
    const response = await secureFetch(`/store/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product details");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const response = await secureFetch("/auth/jwt/create/", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error("Invalid login credentials");
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

