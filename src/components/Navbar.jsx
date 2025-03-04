// import { Link } from "react-router-dom";
// import { useContext } from "react";
// import { CartContext } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext
//
// const Navbar = () => {
//   const { cartItems } = useContext(CartContext);
//   const { user, logout } = useAuth(); // ✅ Get user & logout function
//
//   return (
//     <nav className="bg-white shadow-md py-4">
//       <div className="container mx-auto flex justify-between items-center max-w-screen-xl px-6">
//         {/* ✅ Logo Section */}
//         <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition">
//           ShopSphere
//         </Link>
//
//         {/* ✅ Navigation Links */}
//         <div className="flex space-x-6">
//           <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
//
//           {user ? (
//             <>
//               <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">Profile</Link>
//               <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition">Orders</Link>
//               <button 
//                 onClick={logout} 
//                 className="text-gray-700 hover:text-red-500 transition"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
//               <Link to="/register" className="text-gray-700 hover:text-blue-600 transition">Register</Link>
//             </>
//           )}
//         </div>
//
//         {/* ✅ Cart Icon with Badge */}
//         <Link to="/cart" className="relative">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
//             className="w-8 h-8 text-gray-700 hover:text-blue-600 transition">
//             <path strokeLinecap="round" strokeLinejoin="round"
//               d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13a3 3 0 106 0m-6 0a3 3 0 106 0m-6 0H3m4 0l1.4-6M7 13l1.4-6m4.2 6L17 3m0 0h4m-4 0L15.6 5M17 3h-2.4M21 3l-.4 2M7 13h10" />
//           </svg>
//
//           {cartItems.length > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
//               {cartItems.length}
//             </span>
//           )}
//         </Link>
//       </div>
//     </nav>
//   );
// };
//
// export default Navbar;
//











import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth(); // ✅ Get user & logout function

  return (
    <nav className="bg-blue-600 shadow-md py-3">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl px-6">
        
        {/* ✅ Logo Section */}
        <Link to="/" className="text-2xl font-bold text-gray-100 drop-shadow-md hover:text-yellow-400 transition">
          ShopSphere
        </Link>

        {/* ✅ Search Bar */}
        {/* <div className="hidden md:flex items-center flex-grow mx-8"> */}
        {/*   <input */}
        {/*     type="text" */}
        {/*     placeholder="Search for products..." */}
        {/*     className="w-full p-2 rounded-l-md border-none focus:ring focus:ring-blue-400" */}
        {/*   /> */}
        {/*   <button className="bg-yellow-500 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 transition"> */}
        {/*     🔍 */}
        {/*   </button> */}
        {/* </div> */}

        {/* ✅ Navigation Links */}
        <div className="flex items-center space-x-6 text-gray-100 font-semibold drop-shadow-md">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-yellow-400 transition">Profile</Link>
              <Link to="/orders" className="hover:text-yellow-400 transition">Orders</Link>
              <button 
                onClick={logout} 
                className="hover:text-red-400 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
              <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
            </>
          )}
        </div>

        {/* ✅ Cart Icon with Badge */}
        <Link to="/cart" className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-8 h-8 text-gray-100 drop-shadow-md hover:text-yellow-400 transition">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l3-8H5.4M7 13a3 3 0 106 0m-6 0a3 3 0 106 0m-6 0H3m4 0l1.4-6M7 13l1.4-6m4.2 6L17 3m0 0h4m-4 0L15.6 5M17 3h-2.4M21 3l-.4 2M7 13h10" />
          </svg>

          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

