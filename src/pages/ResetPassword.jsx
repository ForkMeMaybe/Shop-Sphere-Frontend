import { useState } from "react";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async () => {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/users/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send reset email");

      setMessage("Password reset email sent. Check your inbox!");
    } catch (err) {
      setError("Error sending reset email.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold mb-6">Reset Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        className="p-3 border rounded-lg mb-4"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg" onClick={handleReset}>
        Send Reset Email
      </button>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default ResetPassword;

