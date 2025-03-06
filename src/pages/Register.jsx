// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CSRFTOKEN, { useCsrfToken } from "../utils/csrftoken.jsx"; // ✅ Import Global CSRF Token
//
// const Register = () => {
//   const navigate = useNavigate();
//   const csrfToken = useCsrfToken(); // ✅ Use Global CSRF Token
//
//   const [formData, setFormData] = useState({
//     username: "",
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     re_password: "",
//   });
//
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpMessage, setOtpMessage] = useState(""); // ✅ Store OTP success message
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   // ✅ Send OTP for email verification
//   const handleSendOTP = async () => {
//     setLoading(true);
//     setError("");
//     setOtpMessage("");
//
//     try {
//       const response = await fetch("https://shop-sphere-app.onrender.com/send_otp/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         credentials: "include",
//         body: JSON.stringify({ email: formData.email }),
//       });
//
//       const data = await response.json();
//       if (response.ok) {
//         setOtpSent(true);
//         setOtpMessage("OTP sent successfully. Please check your email."); // ✅ Show OTP sent message
//       } else {
//         setError(data.error || "Failed to send OTP. Try again.");
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   // ✅ Verify OTP before allowing registration
//   const handleVerifyOTP = async () => {
//     setLoading(true);
//     setError("");
//     setOtpMessage("");
//
//     try {
//       const response = await fetch("https://shop-sphere-app.onrender.com/verify_otp/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         credentials: "include",
//         body: JSON.stringify({ email: formData.email, otp }),
//       });
//
//       const data = await response.json();
//       if (response.ok && data.success) {
//         setOtpVerified(true);
//         setOtpMessage(data.message || "OTP Verified Successfully! ✅"); // ✅ Show success message
//       } else {
//         setError(data.message || "Invalid OTP. Try again.");
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!otpVerified) {
//       setError("Please verify your email before registering.");
//       return;
//     }
//
//     setLoading(true);
//     setError("");
//     setFieldErrors({});
//
//     try {
//       const response = await fetch("https://shop-sphere-app.onrender.com/auth/users/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrfToken,
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//           re_password: formData.re_password,
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//         }),
//       });
//
//       const data = await response.json();
//       if (response.ok) {
//         alert("Registration Successful! 🎉");
//         navigate("/login");
//       } else {
//         if (data.username || data.email || data.password || data.re_password) {
//           setFieldErrors(data);
//         } else {
//           setError(data.error || "Failed to register. Try again.");
//         }
//       }
//     } catch {
//       setError("Network error. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>
//
//         {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
//         {otpMessage && <p className="text-green-500 text-sm text-center mt-2">{otpMessage}</p>} {/* ✅ Show OTP messages */}
//
//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           <CSRFTOKEN /> {/* ✅ Include CSRF Token Globally */}
//
//           {/* ✅ Username Field */}
//           <input
//             type="text"
//             name="username"
//             placeholder="Username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             className={`w-full p-3 border ${fieldErrors.username ? "border-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:ring focus:ring-blue-300`}
//           />
//           {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username[0]}</p>}
//
//           {/* First Name */}
//           <input
//             type="text"
//             name="first_name"
//             placeholder="First Name"
//             value={formData.first_name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
//           />
//
//           {/* Last Name */}
//           <input
//             type="text"
//             name="last_name"
//             placeholder="Last Name"
//             value={formData.last_name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
//           />
//
//           {/* Email + OTP Section */}
//           <div className="flex space-x-2">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email Address"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
//             />
//             <button
//               type="button"
//               onClick={handleSendOTP}
//               disabled={otpSent}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
//             >
//               {otpSent ? "OTP Sent" : "Send OTP"}
//             </button>
//           </div>
//
//           {otpSent && (
//             <div className="flex space-x-2">
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 disabled={otpVerified} // ✅ Disable after verification
//                 className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
//               />
//               <button
//                 type="button"
//                 onClick={handleVerifyOTP}
//                 disabled={otpVerified} // ✅ Disable button after verification
//                 className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
//               >
//                 {otpVerified ? "Verified ✅" : "Verify OTP"}
//               </button>
//             </div>
//           )}
//
//           {/* Password Fields */}
//           <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"/>
//
//           <input type="password" name="re_password" placeholder="Confirm Password" value={formData.re_password} onChange={handleChange} required className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"/>
//
//           <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!otpVerified || loading}>
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export default Register;
//


















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CSRFTOKEN, { useCsrfToken } from "../utils/csrftoken.jsx";
import { UserPlus, Mail, Lock, User, Send, CheckCircle, UserCircle, ChevronRight } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const navigate = useNavigate();
  const csrfToken = useCsrfToken();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    setOtpMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/send_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include", // ✅ Ensure CSRF token is sent
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully! Check your email.");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch {
      setError("An error occurred while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    setOtpMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/verify_otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include", // ✅ Ensure CSRF token is sent
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true);
        setOtpMessage("Email verified successfully!");
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch {
      setError("An error occurred while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your email first");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate("/login");
      } else {
        if (data.errors) {
          setFieldErrors(data.errors);
        }
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <UserPlus className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-500">Join our community today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}
        
        {otpMessage && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {otpMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <CSRFTOKEN />

          <div className="space-y-4">div
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    fieldErrors.username ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400`}
                />
              </div>
              {fieldErrors.username && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    placeholder="Enter first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Enter last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={otpSent}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    otpSent
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  } disabled:opacity-50`}
                  title={otpSent ? "OTP Sent" : "Send verification code"}
                >
                  {otpSent ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Verification Code
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <input
                      id="otp"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={otpVerified}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    disabled={otpVerified}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="re_password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="re_password"
                  type="password"
                  name="re_password"
                  placeholder="Confirm your password"
                  value={formData.re_password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!otpVerified || loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 flex items-center justify-center space-x-2 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <span>Create Account</span>
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

