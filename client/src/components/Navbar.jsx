import React, { useState, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaLeaf, 
  FaShoppingCart, 
  FaUser, 
  FaHome, 
  FaSeedling, 
  FaUsers, 
  FaInfoCircle,
  FaBox,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaChartLine,
  FaEnvelope,
  FaUserCircle,
  FaTachometerAlt,
  FaClipboardList
} from 'react-icons/fa';
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("kisan_user"));
  } catch {}

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  // Update cart count
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("kisan_cart")) || [];
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ to, icon: Icon, label, badgeCount }) => (
    <li className="nav-item">
      <NavLink
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
        }
        onClick={closeMobileMenu}
      >
        <Icon className="nav-icon" />
        <span>{label}</span>
        {badgeCount > 0 && (
          <span className="badge bg-danger rounded-pill ms-1">
            {badgeCount}
          </span>
        )}
      </NavLink>
    </li>
  );

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${scrolled ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container">
          {/* LOGO */}
          <Link 
            className="navbar-brand d-flex align-items-center gap-2 fw-bold" 
            to="/"
            onClick={closeMobileMenu}
          >
            <div className="logo-icon bg-success rounded-circle d-flex align-items-center justify-content-center">
              <FaLeaf className="text-white" />
            </div>
            <span className="text-success fs-4">KisanCart</span>
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="fs-4" />
            ) : (
              <FaBars className="fs-4" />
            )}
          </button>

          {/* NAV ITEMS */}
          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-center gap-3">
              <NavItem to="/" icon={FaHome} label="Home" />

              {user?.role === "buyer" && (
                <NavItem to="/products" icon={FaShoppingBag} label="Products" />
              )}

              {user?.role === "farmer" && (
                <NavItem to="/farmer/products" icon={FaSeedling} label="My Products" />
              )}
              {user?.role === "admin" && (
                <NavItem
                  to="/admin"
                  icon={FaTachometerAlt}
                  label="Admin Panel"
                />
              )}

              {user?.role !== "admin" && (
                <NavItem to="/farmers" icon={FaUsers} label="Farmers" />
              )}

              <NavItem to="/about" icon={FaInfoCircle} label="About" />

              {/* CART (BUYER ONLY) */}
              {user?.role === "buyer" && (
                <NavItem 
                  to="/cart" 
                  icon={FaShoppingCart} 
                  label="Cart" 
                  badgeCount={cartCount}
                />
              )}

              {/* USER SECTION */}
              {user ? (
                <>
                  {/* USER DROPDOWN */}
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-outline-success d-flex align-items-center gap-2 dropdown-toggle rounded-pill"
                      data-bs-toggle="dropdown"
                      data-bs-display="static"
                      aria-expanded="false"
                      onClick={closeMobileMenu}
                    >
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="d-none d-lg-inline">{user.name?.split(" ")[0]}</span>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2">
                      
                      {/* COMMON USER INFO */}
                      <li className="dropdown-header px-3 py-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="user-avatar-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0">{user.name}</h6>
                            <small className="text-muted">{user.role === 'farmer' ? 'Farmer' : 'Buyer'}</small>
                          </div>
                        </div>
                      </li>
                      <li><hr className="dropdown-divider mx-3" /></li>

                      {/* FARMER OPTIONS */}
                      {user.role !== "admin" && user.role === "farmer" && (
                        <>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/dashboard" onClick={closeMobileMenu}>
                              <FaTachometerAlt />
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/profile" onClick={closeMobileMenu}>
                              <FaUserCircle />
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/farmer/orders" onClick={closeMobileMenu}>
                              <FaClipboardList />
                              Orders
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/messages" onClick={closeMobileMenu}>
                              <FaEnvelope />
                              Messages
                            </Link>
                          </li>
                        </>
                      )}

                      {/* BUYER OPTIONS */}
                      {user.role !== "admin" && user.role === "buyer" && (
                        <>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/buyer/dashboard" onClick={closeMobileMenu}>
                              <FaTachometerAlt />
                              Dashboard
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/buyer/profile" onClick={closeMobileMenu}>
                              <FaUserCircle />
                              Profile
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/buyer/orders" onClick={closeMobileMenu}>
                              <FaClipboardList />
                              My Orders
                            </Link>
                          </li>
                          <li>
                            <Link className="dropdown-item d-flex align-items-center gap-2" to="/messages" onClick={closeMobileMenu}>
                              <FaEnvelope />
                              Messages
                            </Link>
                          </li>
                        </>
                      )}

                      <li><hr className="dropdown-divider mx-3" /></li>
                      
                      {/* LOGOUT */}
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center gap-2 text-danger"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  {/* LOGIN/REGISTER FOR GUESTS */}
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className="nav-link d-flex align-items-center gap-2"
                      onClick={closeMobileMenu}
                    >
                      <FaUser />
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink 
                      to="/register" 
                      className="btn btn-success rounded-pill px-4"
                      onClick={closeMobileMenu}
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
      <div style={{ height: '80px' }} />

      {/* Overlay for mobile menu - NOW CORRECTLY PLACED */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
}