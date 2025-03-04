import { refreshCsrfToken } from "./csrftoken"; // ✅ Import CSRF token function

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ✅ Refresh Access Token
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/jwt/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) {
      console.warn("Refresh token expired, logging out...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return null;
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    return data.access;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
};

// ✅ Secure API Fetch with CSRF & Token Refresh
const secureFetch = async (url, options = {}) => {
  let csrfToken = localStorage.getItem("csrftoken");

  if (!csrfToken) {
    csrfToken = await refreshCsrfToken();
  }

  let headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": csrfToken,
    ...options.headers,
  };

  let accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    headers["Authorization"] = `JWT ${accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // ✅ Handle CSRF Expiration
  if (response.status === 403) {
    console.warn("CSRF token expired, refreshing...");
    const newCsrfToken = await refreshCsrfToken();
    if (newCsrfToken) {
      headers["X-CSRFToken"] = newCsrfToken;
      response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  // ✅ Handle Token Expiry & Refresh
  if (response.status === 401) {
    console.warn("Access token expired, attempting to refresh...");
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers["Authorization"] = `JWT ${newAccessToken}`;
      response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    } else {
      console.warn("Refresh token expired, logging out...");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return response;
    }
  }

  return response;
};

export default secureFetch;

