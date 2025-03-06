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
//     <nav className="bg-blue-600 shadow-md py-3">
//       <div className="container mx-auto flex justify-between items-center max-w-screen-xl px-6">
//         
//         {/* ✅ Logo Section */}
//         <Link to="/" className="text-2xl font-bold text-gray-100 drop-shadow-md hover:text-yellow-400 transition">
//           ShopSphere
//         </Link>
//
//         {/* ✅ Search Bar */}
//         {/* <div className="hidden md:flex items-center flex-grow mx-8"> */}
//         {/*   <input */}
//         {/*     type="text" */}
//         {/*     placeholder="Search for products..." */}
//         {/*     className="w-full p-2 rounded-l-md border-none focus:ring focus:ring-blue-400" */}
//         {/*   /> */}
//         {/*   <button className="bg-yellow-500 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 transition"> */}
//         {/*     🔍 */}
//         {/*   </button> */}
//         {/* </div> */}
//
//         {/* ✅ Navigation Links */}
//         <div className="flex items-center space-x-6 text-gray-100 font-semibold drop-shadow-md">
//           {user ? (
//             <>
//               <Link to="/profile" className="hover:text-yellow-400 transition">Profile</Link>
//               <Link to="/orders" className="hover:text-yellow-400 transition">Orders</Link>
//               <button 
//                 onClick={logout} 
//                 className="hover:text-red-400 transition"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
//               <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
//             </>
//           )}
//         </div>
//
//         {/* ✅ Cart Icon with Badge */}
//         <Link to="/cart" className="relative">
//           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
//             className="w-8 h-8 text-gray-100 drop-shadow-md hover:text-yellow-400 transition">
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
import { useAuth } from "../context/AuthContext";
import { 
  ShoppingBag, 
  Search, 
  User, 
  Package, 
  LogOut, 
  LogIn, 
  UserPlus, 
  ShoppingCart, 
  Menu 
} from 'lucide-react';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl px-6 py-4">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors"
        >
          <ShoppingBag className="h-8 w-8" />
          <span className="text-2xl font-bold">Shop-Sphere</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-grow mx-12 relative">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 pl-10 rounded-lg border-none focus:ring-2 focus:ring-purple-300 bg-white/10 text-white placeholder-white/70"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70" />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                to="/profile" 
                className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/orders" 
                className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors"
              >
                <Package className="h-5 w-5" />
                <span>Orders</span>
              </Link>
              <button 
                onClick={logout} 
                className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors"
              >
                <UserPlus className="h-5 w-5" />
                <span>Register</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white hover:text-white/90 transition-colors">
          <Menu className="h-6 w-6" />
        </button>

        {/* Cart Icon with Badge */}
        <Link 
          to="/cart" 
          className="relative ml-6 text-white hover:text-white/90 transition-colors"
        >
          <ShoppingCart className="h-7 w-7" />
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
