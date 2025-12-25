import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { FaEye, FaTrash, FaClock, FaBoxOpen, FaEdit, FaTag, FaWeight, FaRupeeSign } from 'react-icons/fa';

export default function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/crops/mine")
      .then(res => {
        setProducts(res.data.products || []);
      })
      .catch(() => alert("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteProduct(id) {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await API.delete(`/crops/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5">
          <div>
            <h2 className="fw-bold display-6 mb-2">My Products</h2>
            <p className="text-muted mb-0">
              Manage your listed farm products and monitor their performance
            </p>
          </div>
          <div className="mt-3 mt-md-0">
            <Link to="/add-product" className="btn btn-success btn-lg px-4 rounded-pill">
              <FaEdit className="me-2" />
              Add New Product
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-5">
          <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 bg-success bg-opacity-10 rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle p-3 me-3">
                    <FaBoxOpen className="text-white fs-4" />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">{products.length}</h3>
                    <p className="text-muted mb-0">Total Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 bg-warning bg-opacity-10 rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-3 me-3">
                    <FaClock className="text-white fs-4" />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">
                      {products.filter(p => p.isActive).length}
                    </h3>
                    <p className="text-muted mb-0">Active Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6 mb-3">
            <div className="card border-0 bg-danger bg-opacity-10 rounded-4 h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center">
                  <div className="bg-danger rounded-circle p-3 me-3">
                    <FaClock className="text-white fs-4" />
                  </div>
                  <div>
                    <h3 className="fw-bold mb-0">
                      {products.filter(p => !p.isActive).length}
                    </h3>
                    <p className="text-muted mb-0">Expired Products</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-body p-5 text-center">
              <div className="bg-light rounded-circle p-4 d-inline-flex align-items-center justify-content-center mb-4">
                <FaBoxOpen className="text-muted fs-1" />
              </div>
              <h4 className="fw-bold mb-3">No Products Yet</h4>
              <p className="text-muted mb-4">
                You haven't listed any products yet. Start by adding your first product 
                to connect with buyers.
              </p>
              <Link to="/add-product" className="btn btn-success btn-lg px-5 rounded-pill">
                Add Your First Product
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="row g-4">
          {products.map(p => (
            <div className="col-lg-4 col-md-6" key={p._id}>
              <div className="card border-0 shadow-sm h-100 transition-all hover-lift">
                {/* Product Image with Status Badge */}
                <div className="position-relative overflow-hidden rounded-top-4">
                  <img
                    src={p.productImages?.[0] || "/placeholder.png"}
                    className="card-img-top product-image"
                    alt={p.productName}
                  />
                  <div className="position-absolute top-3 end-3">
                    {!p.isActive ? (
                      <span className="badge bg-danger px-3 py-2 rounded-pill">
                        <FaClock className="me-1" />
                        Expired
                      </span>
                    ) : (
                      <span className="badge bg-success px-3 py-2 rounded-pill">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="card-body p-4 d-flex flex-column">
                  {/* Product Info */}
                  <h5 className="fw-bold mb-2 text-truncate">{p.productName}</h5>
                  
                  <div className="d-flex align-items-center mb-3">
                    <FaTag className="text-success me-2" />
                    <span className="text-muted">{p.category}</span>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center mb-1">
                          <FaRupeeSign className="text-success me-1" />
                          <h6 className="fw-bold mb-0">Price</h6>
                        </div>
                        <p className="mb-0 fw-semibold">
                          ₹{p.price} / {p.unit}
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="bg-light rounded-3 p-3 text-center">
                        <div className="d-flex align-items-center justify-content-center mb-1">
                          <FaWeight className="text-success me-1" />
                          <h6 className="fw-bold mb-0">Unit</h6>
                        </div>
                        <p className="mb-0 fw-semibold text-capitalize">{p.unit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  {p.description && (
                    <p className="text-muted small mb-4 flex-grow-1">
                      {p.description.length > 80 
                        ? `${p.description.substring(0, 80)}...` 
                        : p.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-3 mt-auto">
                    <Link
                      to={`/products/${p._id}`}
                      className="btn btn-outline-success flex-fill d-flex align-items-center justify-content-center"
                    >
                      <FaEye className="me-2" />
                      View Details
                    </Link>
                    {/* EDIT */}
  <Link
    to={`/farmer/products/edit/${p._id}`}
    className="btn btn-outline-primary"
    title="Edit Product"
  >
    <FaEdit />
  </Link>
                    
                    {p.isActive ? (
                      <button
                        className="btn btn-outline-danger d-flex align-items-center justify-content-center px-4"
                        onClick={() => deleteProduct(p._id)}
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    ) : (
                      <button
                        className="btn btn-secondary d-flex align-items-center justify-content-center px-4"
                        disabled
                        title="Product Expired"
                      >
                        <FaClock />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Footer with Additional Info */}
                <div className="card-footer bg-transparent border-top-0 p-4 pt-0">
                  <small className="text-muted">
                    <FaClock className="me-1" />
                    Listed on {new Date(p.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Placeholder */}
        {products.length > 0 && (
          <div className="d-flex justify-content-center mt-5">
            <nav>
              <ul className="pagination">
                <li className="page-item disabled">
                  <span className="page-link">Previous</span>
                </li>
                <li className="page-item active">
                  <span className="page-link">1</span>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">2</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">3</a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      
    </div>
  );
}