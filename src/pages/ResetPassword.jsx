import { useState } from "react";
import { KeyRound, Mail, Send, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setMessage("");
    setError("");
    setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <KeyRound className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-blue-100">Enter your email to reset your password</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm">{message}</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Email</span>
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 mt-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
