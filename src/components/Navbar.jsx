import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { logout } from "../store/authSlice";
import { toast } from "react-hot-toast";

function Navbar() {
  const cartItems = useSelector((state) => state.cart.items);
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // DARK MODE STATE & LOGIC
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between h-16">
          <div className="flex items-center">
            {/* Link replaces the standard <a> tag so the page doesn't refresh */}
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 tracking-tight"
            >
              TechStore.
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search book ..."
              className="border border-gray-300 rounded-lg px-4 py-2 dark:bg-gray-800 dark:text-white"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Magic line: Update the URL instantly on every keystroke!
                navigate(`/?query=${e.target.value}`);
              }}
            />

            <button
              onClick={() => navigate(`/?query=${searchQuery}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 font-medium"
            >
              Search
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition-colors"
              title="Toggle Dark Mode"
            >
              {isDarkMode ? "🌞" : "🌙"}
            </button>

            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>

            {authStatus ? (
              <>
                {userData?.email === "swastik@techstore.com" && (
                  <Link
                    to="/admin"
                    className="text-purple-600 dark:text-purple-400 font-bold hover:text-purple-800 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
                >
                  {userData?.name || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Signup
                </Link>
              </>
            )}

            <Link
              to="/cart"
              className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 font-medium transition-colors"
            >
              Cart
              {/* Badge for Cart Items */}
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
