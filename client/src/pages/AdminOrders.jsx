import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/orders")
      .then(res => setOrders(res.data.orders || []))
      .catch(() => alert("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: "warning", label: "🕐 Pending" },
      confirmed: { class: "info", label: "✓ Confirmed" },
      shipped: { class: "primary", label: "🚚 Shipped" },
      delivered: { class: "success", label: "✅ Delivered" },
      cancelled: { class: "danger", label: "❌ Cancelled" }
    };
    const statusObj = statusMap[status] || { class: "secondary", label: status };
    return <span className={`badge bg-${statusObj.class}`}>{statusObj.label}</span>;
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading farm orders...</p>
      </div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success mb-1">🌾 Farm Orders</h2>
          <p className="text-muted">Manage and track all farm produce orders</p>
        </div>
        
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-success">Total Orders</h6>
                  <h3 className="mb-0">{orders.length}</h3>
                </div>
                <i className="bi bi-basket text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-info">Pending</h6>
                  <h3 className="mb-0">{orders.filter(o => o.status === 'pending').length}</h3>
                </div>
                <i className="bi bi-clock text-info fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-primary">Shipped</h6>
                  <h3 className="mb-0">{orders.filter(o => o.status === 'shipped').length}</h3>
                </div>
                <i className="bi bi-truck text-primary fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-success">Delivered</h6>
                  <h3 className="mb-0">{orders.filter(o => o.status === 'delivered').length}</h3>
                </div>
                <i className="bi bi-check-circle text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Recent Farm Orders</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="border-0 ps-4">Order ID</th>
                  <th className="border-0">Buyer</th>
                  <th className="border-0">Farmer</th>
                  <th className="border-0">Total Amount</th>
                  <th className="border-0">Status</th>
                  <th className="border-0 text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <i className="bi bi-basket text-muted fs-1"></i>
                      <p className="mt-2 text-muted">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td className="ps-4 fw-semibold">
                        <div className="d-flex align-items-center">
                          <div className="me-2">
                            <i className="bi bi-receipt text-success"></i>
                          </div>
                          <span>ORD{order._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{order.buyer?.name || "N/A"}</div>
                          <small className="text-muted">{order.buyer?.email || ""}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{order.farmer?.name || "N/A"}</div>
                          <small className="text-muted">{order.farmer?.farmName || ""}</small>
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold text-success">₹{order.totalAmount?.toLocaleString()}</div>
                        <small className="text-muted">{order.items?.length || 0} items</small>
                      </td>
                      <td>
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="text-end pe-4">
                        <button 
                          className="btn btn-sm btn-outline-success me-2"
                          onClick={() => alert(`View details for order ${order._id}`)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => alert(`Update status for order ${order._id}`)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-center text-muted small">
        <i className="bi bi-info-circle me-1"></i>
        Showing {orders.length} farm orders. Last updated: Today
      </div>
    </div>
  );
}