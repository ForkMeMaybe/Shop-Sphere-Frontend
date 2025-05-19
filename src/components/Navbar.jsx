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
  Menu,
  X,
  Bug
} from 'lucide-react';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchQuery.trim()) {
        try {
          const results = await searchProducts(searchQuery);
          navigate("/search", { state: { results, query: searchQuery } });
          setIsMobileSearchOpen(false);
          setSearchQuery("");
        } catch (error) {
          console.error("Search failed:", error);
        }
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isMobileSearchOpen) setIsMobileSearchOpen(false);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-purple-600 shadow-lg w-full w-screen ">
      <div className="container mx-auto px-4 sm:px-6 max-w-screen-xl">
        {/* Main Navbar */}
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-white hover:text-white/90 transition-colors"
            onClick={handleMobileMenuClick}
          >
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="text-xl sm:text-2xl font-bold">Shop-Sphere</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-grow mx-12 relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="w-full px-4 py-2 pl-10 rounded-lg border-none focus:ring-2 focus:ring-purple-300 bg-white/10 text-white placeholder-white/70"
            />
            <Search 
              className="absolute left-3 top-2.5 h-5 w-5 text-white/70 cursor-pointer" 
              onClick={handleSearch}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center space-x-1 !text-white hover:text-white/90 transition-colors">
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link to="/orders" className="flex items-center space-x-1 !text-white hover:text-white/90 transition-colors">
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
                <Link to="/login" className="flex items-center space-x-1 !text-white hover:text-white/90 transition-colors">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 !text-white hover:text-white/90 transition-colors">
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </Link>
              </>
            )}
      <Link to="/reportbug" className="flex items-center space-x-1 !text-white hover:text-white/90 transition-colors">
      <Bug className="h-5 w-5" />
      <span>Bug</span>
      </Link>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center space-x-4 md:space-x-6">
            {/* Mobile Search Toggle */}
            <button 
              className="md:hidden !text-white hover:text-white/90 transition-colors"
              onClick={toggleMobileSearch}
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Cart Icon with Badge */}
            <Link 
              to="/cart" 
              className="relative ml-8 !text-white hover:text-white/90 transition-colors"
              onClick={handleMobileMenuClick}
            >
              <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-medium">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white hover:text-white/90 transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-4 py-3 border-t border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 pl-10 rounded-lg border-none focus:ring-2 focus:ring-purple-300 bg-white/10 text-white placeholder-white/70"
                autoFocus
              />
              <Search 
                className="absolute left-3 top-2.5 h-5 w-5 text-white/70 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-4 py-3 space-y-3">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 !text-white hover:text-white/90 transition-colors py-2"
                    onClick={handleMobileMenuClick}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                  <Link 
                    to="/orders" 
                    className="flex items-center space-x-2 !text-white hover:text-white/90 transition-colors py-2"
                    onClick={handleMobileMenuClick}
                  >
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      handleMobileMenuClick();
                    }} 
                    className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors py-2 w-full"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-2 !text-white hover:text-white/90 transition-colors py-2"
                    onClick={handleMobileMenuClick}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-2 !text-white hover:text-white/90 transition-colors py-2"
                    onClick={handleMobileMenuClick}
                  >
                    <UserPlus className="h-5 w-5" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            <Link 
            to="/reportbug" 
            className="flex items-center space-x-2 !text-white hover:text-white/90 transition-colors py-2"
            onClick={handleMobileMenuClick}
            >
            <Bug className="h-5 w-5" />
            <span>Report Bug</span>
            </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
