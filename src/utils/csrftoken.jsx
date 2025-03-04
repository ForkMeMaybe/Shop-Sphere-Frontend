import { useState, useEffect } from "react";

// ✅ Function to Refresh CSRF Token
export const refreshCsrfToken = async () => {
  try {
    const response = await fetch("https://shop-sphere-app.onrender.com/get_csrf_token/", {
      method: "GET",
      credentials: "include",
    });

    const token = response.headers.get("X-CSRFToken");
    if (token) {
      localStorage.setItem("csrftoken", token);
      return token;
    }
  } catch (error) {
    console.error("Failed to refresh CSRF token:", error);
  }
  return null;
};

// ✅ Custom Hook to Use CSRF Token
export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState(localStorage.getItem("csrftoken") || "");

  useEffect(() => {
    if (!csrfToken) {
      refreshCsrfToken().then(setCsrfToken);
    }
  }, [csrfToken]);

  return csrfToken;
};

// ✅ CSRF Token Component for Forms
const CSRFTOKEN = () => {
  const csrfToken = useCsrfToken();
  return <input name="csrfmiddlewaretoken" value={csrfToken || ""} type="hidden" />;
};

export default CSRFTOKEN;

