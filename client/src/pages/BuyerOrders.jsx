import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Message modal state
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  /* ============ LOAD BUYER ORDERS ============ */
  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/orders/buyer");
      const ordersList = res.data.orders || [];
      setOrders(ordersList);
      setFilteredOrders(ordersList);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Filter orders based on status and search
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Apply search filter
    const term = searchTerm.toLowerCase();
    if (term) {
      result = result.filter(order =>
        order.farmer?.name?.toLowerCase().includes(term) ||
        order.items.some(item => 
          item.product?.productName?.toLowerCase().includes(term)
        ) ||
        order._id.toLowerCase().includes(term)
      );
    }
    
    setFilteredOrders(result);
  }, [statusFilter, searchTerm, orders]);

  /* ============ SEND MESSAGE ============ */
  async function sendMessage() {
    if (!msgText.trim()) {
      setError("Please type a message");
      return;
    }

    setSendingMessage(true);
    try {
      await API.post("/messages/send", {
        receiverId: activeOrder.farmer._id,
        productId: activeOrder.items[0].product._id,
        text: msgText.trim(),
      });

      // Show success
      const event = new CustomEvent('showToast', {
        detail: {
          message: 'Message sent to farmer',
          type: 'success'
        }
      });
      window.dispatchEvent(event);
      
      setMsgText("");
      setShowMsg(false);
      setActiveOrder(null);
    } catch (err) {
      console.error(err);
      setError("Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
  }

  /* ============ STATUS CONFIG ============ */
  const statusConfig = {
    placed: { label: "Placed", color: "warning", icon: "⏳" },
    accepted: { label: "Accepted", color: "success", icon: "✅" },
    shipped: { label: "Shipped", color: "info", icon: "🚚" },
    delivered: { label: "Delivered", color: "primary", icon: "📦" },
    cancelled: { label: "Cancelled", color: "danger", icon: "❌" }
  };

  /* ============ FORMAT FUNCTIONS ============ */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
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

  /* ============ ORDER STATS ============ */
  const orderStats = {
    all: orders.length,
    placed: orders.filter(o => o.status === "placed").length,
    accepted: orders.filter(o => o.status === "accepted").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  return (
    <div className="container mt-4 mb-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Orders</h2>
          <p className="text-muted">Track and manage your purchases</p>
        </div>
        <Link to="/products" className="btn btn-outline-success">
          <i className="bi bi-plus-circle me-2"></i>
          Continue Shopping
        </Link>
      </div>

      {/* ERROR ALERT */}
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

      {/* FILTERS */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search orders by farmer, product, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status ({orderStats.all})</option>
                <option value="placed">Placed ({orderStats.placed})</option>
                <option value="accepted">Accepted ({orderStats.accepted})</option>
                <option value="shipped">Shipped ({orderStats.shipped})</option>
                <option value="delivered">Delivered ({orderStats.delivered})</option>
                <option value="cancelled">Cancelled ({orderStats.cancelled})</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{orders.length}</h3>
              <small className="text-muted">Total Orders</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">
                {formatCurrency(orders.reduce((sum, o) => sum + o.totalAmount, 0))}
              </h3>
              <small className="text-muted">Total Spent</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">
                {orders.filter(o => o.status === "delivered").length}
              </h3>
              <small className="text-muted">Delivered</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info bg-opacity-10 border-0">
            <div className="card-body text-center py-3">
              <h3 className="fw-bold mb-0">{filteredOrders.length}</h3>
              <small className="text-muted">Showing</small>
            </div>
          </div>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your orders...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredOrders.length === 0 && (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">📭</div>
          <h4 className="mb-3">No orders found</h4>
          <p className="text-muted mb-4">
            {orders.length === 0 
              ? "You haven't placed any orders yet." 
              : "Try adjusting your search or filters."}
          </p>
          {orders.length === 0 ? (
            <Link to="/products" className="btn btn-success">
              <i className="bi bi-shop me-2"></i>
              Start Shopping
            </Link>
          ) : (
            <button 
              className="btn btn-outline-success"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ORDERS LIST */}
      <div className="row">
        {filteredOrders.map(order => {
          const status = statusConfig[order.status] || statusConfig.placed;
          
          return (
            <div key={order._id} className="col-12 mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 pb-0">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h5>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-calendar me-1"></i>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <span className={`badge bg-${status.color} px-3 py-2`}>
                      {status.icon} {status.label}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="row">
                    {/* FARMER INFO */}
                    <div className="col-md-4 mb-3">
                      <h6 className="text-muted mb-2">Farmer Details</h6>
                      <div className="d-flex align-items-center mb-2">
                        <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                             style={{ width: "50px", height: "50px" }}>
                          <span className="text-success fs-5">👨‍🌾</span>
                        </div>
                        <div>
                          <p className="fw-bold mb-0">{order.farmer?.name}</p>
                          <small className="text-muted">Verified Farmer</small>
                        </div>
                      </div>
                      <button
                        className="btn btn-outline-success btn-sm w-100"
                        onClick={() => {
                          setActiveOrder(order);
                          setShowMsg(true);
                        }}
                      >
                        <i className="bi bi-chat-left-text me-2"></i>
                        Message Farmer
                      </button>
                    </div>

                    {/* ORDER ITEMS */}
                    <div className="col-md-5 mb-3">
                      <h6 className="text-muted mb-2">Order Items</h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th className="text-center">Qty</th>
                              <th className="text-end">Price</th>
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
                                <td className="text-center align-middle">
                                  {item.quantity} {item.product?.unit}
                                </td>
                                <td className="text-end align-middle">
                                  {formatCurrency(item.pricePerUnit * item.quantity)}
                                  <br />
                                  <small className="text-muted">
                                    {formatCurrency(item.pricePerUnit)} each
                                  </small>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="col-md-3 mb-3">
                      <h6 className="text-muted mb-2">Order Summary</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Delivery:</span>
                        <span className="text-success">FREE</span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Total:</span>
                        <span className="fw-bold fs-5 text-success">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ACTIONS */}
                  <div className="border-top pt-3 mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          Order ID: <code>{order._id}</code>
                        </small>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============ MESSAGE MODAL ============ */}
      {showMsg && activeOrder && (
        <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-chat-left-text text-success me-2"></i>
                  Message {activeOrder.farmer.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowMsg(false)}
                  disabled={sendingMessage}
                />
              </div>

              <div className="modal-body">
                {/* ORDER CONTEXT */}
                <div className="alert alert-light mb-3">
                  <div className="d-flex align-items-center">
                    {activeOrder.items[0].product?.productImages?.[0] && (
                      <img 
                        src={activeOrder.items[0].product.productImages[0]} 
                        alt={activeOrder.items[0].product.productName}
                        className="rounded me-3"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    )}
                    <div>
                      <p className="mb-1">
                        Regarding your order of{" "}
                        <strong>{activeOrder.items[0].product.productName}</strong>
                      </p>
                      <p className="text-muted small mb-0">
                        Order #{activeOrder._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* MESSAGE TEXTAREA */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Your Message</label>
                  <textarea
                    className="form-control"
                    rows={5}
                    placeholder="Type your message to the farmer..."
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    disabled={sendingMessage}
                    style={{ resize: "none" }}
                  />
                  <small className="text-muted">
                    Your message will be sent via the KisanCart messaging system
                  </small>
                </div>
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowMsg(false)}
                  disabled={sendingMessage}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={sendMessage}
                  disabled={sendingMessage || !msgText.trim()}
                >
                  {sendingMessage ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}