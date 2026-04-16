import React, { useState, useEffect, useRef } from "react";
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
  FaShoppingBag
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const nav = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navbarRef = useRef(null);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("kisan_user"));
  } catch {}

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("kisan_cart")) || [];
    setCartCount(cart.length);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm">
        <div className="container">

          {/* LOGO */}
          <Link className="navbar-brand fw-bold text-success" to="/">
            🌾 KisanCart
          </Link>

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggler"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className={`collapse navbar-collapse ${isMobileMenuOpen ? "show" : ""}`}>
            <ul className="navbar-nav ms-auto align-items-center gap-3">

              {/* HOME */}
              <li>
                <NavLink to="/" className="nav-link">
                  <FaHome /> Home
                </NavLink>
              </li>

              {/* PRODUCTS (buyer only) */}
              {user?.role === "buyer" && (
                <li>
                  <NavLink to="/products" className="nav-link">
                    <FaShoppingBag /> Products
                  </NavLink>
                </li>
              )}

              {/* FARMERS */}
              {user?.role !== "admin" && (
                <li>
                  <NavLink to="/farmers" className="nav-link">
                    <FaUsers /> Farmers
                  </NavLink>
                </li>
              )}

              {/* 🔥 MY PRODUCTS (BOTH farmer & buyer) */}
              {user && (
                <li>
                  <NavLink to="/farmer/products" className="nav-link">
                    <FaShoppingBag /> My Products
                  </NavLink>
                </li>
              )}

              {/* ABOUT */}
              <li>
                <NavLink to="/about" className="nav-link">
                  <FaInfoCircle /> About
                </NavLink>
              </li>

              {/* CART (buyer only) */}
              {user?.role === "buyer" && (
                <li>
                  <NavLink to="/cart" className="nav-link">
                    <FaShoppingCart /> Cart ({cartCount})
                  </NavLink>
                </li>
              )}

              {/* ================= USER ================= */}
              {user ? (
                <li className="nav-item dropdown">

                  {/* BUTTON */}
                  <button
                    className="btn btn-outline-success d-flex align-items-center gap-2 dropdown-toggle rounded-pill"
                    data-bs-toggle="dropdown"
                  >
                    {user?.profilePic ? (
                      <img
                        src={`http://localhost:5000${user.profilePic}`}
                        className="nav-profile-img"
                      />
                    ) : (
                      <div className="user-avatar">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span>{user.name?.split(" ")[0]}</span>
                  </button>

                  {/* DROPDOWN */}
                  <ul className="dropdown-menu dropdown-menu-end">

                    {/* USER INFO */}
                    <li className="dropdown-header d-flex align-items-center gap-2">

                      {user?.profilePic ? (
                        <img
                          src={`http://localhost:5000${user.profilePic}`}
                          className="nav-profile-img-sm"
                        />
                      ) : (
                        <div className="user-avatar-sm">
                          {user.name?.charAt(0)}
                        </div>
                      )}

                      <div>
                        <strong>{user.name}</strong>
                        <br />
                        <small>{user.role}</small>
                      </div>
                    </li>

                    <li><hr /></li>

                    {/* DASHBOARD */}
                    <li>
                      <Link className="dropdown-item" to={
                        user.role === "farmer" ? "/dashboard" : "/buyer/dashboard"
                      }>
                        Dashboard
                      </Link>
                    </li>

                    {/* PROFILE */}
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profile
                      </Link>
                    </li>

                    {/* 🔥 MY PRODUCTS */}
                    <li>
                      <Link className="dropdown-item" to="/farmer/products">
                        My Products
                      </Link>
                    </li>

                    {/* 🔥 ORDERS */}
                    <li>
                      <Link className="dropdown-item" to={
                        user.role === "farmer" ? "/farmer/orders" : "/buyer/orders"
                      }>
                        Orders
                      </Link>
                    </li>

                    {/* MESSAGES */}
                    <li>
                      <Link className="dropdown-item" to="/messages">
                        Messages
                      </Link>
                    </li>

                    <li><hr /></li>

                    {/* LOGOUT */}
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>

                  </ul>
                </li>
              ) : (
                <>
                  <li>
                    <NavLink to="/login" className="nav-link">
                      <FaUser /> Login
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/register" className="btn btn-success">
                      Get Started
                    </NavLink>
                  </li>
                </>
              )}
              {/* ================= END USER ================= */}

            </ul>
          </div>
        </div>
      </nav>

      <div style={{ height: "70px" }} />
    </>
  );
}