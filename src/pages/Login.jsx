// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Lock, User, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react';
//
// const Login = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//
//   const [credentials, setCredentials] = useState({ username: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//
//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };
//
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//
//     try {
//       await login(credentials.username, credentials.password);
//       navigate("/");
//     } catch (error) {
//       setError("Invalid username or password");
//     }
//   };
//
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 w-screen ">
//       <div className="w-full max-w-md">
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
//               <Lock className="w-10 h-10 text-white" />
//             </div>
//             <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//             <p className="text-blue-100">Please sign in to continue</p>
//           </div>
//
//           {/* Form Section */}
//           <div className="p-8">
//             {error && (
//               <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
//                 <p className="text-red-500 text-sm text-center">{error}</p>
//               </div>
//             )}
//
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                   <User className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="username"
//                   placeholder="Username"
//                   value={credentials.username}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-12 pr-4 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//                 />
//               </div>
//
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                   <Lock className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="Password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-12 pr-12 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//
//               <button
//                 type="submit"
//                 className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
//               >
//                 <span className="flex items-center justify-center gap-2">
//                   Sign In
//                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
//                 </span>
//               </button>
//             </form>
//
//             <div className="mt-8 text-center">
//               <p className="text-sm text-gray-500">
//                 Don't have an account?{' '}
//                 <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
//                   Create Account
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default Login;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock, User, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(credentials.username, credentials.password);
      navigate("/");
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 w-screen">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-100">Please sign in to continue</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-12 py-3.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </button>

              {/* Password Reset Button */}
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="mt-4 w-full text-blue-600 hover:text-blue-700 font-medium text-center transition-colors"
              >
                Forgot Password?
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

