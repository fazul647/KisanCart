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

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>Admin – Orders</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Farmer</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o._id}>
              <td>{o._id.slice(-6)}</td>
              <td>{o.buyer?.name}</td>
              <td>{o.farmer?.name}</td>
              <td>₹{o.totalAmount}</td>
              <td className="text-capitalize">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
