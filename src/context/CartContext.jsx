import { createContext, useState, useEffect } from "react";
import { createCart, fetchCart, addItemToCart, removeCartItem } from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ Get stored cart ID safely
  const getStoredCartId = () => {
    const storedCartId = localStorage.getItem("cartId");
    return storedCartId && storedCartId !== "undefined" ? storedCartId : null;
  };

  // ✅ Initialize state with localStorage cart ID
  const [cartId, setCartId] = useState(getStoredCartId());
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // ✅ Create a New Cart and Store It
  const createAndStoreNewCart = async () => {
      console.warn("No cart found, creating a new one...");

      try {
        const newCart = await createCart(); // 🔥 API Call

        console.log("✅ API Response for New Cart:", newCart); // 🔥 Debugging log

        if (newCart && newCart.id) {
          console.log("✅ New cart created:", newCart.id);

          // ✅ Store cart ID correctly
          localStorage.setItem("cartId", newCart.id);
          setCartId(newCart.id);
          setCartItems([]);
          setTotalPrice(0);
        } else {
          throw new Error("Invalid response from createCart API");
        }
      } catch (error) {
        console.error("❌ Failed to create a new cart:", error);
        alert("Error creating cart. Please try again.");
        window.location.reload();
      }
    };

  // ✅ Fetch Cart Data & Reset If Needed
  const fetchCartData = async () => {
    let storedCartId = localStorage.getItem("cartId");

    if (!storedCartId || storedCartId === "undefined") {
      await createAndStoreNewCart();
      return;
    }

    try {
      console.log("Fetching cart data from backend for ID:", storedCartId);
      const response = await fetchCart(storedCartId);
      console.log("FetchCart Response:", response);

      if (response && response.id) {
        setCartItems(response.items || []);
        setTotalPrice(response.total_price || 0);
      } else {
        throw new Error("Cart not found in backend");
      }
    } catch (error) {
      console.warn("Cart not found or error fetching cart. Creating a new one...");
      localStorage.removeItem("cartId");
      await createAndStoreNewCart();
    }
  };

  // ✅ Load Cart from Backend on Startup
  useEffect(() => {
    fetchCartData();
  }, []);

  // ✅ Add Item to Cart
  const addToCart = async (product) => {
    let storedCartId = localStorage.getItem("cartId");

    if (!storedCartId || storedCartId === "undefined" || storedCartId === "null") {
      console.warn("Cart ID missing, creating a new cart...");
      await createAndStoreNewCart();
      storedCartId = localStorage.getItem("cartId"); // Fetch the new cart ID
    }

    try {
      console.log("Adding product to cart:", product.id);
      await addItemToCart(storedCartId, product.id, 1);
      fetchCartData(); // ✅ Refresh cart data
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  // ✅ Remove Item from Cart
  const removeFromCart = async (itemId) => {
    try {
      if (!cartId) return;

      console.log(`Removing item ${itemId} from cart...`);
      await removeCartItem(cartId, itemId);
      fetchCartData(); // ✅ Refresh cart data
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartId, cartItems, setCartItems, totalPrice, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
