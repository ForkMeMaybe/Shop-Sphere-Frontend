// import { useEffect, useState } from "react";
// import { getUserInfo, updateUserInfo } from "../api";
//
// const Profile = () => {
//   const token = localStorage.getItem("access_token");
//   const [user, setUser] = useState({
//     username: "",
//     email: "",
//     first_name: "",
//     last_name: "",
//   });
//   const [message, setMessage] = useState("");
//
//   useEffect(() => {
//     const loadUserInfo = async () => {
//       if (!token) return;
//       try {
//         const data = await getUserInfo();
//         console.log("Fetched user data:", data);
//
//         // ✅ Ensure all fields have values to avoid uncontrolled input issue
//         setUser({
//           username: data.username || "",
//           email: data.email || "",
//           first_name: data.first_name || "",
//           last_name: data.last_name || "",
//         });
//       } catch (error) {
//         console.error("Failed to load user info", error);
//       }
//     };
//
//     loadUserInfo();
//   }, [token]);
//
//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//
//     try {
//       await updateUserInfo(token, user);
//       setMessage("Profile updated successfully!");
//     } catch (error) {
//       setMessage("Failed to update profile.");
//     }
//   };
//
//   if (!token) return <h2 className="text-center text-red-500">Please log in to view your profile.</h2>;
//
//   return (
//     <div className="container mx-auto max-w-lg bg-white shadow-lg rounded-lg p-6 mt-10">
//       <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h2>
//
//       {message && <p className="text-center text-green-500 font-semibold">{message}</p>}
//
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Username (Non-editable) */}
//         <div>
//           <label className="block text-gray-600 font-semibold mb-1">Username</label>
//           <input
//             type="text"
//             name="username"
//             value={user.username}
//             disabled
//             className="w-full border p-3 rounded-md bg-gray-100 text-gray-900 font-medium"
//           />
//         </div>
//
//         {/* Email */}
//         <div>
//           <label className="block text-gray-600 font-semibold mb-1">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={user.email}
//             onChange={handleChange}
//             required
//             className="w-full border p-3 rounded-md text-gray-900 font-medium"
//           />
//         </div>
//
//         {/* First Name */}
//         <div>
//           <label className="block text-gray-600 font-semibold mb-1">First Name</label>
//           <input
//             type="text"
//             name="first_name"
//             value={user.first_name}
//             onChange={handleChange}
//             className="w-full border p-3 rounded-md text-gray-900 font-medium"
//           />
//         </div>
//
//         {/* Last Name */}
//         <div>
//           <label className="block text-gray-600 font-semibold mb-1">Last Name</label>
//           <input
//             type="text"
//             name="last_name"
//             value={user.last_name}
//             onChange={handleChange}
//             className="w-full border p-3 rounded-md text-gray-900 font-medium"
//           />
//         </div>
//
//         {/* Update Button */}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
//         >
//           Update Profile
//         </button>
//       </form>
//     </div>
//   );
// };
//
// export default Profile;
//























import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo } from "../api";

const Profile = () => {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadUserInfo = async () => {
      if (!token) {
        console.warn("No token found, redirecting to login...");
        navigate("/login");
        return;
      }

      try {
        const data = await getUserInfo();
        setUser({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
        });
      } catch (error) {
        console.error("Failed to load user info", error);
        if (error.message.includes("Failed to refresh token")) {
          console.warn("Logging out user...");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        }
      }
    };

    loadUserInfo();
  }, [token, navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await updateUserInfo(token, user);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto max-w-lg bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">My Profile</h2>

      {message && <p className="text-center text-green-500 font-semibold">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ Username Field */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
            placeholder="Enter your username"
          />
        </div>

        {/* ✅ Email Field */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
            placeholder="Enter your email"
          />
        </div>

        {/* ✅ First Name Field */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
            placeholder="Enter your first name"
          />
        </div>

        {/* ✅ Last Name Field */}
        <div>
          <label className="block text-gray-700 font-semibold mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:ring focus:ring-blue-300"
            placeholder="Enter your last name"
          />
        </div>

        {/* ✅ Update Profile Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
