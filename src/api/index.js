import secureFetch from "../utils/api";

const BASE_URL = "https://shop-sphere-app.onrender.com";

// ✅ Helper to Get JWT Token
const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return { Authorization: `JWT ${token}` };
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

// ✅ Register a New User
export const registerUser = async (userData) => {
  return secureFetch("/auth/users/", {
    method: "POST",
    body: JSON.stringify(userData),
  });
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
    console.log("✅ Orders API Response:", data);

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

    console.log("CreateCart API Parsed Response:", data); // 🔥 Debugging log

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
  const response = await fetch(`https://shop-sphere-app.onrender.com/store/carts/${cartId}/`, {
    method: "GET",
    credentials: "include", // ✅ Ensure cookies are sent
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("FetchCart Response:", response); // ✅ Debugging

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
    headers: { ...getAuthHeaders() },
    body: JSON.stringify({ quantity }),
  });
};

export const removeCartItem = async (cartId, itemId) => {
  const response = await fetch(`https://shop-sphere-app.onrender.com/store/carts/${cartId}/items/${itemId}/`, {
    method: "DELETE",
    credentials: "include", // ✅ Ensure cookies are sent
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("RemoveCartItem Response:", response); // ✅ Debugging

  if (response.redirected) {
    console.error("RemoveCartItem was redirected. Possible authentication issue.");
    return null;
  }

  return response.ok;
};

// ✅ Fetch All Products
export const fetchProducts = async () => {
  try {
    const response = await secureFetch("/store/products/");
    const data = await response.json();

    if (!data || !Array.isArray(data.results)) {
      throw new Error("Unexpected API response");
    }

    return data.results;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

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

