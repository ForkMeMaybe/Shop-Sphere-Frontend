// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import CSRFTOKEN, { useCsrfToken, refreshCsrfToken } from "../utils/csrftoken.jsx"; // ✅ Import Global CSRF Token
//
// const Register = () => {
//   const navigate = useNavigate();
//   const csrfToken = useCsrfToken(); // ✅ Use Global CSRF Token
//
//   const [formData, setFormData] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//   });
//
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [fieldErrors, setFieldErrors] = useState({});
//
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
//
//   const handleSendOTP = async () => {
//     setLoading(true);
//     setError("");
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
//   const handleVerifyOTP = async () => {
//     setLoading(true);
//     setError("");
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
//       if (response.ok) {
//         setOtpVerified(true);
//       } else {
//         setError(data.error || "Invalid OTP. Try again.");
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
//           email: formData.email,
//           username: formData.email.split("@")[0],
//           password: formData.password,
//           re_password: formData.password,
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
//         if (data.email || data.username || data.password || data.re_password) {
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
//
//         <form onSubmit={handleSubmit} className="mt-4 space-y-4">
//           <CSRFTOKEN /> {/* ✅ Include CSRF Token Globally */}
//
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
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className={`w-full p-3 border ${fieldErrors.email ? "border-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:ring focus:ring-blue-300`}
//           />
//           {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email[0]}</p>}
//
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className={`w-full p-3 border ${fieldErrors.password ? "border-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:ring focus:ring-blue-300`}
//           />
//           {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password[0]}</p>}
//
//           <input
//             type="password"
//             name="re_password"
//             placeholder="Confirm Password"
//             value={formData.re_password}
//             onChange={handleChange}
//             required
//             className={`w-full p-3 border ${fieldErrors.re_password ? "border-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:ring focus:ring-blue-300`}
//           />
//           {fieldErrors.re_password && <p className="text-red-500 text-sm">{fieldErrors.re_password[0]}</p>}
//
//           <button
//             type="submit"
//             className={`w-full bg-blue-600 text-white py-3 rounded-md ${
//               loading || !otpVerified ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
//             }`}
//             disabled={loading || !otpVerified}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
//
// export default Register;

















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CSRFTOKEN, { useCsrfToken } from "../utils/csrftoken.jsx"; // ✅ Import Global CSRF Token

const Register = () => {
  const navigate = useNavigate();
  const csrfToken = useCsrfToken(); // ✅ Use Global CSRF Token

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
  const [otpMessage, setOtpMessage] = useState(""); // ✅ Store OTP success message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Send OTP for email verification
  const handleSendOTP = async () => {
    setLoading(true);
    setError("");
    setOtpMessage("");

    try {
      const response = await fetch("https://shop-sphere-app.onrender.com/send_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setOtpMessage("OTP sent successfully. Please check your email."); // ✅ Show OTP sent message
      } else {
        setError(data.error || "Failed to send OTP. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP before allowing registration
  const handleVerifyOTP = async () => {
    setLoading(true);
    setError("");
    setOtpMessage("");

    try {
      const response = await fetch("https://shop-sphere-app.onrender.com/verify_otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOtpVerified(true);
        setOtpMessage(data.message || "OTP Verified Successfully! ✅"); // ✅ Show success message
      } else {
        setError(data.message || "Invalid OTP. Try again.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setError("Please verify your email before registering.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await fetch("https://shop-sphere-app.onrender.com/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          re_password: formData.re_password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration Successful! 🎉");
        navigate("/login");
      } else {
        if (data.username || data.email || data.password || data.re_password) {
          setFieldErrors(data);
        } else {
          setError(data.error || "Failed to register. Try again.");
        }
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>

        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        {otpMessage && <p className="text-green-500 text-sm text-center mt-2">{otpMessage}</p>} {/* ✅ Show OTP messages */}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <CSRFTOKEN /> {/* ✅ Include CSRF Token Globally */}

          {/* ✅ Username Field */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className={`w-full p-3 border ${fieldErrors.username ? "border-red-500" : "border-gray-300"} text-gray-900 rounded-md focus:ring focus:ring-blue-300`}
          />
          {fieldErrors.username && <p className="text-red-500 text-sm">{fieldErrors.username[0]}</p>}

          {/* First Name */}
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
          />

          {/* Last Name */}
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
          />

          {/* Email + OTP Section */}
          <div className="flex space-x-2">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
            />
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={otpSent}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </div>

          {otpSent && (
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={otpVerified} // ✅ Disable after verification
                className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"
              />
              <button
                type="button"
                onClick={handleVerifyOTP}
                disabled={otpVerified} // ✅ Disable button after verification
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {otpVerified ? "Verified ✅" : "Verify OTP"}
              </button>
            </div>
          )}

          {/* Password Fields */}
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"/>

          <input type="password" name="re_password" placeholder="Confirm Password" value={formData.re_password} onChange={handleChange} required className="w-full p-3 border border-gray-300 text-gray-900 rounded-md focus:ring focus:ring-blue-300"/>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50" disabled={!otpVerified || loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

