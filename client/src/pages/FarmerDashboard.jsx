import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../index.css";

export default function FarmerDashboard() {
  const user = JSON.parse(localStorage.getItem("kisan_user"));

  const [stats, setStats] = useState({
    products: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    revenue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState(null);


  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 📊 FETCH ALL DASHBOARD DATA
  async function fetchDashboardData() {
    setLoading(true);
    setError("");
    
    try {
      // Use Promise.all to fetch data in parallel for better performance
      const [productsRes, dashboardRes, messagesRes] = await Promise.all([
        API.get("/crops/mine"),
        API.get("/orders/farmer/dashboard"),
        API.get("/messages/unread-count").catch(() => ({ data: { unread: 0 } })) // Graceful fallback
      ]);

      setStats({
        products: productsRes.data.products?.length || 0,
        pendingOrders: dashboardRes.data.placedOrders || 0,
        unreadMessages: messagesRes.data.unread || 0,
        revenue: dashboardRes.data.totalRevenue || 0,
      });

      setRecentOrders(dashboardRes.data.recentOrders || []);
      
    } catch (err) {
      console.error("Dashboard load failed:", err);
      setError("Failed to load dashboard data. Please try again.");
      
      // Fallback to local storage data if available
      const localStats = JSON.parse(localStorage.getItem("kisan_dashboard_stats"));
      if (localStats) {
        setStats(localStats);
      }
    } finally {
      setLoading(false);
    }
  }

  // Refresh dashboard
  const handleRefresh = () => {
    fetchDashboardData();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-fluid kc-dashboard-page" style={{ padding: "30px 40px" }}>
        <div className="d-flex align-items-center justify-content-center" style={{ height: "60vh" }}>
          <div className="text-center">
            <div className="spinner-border text-success" role="status" style={{ width: "3rem", height: "3rem" }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid kc-dashboard-page" style={{ padding: "30px 40px" }}>
      {/* HEADER */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <div className="d-flex align-items-center gap-3">
            <h2 className="kc-page-title mb-0">Farmer Dashboard</h2>
            <button 
              onClick={handleRefresh}
              className="btn btn-outline-secondary btn-sm"
              title="Refresh dashboard"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
          <p className="text-muted mb-0">
            Welcome back, <strong className="text-success">{user?.name?.split(" ")[0] || "Farmer"}</strong>!
          </p>
          {user?.farmName && (
            <small className="text-muted">
              Farm: <strong>{user.farmName}</strong>
            </small>
          )}
        </div>

        <div>
          <Link to="/add-product" className="btn btn-success kc-add-btn">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Product
          </Link>
        </div>
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* STATS */}
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        <StatCard 
          title="Products" 
          value={stats.products} 
          icon="📦" 
          link="/farmer/products"
          color="primary"
          loading={loading}
        />
        <StatCard 
          title="Pending Orders" 
          value={stats.pendingOrders} 
          icon="🛒" 
          link="/farmer/orders"
          color="warning"
          loading={loading}
        />
        <StatCard 
          title="Unread Messages" 
          value={stats.unreadMessages} 
          icon="💬" 
          link="/messages"
          color="info"
          loading={loading}
          highlight={stats.unreadMessages > 0}
        />
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(stats.revenue)} 
          icon="📈" 
          color="success"
          loading={loading}
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="card kc-recent-card mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 d-flex align-items-center gap-2">
              <i className="bi bi-clock-history text-success"></i>
              Recent Orders
            </h5>
            <div>
              <Link to="/farmer/orders" className="btn btn-outline-success btn-sm">
                View All Orders
              </Link>
            </div>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x text-muted" style={{ fontSize: "3rem" }}></i>
              <p className="text-muted mt-3">No recent orders</p>
              <Link to="/add-product" className="btn btn-outline-success btn-sm">
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="small text-muted border-bottom">
                  <tr>
                    <th>Order ID</th>
                    <th>Buyer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.slice(0, 5).map((order) => (
                    <tr key={order._id}>
                      <td>
                        <code className="text-muted">#{order._id.slice(-6).toUpperCase()}</code>
                      </td>
                      <td className="fw-medium">{order.buyer?.name || "Customer"}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="fw-bold">{formatCurrency(order.totalAmount)}</td>
                      <td>
                        <span className={`badge bg-${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="text-muted small">{formatDate(order.createdAt)}</td>
                      <td>
                      <button
  className="btn btn-sm btn-outline-secondary"
  data-bs-toggle="modal"
  data-bs-target="#orderModal"
  onClick={() => setSelectedOrder(order)}
>
  View
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
      {selectedOrder && (
        <div className="modal fade" id="orderModal" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Order #{selectedOrder._id.slice(-6).toUpperCase()}
                </h5>
                <button className="btn-close" data-bs-dismiss="modal"></button>
              </div>

              <div className="modal-body">
                <p><strong>Buyer:</strong> {selectedOrder.buyer?.name}</p>
                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedOrder.totalAmount)}</p>

                <hr />

                <h6>Items</h6>
                <ul className="list-group">
                  {selectedOrder.items.map((item, i) => (
                    <li key={i} className="list-group-item d-flex justify-content-between">
                      <span>{item.product?.name}</span>
                      <span>{item.quantity} × ₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK LINKS */}
      <div className="card">
        <div className="card-body">
          <h6 className="card-title mb-3">
            <i className="bi bi-lightning-charge text-success me-2"></i>
            Quick Actions
          </h6>
          <div className="d-flex gap-3 flex-wrap">
            <Link to="/farmer/products" className="btn btn-outline-success d-flex align-items-center gap-2">
              <i className="bi bi-box-seam"></i>
              Manage Products
            </Link>
            <Link to="/farmer/orders" className="btn btn-outline-secondary d-flex align-items-center gap-2">
              <i className="bi bi-bag-check"></i>
              All Orders
            </Link>
            <Link to="/messages" className="btn btn-outline-info d-flex align-items-center gap-2">
              <i className="bi bi-chat-left-text"></i>
              Messages
              {stats.unreadMessages > 0 && (
                <span className="badge bg-danger rounded-pill">{stats.unreadMessages}</span>
              )}
            </Link>
            <Link to="/profile" className="btn btn-outline-primary d-flex align-items-center gap-2">
              <i className="bi bi-person-circle"></i>
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SMALL CARD COMPONENT */
function StatCard({ title, value, icon, link, color = "primary", loading = false, highlight = false }) {
  const colorClasses = {
    primary: "text-primary bg-primary bg-opacity-10",
    success: "text-success bg-success bg-opacity-10",
    warning: "text-warning bg-warning bg-opacity-10",
    info: "text-info bg-info bg-opacity-10"
  };

  return (
    <div className="col">
      <div className={`kc-stat-card ${highlight ? 'border-success border-2' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <div className="kc-stat-title text-muted small">{title}</div>
            <div className="kc-stat-value">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-muted" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <span className="fw-bold fs-4">{value}</span>
              )}
            </div>
          </div>
          <div className={`kc-stat-ico rounded-circle ${colorClasses[color]}`} style={{ padding: "12px" }}>
            <span className="fs-4">{icon}</span>
          </div>
        </div>
        {link && (
          <div className="kc-stat-link mt-2">
            <Link to={link} className="text-decoration-none small">
              View details <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        )}
      </div>
      
    </div>
    
  );
}

// Helper function for status badges
function getStatusColor(status) {
  const statusMap = {
    'placed': 'warning',
    'confirmed': 'info',
    'shipped': 'primary',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return statusMap[status.toLowerCase()] || 'secondary';
}

