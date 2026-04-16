import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    address: { street: "", city: "", state: "", zipcode: "" },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  function update(path, value) {
    if (path.startsWith("address.")) {
      const key = path.split(".")[1];
      setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));
      // Clear error for this field
      if (errors[`address.${key}`]) {
        setErrors((e) => ({ ...e, [`address.${key}`]: "" }));
      }
    } else {
      setForm((f) => ({ ...f, [path]: value }));
      if (errors[path]) {
        setErrors((e) => ({ ...e, [path]: "" }));
      }
    }
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "Phone number must be 10 digits";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      const { token, user } = res.data;
      localStorage.setItem("kisan_token", token);
      localStorage.setItem("kisan_user", JSON.stringify(user));
      nav("/");
    } catch (err) {
      console.error(err);
      setErrors({ submit: err?.response?.data?.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="header-icon">🌿</div>
            <h1 className="header-title">Create Your Account</h1>
            <p className="header-subtitle">Join KisanCart and start smart farming</p>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="error-alert">
              <i className="error-icon">⚠️</i>
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👤</span>
                Full Name
              </label>
              <input
                type="text"
                className={`form-input ${errors.name ? "error" : ""}`}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📧</span>
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📞</span>
                Phone Number
              </label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? "error" : ""}`}
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="9876543210"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            {/* Password & Confirm Password */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create password"
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">✓</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>
            </div>

            {/* Role */}
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🌾</span>
                I am a
              </label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
              >
                <option value="farmer">👨‍🌾 Farmer - I want to sell my produce</option>
                <option value="buyer">🛒 Buyer - I want to buy fresh produce</option>
              </select>
            </div>

            {/* Address Section - Optional */}
            <div className="address-toggle">
              <button
                type="button"
                className={`toggle-btn ${showAddress ? "active" : ""}`}
                onClick={() => setShowAddress(!showAddress)}
              >
                <span className="toggle-icon">{showAddress ? "−" : "+"}</span>
                Add Address (Optional)
                <span className="toggle-hint">for better delivery experience</span>
              </button>
            </div>

            {showAddress && (
              <div className="address-section">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-input"
                    value={form.address.street}
                    onChange={(e) => update("address.street", e.target.value)}
                    placeholder="Street Address"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={form.address.city}
                      onChange={(e) => update("address.city", e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={form.address.state}
                      onChange={(e) => update("address.state", e.target.value)}
                      placeholder="State"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      value={form.address.zipcode}
                      onChange={(e) => update("address.zipcode", e.target.value)}
                      placeholder="Zip Code"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              className="register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                "Register"
              )}
            </button>

            {/* Login Link */}
            <div className="login-link">
              Already have an account?{" "}
              <Link to="/login">Login here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}