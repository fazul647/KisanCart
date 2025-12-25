import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "../index.css";

export default function BuyerDashboard() {
  const user = JSON.parse(localStorage.getItem("kisan_user"));

  const [stats, setStats] = useState({
    cartItems: 0,
    totalOrders: 0,
    unreadMessages: 0,
    totalSpent: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchUnreadMessages();
    fetchCartCount();
  }, []);

  /* 🛒 CART COUNT (from localStorage) */
  function fetchCartCount() {
    const cart = JSON.parse(localStorage.getItem("kisan_cart")) || [];
    setStats(prev => ({
      ...prev,
      cartItems: cart.length,
    }));
  }

  /* 🔔 UNREAD MESSAGES */
  async function fetchUnreadMessages() {
    try {
      const res = await API.get("/messages/unread-count");
      setStats(prev => ({
        ...prev,
        unreadMessages: res.data.unread,
      }));
    } catch (err) {
      console.error("Failed to fetch unread messages");
    }
  }

  /* 📊 BUYER DASHBOARD DATA */
  async function fetchDashboard() {
    try {
      const res = await API.get("/orders/buyer/dashboard");

      setStats(prev => ({
        ...prev,
        totalOrders: res.data.ordersCount,
        totalSpent: res.data.totalSpent,
      }));

      setRecentOrders(res.data.recentOrders || []);
    } catch (err) {
      console.error("Buyer dashboard load failed:", err);
    }
  }

  return (
    <div className="container-fluid kc-dashboard-page" style={{ padding: "30px 40px" }}>
      {/* HEADER */}
      <div className="d-flex align-items-start justify-content-between mb-4">
        <div>
          <h2 className="kc-page-title">Buyer Dashboard</h2>
          <p className="text-muted mb-0">
            Welcome back, <strong>{user?.name?.split(" ")[0] || "Buyer"}</strong>!
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-4">
        <StatCard title="Cart Items" value={stats.cartItems} icon="🛒" link="/cart" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="📦" link="/buyer/orders" />
        <StatCard title="Unread Messages" value={stats.unreadMessages} icon="💬" link="/messages" />
        <StatCard title="Total Spent" value={`₹${stats.totalSpent}`} icon="💰" />
      </div>

      {/* RECENT ORDERS */}
      <div className="card kc-recent-card mb-5">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Recent Orders</h5>
            <Link to="/buyer/orders" className="text-muted small">
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-muted py-5 text-center">No orders yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-borderless mb-0">
                <thead className="small text-muted">
                  <tr>
                    <th>Order ID</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o._id}>
                      <td>{o._id.slice(-6)}</td>
                      <td>{o.items.length}</td>
                      <td>₹{o.totalAmount}</td>
                      <td>
                        <span className="badge bg-secondary">{o.status}</span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="d-flex gap-3 flex-wrap">
        <Link to="/cart" className="btn btn-outline-success">Go to Cart</Link>
        <Link to="/buyer/orders" className="btn btn-outline-secondary">My Orders</Link>
        <Link to="/messages" className="btn btn-outline-secondary">Messages</Link>
        <Link to="/buyer/profile" className="btn btn-outline-secondary">Profile</Link>
      </div>
    </div>
  );
}

/* SMALL CARD (same as farmer dashboard) */
function StatCard({ title, value, icon, link }) {
  return (
    <div className="col-md-3">
      <div className="kc-stat-card">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="kc-stat-title">{title}</div>
            <div className="kc-stat-value">{value}</div>
          </div>
          <div className="kc-stat-ico">{icon}</div>
        </div>
        {link && (
          <div className="kc-stat-link">
            <Link to={link}>View</Link>
          </div>
        )}
      </div>
    </div>
  );
}
