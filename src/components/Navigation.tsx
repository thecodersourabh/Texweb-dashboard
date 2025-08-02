import { Link } from "react-router-dom";
import { Wrench, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { ProfilePanel } from "./ProfilePanel/ProfilePanel";

export function Navigation() {
  const { setIsCartOpen, items } = useCart();
  const { isAuthenticated, user, loginWithRedirect } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Salvatore</span>
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-gray-900 transition-colors">
              My Services
            </Link>
            <Link to="/bookings" className="text-gray-600 hover:text-gray-900 transition-colors">
              Bookings
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <button className="text-gray-600 hover:text-gray-900">
            <Heart className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-gray-600 hover:text-gray-900 relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
            >
              <img
                src={user?.picture}
                alt={user?.name}
                className="h-8 w-8 rounded-full border-2 border-blue-200"
              />
              <span className="text-sm text-gray-700 hidden md:inline">{user?.name}</span>
            </button>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gray-100">
          <div className="flex flex-col space-y-4 pt-4">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/services" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Services
            </Link>
            <Link 
              to="/bookings" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bookings
            </Link>
            <Link 
              to="/about" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 hover:opacity-75 transition-opacity"
                >
                  <img
                    src={user?.picture}
                    alt={user?.name}
                    className="h-8 w-8 rounded-full border-2 border-blue-200"
                  />
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    loginWithRedirect();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                >
                  <User className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Profile Panel */}
      <ProfilePanel
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </nav>
  );
}
