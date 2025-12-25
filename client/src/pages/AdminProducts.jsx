import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/admin/products")
      .then(res => setProducts(res.data.products || []))
      .catch(() => alert("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  async function deleteProduct(id, name) {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    try {
      await API.delete(`/admin/products/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  }

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category) => {
    const categories = {
      vegetables: { class: "success", icon: "🥦" },
      fruits: { class: "warning", icon: "🍎" },
      grains: { class: "info", icon: "🌾" },
      dairy: { class: "primary", icon: "🥛" },
      spices: { class: "danger", icon: "🌶️" },
      organic: { class: "success", icon: "🌿" }
    };
    const cat = categories[category] || { class: "secondary", icon: "📦" };
    return (
      <span className={`badge bg-${cat.class} bg-opacity-10 text-${cat.class} border border-${cat.class} border-opacity-25`}>
        {cat.icon} {category}
      </span>
    );
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading farm produce...</p>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success mb-1">🌱 Farm Produce</h2>
          <p className="text-muted">Manage all farm products and inventory</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search products, farmers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards - Removed Average Price */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-success">Total Products</h6>
                  <h3 className="mb-0">{products.length}</h3>
                </div>
                <i className="bi bi-basket text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-warning">Categories</h6>
                  <h3 className="mb-0">{new Set(products.map(p => p.category)).size}</h3>
                </div>
                <i className="bi bi-tags text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-info">Active Farmers</h6>
                  <h3 className="mb-0">{new Set(products.map(p => p.farmer?._id)).size}</h3>
                </div>
                <i className="bi bi-person-check text-info fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Farm Products ({filteredProducts.length})</h5>
        </div>
        <div className="card-body p-0">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-basket text-muted fs-1"></i>
              <p className="mt-2 text-muted">No products found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 ps-4">Product</th>
                    <th className="border-0">Farmer</th>
                    <th className="border-0">Category</th>
                    <th className="border-0">Price</th>
                    <th className="border-0 text-end pe-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product._id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.productName}
                              className="rounded me-3"
                              style={{width: "40px", height: "40px", objectFit: "cover"}}
                            />
                          ) : (
                            <div className="rounded bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                                 style={{width: "40px", height: "40px"}}>
                              <i className="bi bi-seed text-success"></i>
                            </div>
                          )}
                          <div>
                            <div className="fw-semibold">{product.productName}</div>
                            <small className="text-muted">
                              {product.description?.substring(0, 30)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{product.farmer?.name || "N/A"}</div>
                          <small className="text-muted">{product.farmer?.farmName || ""}</small>
                        </div>
                      </td>
                      <td>
                        {getCategoryBadge(product.category)}
                      </td>
                      <td>
                        <div className="fw-bold text-success">₹{product.price?.toLocaleString()}</div>
                        <small className="text-muted">per {product.unit || "kg"}</small>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteProduct(product._id, product.productName)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-center text-muted small">
        <i className="bi bi-info-circle me-1"></i>
        Showing {filteredProducts.length} farm products
      </div>
    </div>
  );
}