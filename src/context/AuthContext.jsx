import { createContext, useContext, useState, useEffect } from "react";
import secureFetch from "../utils/api";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext(null);

// ✅ Helper Functions for Token Storage
const getStoredToken = () => localStorage.getItem("access_token");

const storeTokens = (access, refresh) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

const removeTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(getStoredToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accessToken) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  // ✅ Login User
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/jwt/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      storeTokens(data.access, data.refresh);
      setAccessToken(data.access);
      await fetchUserInfo();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // ✅ Fetch User Info
  const fetchUserInfo = async () => {
    try {
      const response = await secureFetch("/auth/users/me/", {
        headers: { Authorization: `JWT ${getStoredToken()}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user info");

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error(error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout User
  const logout = () => {
    removeTokens();
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, accessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to Use Auth
export const useAuth = () => useContext(AuthContext);
export default AuthProvider;

