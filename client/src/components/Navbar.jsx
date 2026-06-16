// Navbar.jsx - Enhanced UI/UX (All logic preserved)
import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaHome,
  FaUsers,
  FaInfoCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaTachometerAlt,
  FaUserCircle,
  FaEnvelope,
  FaClipboardList,
  FaStore,
  FaSeedling
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isScrolled, setIsScrolled] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("kisan_user"));
  } catch {}

  

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking a link
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container">
          {/* LOGO */}
          <Link className="navbar-brand" to="/" onClick={handleMobileLinkClick}>
            <FaSeedling className="brand-icon" />
            <span className="brand-text">Kisan<span className="brand-highlight">Cart</span></span>
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* NAVIGATION MENU */}
          <div className={`nav-menu ${isMobileMenuOpen ? 'nav-menu-active' : ''}`}>
            {/* Mobile Menu Header */}
            {isMobileMenuOpen && user && (
              <div className="mobile-user-header">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="mobile-user-avatar" />
                ) : (
                  <div className="mobile-user-avatar-placeholder">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="mobile-user-info">
                  <h4>{user.name}</h4>
                  <span className="mobile-user-role">{user.role}</span>
                </div>
              </div>
            )}

            <ul className="nav-links">
              {/* HOME */}
              <li className="nav-item">
                <NavLink 
                  to="/" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={handleMobileLinkClick}
                >
                  <FaHome className="nav-icon" />
                  <span>Home</span>
                </NavLink>
              </li>

              {/* PRODUCTS (buyer only) */}
              {user?.role === "buyer" && (
                <li className="nav-item">
                  <NavLink 
                    to="/products" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleMobileLinkClick}
                  >
                    <FaShoppingBag className="nav-icon" />
                    <span>Products</span>
                  </NavLink>
                </li>
              )}

              {/* FARMERS */}
              

              {/* MY PRODUCTS (ONLY FARMER) */}
              {user?.role === "farmer" && (
                <li className="nav-item">
                  <NavLink 
                    to="/farmer/products" 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    onClick={handleMobileLinkClick}
                  >
                    <FaStore className="nav-icon" />
                    <span>My Products</span>
                  </NavLink>
                </li>
              )}

              {/* ABOUT */}
              <li className="nav-item">
                <NavLink 
                  to="/about" 
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={handleMobileLinkClick}
                >
                  <FaInfoCircle className="nav-icon" />
                  <span>About</span>
                </NavLink>
              </li>

              {/* CART (buyer only) */}
              {user?.role === "buyer" && (
                <li className="nav-item">
                  <NavLink 
                    to="/cart" 
                    className={({ isActive }) => `nav-link cart-link ${isActive ? 'active' : ''}`}
                    onClick={handleMobileLinkClick}
                  >
                    <div className="cart-icon-wrapper">
                      <FaShoppingCart className="nav-icon" />
                     
                    </div>
                    <span>Cart</span>
                  </NavLink>
                </li>
              )}

              {/* USER SECTION */}
              {user ? (
                <li className="nav-item dropdown">
                  {/* User Menu Button */}
                  <button
                    className="user-menu-button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar-placeholder">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="user-name">{user.name?.split(" ")[0]}</span>
                    <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  <ul className="dropdown-menu">
                    {/* User Info Header */}
                    <li className="dropdown-header">
                      <div className="dropdown-user-info">
                        {user?.profilePic ? (
                          <img src={user.profilePic} alt={user.name} className="dropdown-user-avatar" />
                        ) : (
                          <div className="dropdown-user-avatar-placeholder">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="dropdown-user-details">
                          <strong>{user.name}</strong>
                          <span className="dropdown-user-role">{user.role}</span>
                        </div>
                      </div>
                    </li>

                    <li className="dropdown-divider"></li>

                    {/* Dashboard */}
                    <li>
                      <Link
                        className="dropdown-item"
                        to={user.role === "farmer" ? "/dashboard" : "/buyer/dashboard"}
                        onClick={handleMobileLinkClick}
                      >
                        <FaTachometerAlt className="dropdown-icon" />
                        Dashboard
                      </Link>
                    </li>

                    {/* Profile */}
                    <li>
                      <Link className="dropdown-item" to="/profile" onClick={handleMobileLinkClick}>
                        <FaUserCircle className="dropdown-icon" />
                        Profile
                      </Link>
                    </li>

                    {/* My Products (Only Farmer) */}
                    {user?.role === "farmer" && (
                      <li>
                        <Link className="dropdown-item" to="/farmer/products" onClick={handleMobileLinkClick}>
                          <FaStore className="dropdown-icon" />
                          My Products
                        </Link>
                      </li>
                    )}

                    {/* Orders */}
                    <li>
                      <Link
                        className="dropdown-item"
                        to={user.role === "farmer" ? "/farmer/orders" : "/buyer/orders"}
                        onClick={handleMobileLinkClick}
                      >
                        <FaClipboardList className="dropdown-icon" />
                        Orders
                      </Link>
                    </li>

                    {/* Messages */}
                    <li>
                      <Link className="dropdown-item" to="/messages" onClick={handleMobileLinkClick}>
                        <FaEnvelope className="dropdown-icon" />
                        Messages
                      </Link>
                    </li>

                    <li className="dropdown-divider"></li>

                    {/* Logout */}
                    <li>
                      <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <FaSignOutAlt className="dropdown-icon" />
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink 
                      to="/login" 
                      className={({ isActive }) => `nav-link login-link ${isActive ? 'active' : ''}`}
                      onClick={handleMobileLinkClick}
                    >
                      <FaUser className="nav-icon" />
                      <span>Login</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/register" 
                      className="btn-register"
                      onClick={handleMobileLinkClick}
                    >
                      Get Started
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="navbar-spacer"></div>
    </>
  );
}