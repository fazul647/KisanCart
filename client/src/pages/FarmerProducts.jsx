import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import {
  FaTrash,
  FaBoxOpen,
  FaEdit,
  FaTag,
  FaSearch,
  FaPlus,
  FaLeaf,
  FaChevronLeft,
  FaChevronRight,
  FaTh,
  FaThList,
  FaCheckCircle,
  FaClock,
  FaSeedling,
} from "react-icons/fa";
import { MdAgriculture } from "react-icons/md";

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await API.get("/crops/mine");
      // Filter only active products
      const activeProducts = (res.data.products || []).filter(p => p.isActive === true);
      setProducts(activeProducts);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(id) {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await API.delete(`/crops/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      window.dispatchEvent(
        new CustomEvent("showToast", {
          detail: { message: "Product deleted successfully", type: "success" }
        })
      );
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  }

  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: "48px", height: "48px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)",
        padding: "32px 32px 48px",
        position: "relative",
      }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex align-items-center gap-3">
                <div style={{
                  background: "rgba(255,255,255,0.2)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <MdAgriculture style={{ color: "white", fontSize: "28px" }} />
                </div>
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: "white" }}>My Products</h4>
                  <p className="mb-0" style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                    Manage your active crop listings
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/add-product"
              style={{
                background: "white",
                color: "#2e7d32",
                padding: "10px 24px",
                borderRadius: "10px",
                textDecoration: "none",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <FaPlus /> Add New Product
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-fluid" style={{ marginTop: "-24px", padding: "0 32px 48px" }}>
        
        {/* Stats Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Total Products</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#1f2937" }}>{products.length}</h3>
                </div>
                <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "12px" }}>
                  <FaBoxOpen style={{ color: "#2e7d32", fontSize: "22px" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Active Products</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#1f2937" }}>{products.filter(p => p.isActive).length}</h3>
                </div>
                <div style={{ background: "#e8f5e9", padding: "10px", borderRadius: "12px" }}>
                  <FaLeaf style={{ color: "#2e7d32", fontSize: "22px" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div style={{
              background: "white",
              borderRadius: "16px",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "4px" }}>Categories</p>
                  <h3 className="fw-bold mb-0" style={{ color: "#1f2937" }}>{categories.length}</h3>
                </div>
                <div style={{ background: "#e0e7ff", padding: "10px", borderRadius: "12px" }}>
                  <FaTag style={{ color: "#4f46e5", fontSize: "22px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="position-relative">
                <FaSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-control"
                  style={{ paddingLeft: "38px", borderRadius: "10px", borderColor: "#e5e7eb" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                style={{ borderRadius: "10px", borderColor: "#e5e7eb" }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex gap-2">
                <button
                  className={`btn ${viewMode === "grid" ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("grid")}
                  style={{ borderRadius: "10px", flex: 1 }}
                >
                  <FaTh /> Grid
                </button>
                <button
                  className={`btn ${viewMode === "list" ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setViewMode("list")}
                  style={{ borderRadius: "10px", flex: 1 }}
                >
                  <FaThList /> List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-3">
          <p style={{ color: "#6b7280", fontSize: "13px" }}>
            Showing {paginatedProducts.length} of {filteredProducts.length} active products
          </p>
        </div>

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div style={{
            background: "white",
            borderRadius: "20px",
            padding: "80px 40px",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <FaSeedling size={64} color="#d1d5db" />
            <h5 className="fw-bold mt-3 mb-2" style={{ color: "#374151" }}>No active products found</h5>
            <p style={{ color: "#6b7280" }}>Get started by adding your first product</p>
            <Link to="/add-product" className="btn btn-success mt-3 px-4">
              <FaPlus className="me-2" /> Add Product
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="row g-4">
            {paginatedProducts.map((p) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={p._id}>
                <div style={{
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
                }}>
                  <div style={{ position: "relative", height: "200px", background: "#f3f4f6" }}>
                    <img
                      src={p.productImages?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      alt={p.productName}
                    />
                    <div style={{ position: "absolute", top: "10px", right: "10px" }}>
                      <span style={{ background: "#10b981", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, color: "white" }}>
                        <FaCheckCircle className="me-1" size={8} /> Active
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div className="mb-2">
                      <span style={{
                        background: "#f3f4f6",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#6b7280",
                      }}>
                        <FaTag className="me-1" size={8} /> {p.category || "Uncategorized"}
                      </span>
                    </div>
                    <h6 className="fw-bold mb-2" style={{ color: "#1f2937", fontSize: "15px" }}>{p.productName}</h6>
                    <div className="d-flex align-items-baseline gap-2 mb-3">
                      <span className="fw-bold" style={{ color: "#2e7d32", fontSize: "22px" }}>₹{p.price}</span>
                      <span style={{ color: "#6b7280", fontSize: "11px" }}>per {p.unit}</span>
                    </div>
                    <div className="mt-auto d-flex gap-2">
                      <Link
                        to={`/farmer/products/edit/${p._id}`}
                        className="flex-fill text-center py-2"
                        style={{ background: "#e0e7ff", color: "#4f46e5", textDecoration: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 500 }}
                      >
                        <FaEdit className="me-1" size={11} /> Edit
                      </Link>
                      <button
                        className="flex-fill py-2 border-0"
                        style={{ background: "#fee2e2", color: "#dc2626", borderRadius: "8px", fontSize: "12px", fontWeight: 500 }}
                        onClick={() => deleteProduct(p._id)}
                      >
                        <FaTrash className="me-1" size={11} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Product</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Category</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Price</th>
                    <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Stock</th>
                    <th style={{ padding: "16px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((p) => (
                    <tr key={p._id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={p.productImages?.[0] || "https://via.placeholder.com/48x48?text=No+Image"}
                            style={{ width: "48px", height: "48px", borderRadius: "10px", objectFit: "cover" }}
                            alt=""
                          />
                          <div>
                            <p className="fw-semibold mb-0" style={{ fontSize: "14px", color: "#1f2937" }}>{p.productName}</p>
                            <small style={{ color: "#6b7280", fontSize: "11px" }}>{p.unit}</small>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4b5563" }}>{p.category || "—"}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#2e7d32", fontSize: "14px" }}>₹{p.price}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "#4b5563" }}>
                        {p.quantity} {p.unit}s
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div className="d-flex gap-2 justify-content-end">
                          <Link to={`/farmer/products/edit/${p._id}`} className="btn btn-sm btn-outline-primary">
                            <FaEdit /> Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteProduct(p._id)}>
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="d-flex justify-content-center mt-5">
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ borderRadius: "10px" }}
              >
                <FaChevronLeft /> Prev
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? "btn-success" : "btn-outline-secondary"}`}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{ minWidth: "40px", borderRadius: "10px" }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="btn btn-outline-secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ borderRadius: "10px" }}
              >
                Next <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}