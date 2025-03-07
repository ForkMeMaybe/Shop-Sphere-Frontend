import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { searchProducts } from "../api";
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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        try {
          const results = await searchProducts(searchQuery); // Fetch search results
          navigate("/search", { state: { results, query: searchQuery } }); // Pass results to SearchResults.jsx
        } catch (error) {
          console.error("Search failed:", error);
        }
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-600 shadow-lg w-screen ">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full px-4 py-2 pl-10 rounded-lg border-none focus:ring-2 focus:ring-purple-300 bg-white/10 text-white placeholder-white/70"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-white/70 cursor-pointer" onClick={handleSearch} />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors ">
                <User className="h-5 w-5 " />
                <span>Profile</span>
              </Link>
              <Link to="/orders" className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors">
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
              <Link to="/login" className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-1 text-white hover:text-white/90 transition-colors">
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
        <Link to="/cart" className="relative ml-6 text-white hover:text-white/90 transition-colors">
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
