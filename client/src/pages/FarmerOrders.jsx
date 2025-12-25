import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  /* ================= LOAD FARMER ORDERS ================= */
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/orders/farmer");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UPDATE ORDER STATUS ================= */
  async function updateStatus(orderId, status) {
    if (!confirm(`Are you sure you want to ${status} this order?`)) {
      return;
    }

    setUpdatingOrderId(orderId);
    try {
      await API.patch(`/orders/${orderId}/status`, { status });
      setOrders(prev =>
        prev.map(o =>
          o._id === orderId ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  /* ================= COUNTS ================= */
  const counts = {
    all: orders.length,
    placed: orders.filter(o => o.status === "placed").length,
    accepted: orders.filter(o => o.status === "accepted").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  /* ================= FILTER ================= */
  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(o => o.status === filter);

  /* ================= FORMAT FUNCTIONS ================= */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      placed: "warning",
      accepted: "success",
      shipped: "info",
      delivered: "primary",
      cancelled: "danger"
    };
    return colors[status] || "secondary";
  };

  const getStatusIcon = (status) => {
    const icons = {
      placed: "⏳",
      accepted: "✅",
      shipped: "🚚",
      delivered: "📦",
      cancelled: "❌"
    };
    return icons[status] || "";
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Orders</h2>
          <p className="text-muted">Manage and track all your orders</p>
        </div>
        <button 
          onClick={fetchOrders} 
          className="btn btn-outline-secondary"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* ================= ERROR ALERT ================= */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4">
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* ================= LOADING STATE ================= */}
      {loading && orders.length === 0 && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
      )}

      {/* ================= FILTER BUTTONS ================= */}
      <div className="card mb-4">
        <div className="card-body">
          <h6 className="card-title mb-3">Filter Orders</h6>
          <div className="d-flex gap-2 flex-wrap">
            <FilterBtn 
              label="All" 
              count={counts.all} 
              active={filter==="all"} 
              onClick={() => setFilter("all")} 
              color="secondary"
            />
            <FilterBtn 
              label="Pending" 
              count={counts.placed} 
              active={filter==="placed"} 
              onClick={() => setFilter("placed")} 
              color="warning"
            />
            <FilterBtn 
              label="Accepted" 
              count={counts.accepted} 
              active={filter==="accepted"} 
              onClick={() => setFilter("accepted")} 
              color="success"
            />
            <FilterBtn 
              label="Shipped" 
              count={counts.shipped} 
              active={filter==="shipped"} 
              onClick={() => setFilter("shipped")} 
              color="info"
            />
            <FilterBtn 
              label="Delivered" 
              count={counts.delivered} 
              active={filter==="delivered"} 
              onClick={() => setFilter("delivered")} 
              color="primary"
            />
            <FilterBtn 
              label="Cancelled" 
              count={counts.cancelled} 
              active={filter==="cancelled"} 
              onClick={() => setFilter("cancelled")} 
              color="danger"
            />
          </div>
        </div>
      </div>

      {/* ================= ORDER COUNT SUMMARY ================= */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Showing</h6>
              <h4 className="card-title">
                {filteredOrders.length} of {orders.length} orders
              </h4>
              <p className="card-text small">
                {filter !== "all" && `Filtered by: ${filter}`}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card bg-light">
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">Total Revenue</h6>
              <h4 className="card-title text-success">
                {formatCurrency(
                  filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
                )}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* ================= NO ORDERS ================= */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">📭</div>
          <h4 className="mb-3">No orders found</h4>
          <p className="text-muted mb-4">
            {filter === "all" 
              ? "You haven't received any orders yet." 
              : `No orders with status "${filter}".`}
          </p>
          {filter !== "all" && (
            <button 
              className="btn btn-outline-success"
              onClick={() => setFilter("all")}
            >
              View All Orders
            </button>
          )}
        </div>
      )}

      {/* ================= ORDERS LIST ================= */}
      <div className="row">
        {filteredOrders.map(order => (
          <div key={order._id} className="col-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-0 pb-0">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="mb-1">Order #{order._id.slice(-8).toUpperCase()}</h5>
                    <p className="text-muted small mb-0">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span className={`badge bg-${getStatusColor(order.status)} px-3 py-2`}>
                    {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="card-body">
                {/* BUYER INFO */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Customer Details</h6>
                    <p className="mb-1">
                      <strong>👤 {order.buyer?.name || "Customer"}</strong>
                    </p>
                    {order.buyer?.phone && (
                      <p className="mb-1 small">
                        <i className="bi bi-telephone me-2"></i>
                        {order.buyer.phone}
                      </p>
                    )}
                    {order.buyer?.email && (
                      <p className="mb-0 small">
                        <i className="bi bi-envelope me-2"></i>
                        {order.buyer.email}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6 className="text-muted mb-2">Shipping Address</h6>
                    <p className="mb-0 small">
                      {order.shippingAddress?.address || "Address not specified"}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="table-responsive mb-3">
                  <table className="table table-sm">
                    <thead className="table-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="d-flex align-items-center">
                              {item.product?.productImages?.[0] && (
                                <img 
                                  src={item.product.productImages[0]} 
                                  alt={item.product.productName}
                                  className="rounded me-2"
                                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                              )}
                              <div>
                                <div className="fw-medium">{item.product?.productName}</div>
                                <small className="text-muted">{item.product?.category}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            {item.quantity} {item.product?.unit}
                          </td>
                          <td className="text-end">
                            {formatCurrency(item.pricePerUnit)}/{item.product?.unit}
                          </td>
                          <td className="text-end fw-bold">
                            {formatCurrency(item.quantity * item.pricePerUnit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* TOTAL AND ACTIONS */}
                <div className="d-flex justify-content-between align-items-center border-top pt-3">
                  <div>
                    <h5 className="mb-0">Total: {formatCurrency(order.totalAmount)}</h5>
                    <small className="text-muted">Inclusive of all charges</small>
                  </div>
                  
                  <div className="d-flex gap-2">
                    {order.status === "placed" && (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => updateStatus(order._id, "accepted")}
                          disabled={updatingOrderId === order._id}
                        >
                          {updatingOrderId === order._id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Processing...
                            </>
                          ) : (
                            "Accept Order"
                          )}
                        </button>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => updateStatus(order._id, "cancelled")}
                          disabled={updatingOrderId === order._id}
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {order.status === "accepted" && (
                      <button
                        className="btn btn-warning"
                        onClick={() => updateStatus(order._id, "shipped")}
                        disabled={updatingOrderId === order._id}
                      >
                        {updatingOrderId === order._id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          "Mark as Shipped"
                        )}
                      </button>
                    )}

                    {order.status === "shipped" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => updateStatus(order._id, "delivered")}
                        disabled={updatingOrderId === order._id}
                      >
                        {updatingOrderId === order._id ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          "Mark as Delivered"
                        )}
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <span className="text-success fw-bold">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        Order Delivered
                      </span>
                    )}

                    {order.status === "cancelled" && (
                      <span className="text-danger fw-bold">
                        <i className="bi bi-x-circle-fill me-2"></i>
                        Order Cancelled
                      </span>
                    )}

                    <button className="btn btn-outline-secondary">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= FILTER BUTTON ================= */
function FilterBtn({ label, count, active, onClick, color = "success" }) {
  return (
    <button
      className={`btn ${active ? `btn-${color}` : `btn-outline-${color}`} px-3 py-2`}
      onClick={onClick}
    >
      <span className="d-block fw-medium">{label}</span>
      <small className={`${active ? 'text-white' : `text-${color}`} opacity-75`}>
        {count} {count === 1 ? 'order' : 'orders'}
      </small>
    </button>
  );
}