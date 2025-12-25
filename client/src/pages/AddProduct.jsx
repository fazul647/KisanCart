// client/src/pages/AddProduct.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    unit: "kg",
    quantityAvailable: "",
    availableUntil: "",
    productImages: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError("");
  }

  function updateImages(text) {
    const arr = text.split(",").map((s) => s.trim()).filter(Boolean);
    
    // Basic URL validation
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    };
    
    const invalidUrls = arr.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      setError(`Invalid URL(s) detected: ${invalidUrls.join(", ")}`);
    } else {
      setError("");
    }
    
    setForm((f) => ({ ...f, productImages: arr }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    const errors = [];
    
    if (!form.productName.trim()) errors.push("Product name is required");
    if (!form.category) errors.push("Category is required");
    if (!form.price || Number(form.price) <= 0) errors.push("Valid price is required");
    if (!form.quantityAvailable || Number(form.quantityAvailable) <= 0) errors.push("Valid quantity is required");
    if (!form.unit) errors.push("Unit is required");
    if (!form.availableUntil) errors.push("Available until date is required");
    if (form.productImages.length === 0) errors.push("At least one image URL is required");
    
    // Date validation
    if (form.availableUntil) {
      const selectedDate = new Date(form.availableUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push("Available until date cannot be in the past");
      }
    }

    if (errors.length > 0) {
      setError(errors.join(". "));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        productName: form.productName.trim(),
        category: form.category,
        description: form.description.trim(),
        price: Number(form.price),
        unit: form.unit,
        quantityAvailable: Number(form.quantityAvailable),
        availableUntil: new Date(form.availableUntil),
        productImages: form.productImages
      };

      const res = await API.post("/crops/add", payload);
      setSuccess("Product added successfully!");
      
      // Clear form after success
      setForm({
        productName: "",
        category: "",
        description: "",
        price: "",
        unit: "kg",
        quantityAvailable: "",
        availableUntil: "",
        productImages: []
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        nav("/farmer/products");
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Set minimum date for availableUntil (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "700px" }}>
        <h2 className="mb-3 text-success fw-bold text-center">
          Add Product — KisanCart (Farmer)
        </h2>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show">
            {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show">
            {success}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setSuccess("")}
              aria-label="Close"
            ></button>
          </div>
        )}

        <form onSubmit={submit} className="row g-3">

          {/* PRODUCT NAME */}
          <div className="col-12">
            <label className="form-label">Product Name *</label>
            <input
              className="form-control"
              required
              value={form.productName}
              onChange={(e) => update("productName", e.target.value)}
              placeholder="Enter product name"
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="col-md-6">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              required
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Grains">Grains</option>
              <option value="Dairy">Dairy</option>
              <option value="Pulses">Pulses</option>
              <option value="Spices">Spices</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* AVAILABLE UNTIL */}
          <div className="col-md-6">
            <label className="form-label">Available Until *</label>
            <input
              type="date"
              className="form-control"
              required
              value={form.availableUntil}
              min={getMinDate()}
              onChange={(e) => update("availableUntil", e.target.value)}
            />
            <small className="text-muted">Select a future date</small>
          </div>

          {/* DESCRIPTION */}
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Add product description (optional)"
            />
          </div>

          {/* PRICE, UNIT, QUANTITY */}
          <div className="col-md-4">
            <label className="form-label">Price (₹) *</label>
            <input
              type="number"
              className="form-control"
              required
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Unit *</label>
            <select
              className="form-select"
              value={form.unit}
              required
              onChange={(e) => update("unit", e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="liter">liter</option>
              <option value="bunch">bunch</option>
              <option value="bag">bag</option>
              <option value="unit">unit</option>
              <option value="dozen">dozen</option>
              <option value="packet">packet</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Quantity Available *</label>
            <input
              type="number"
              className="form-control"
              required
              min="1"
              step="1"
              value={form.quantityAvailable}
              onChange={(e) => update("quantityAvailable", e.target.value)}
              placeholder="0"
            />
          </div>

          {/* IMAGES REQUIRED */}
          <div className="col-12">
            <label className="form-label">Product Images (comma-separated URLs) *</label>
            <input
              className="form-control"
              required
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              onChange={(e) => updateImages(e.target.value)}
            />
            <small className="text-muted">
              Enter image URLs separated by commas. Each URL should start with http:// or https://
            </small>
          </div>

          {/* BUTTONS */}
          <div className="col-12 text-center mt-3">
            <button
              type="submit"
              className="btn btn-success px-4 me-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : "Add Product"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={() => nav("/farmer/products")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}