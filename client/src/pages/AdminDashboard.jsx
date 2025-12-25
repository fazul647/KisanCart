import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      <ul className="list-group mt-3">
        <li className="list-group-item">
          <Link to="/admin/products">Manage Products</Link>
        </li>
        <li><Link to="/admin/users" className="btn btn-outline-success">
  View Users
</Link></li>
<li><Link to="/admin/orders" className="btn btn-outline-success">
  View Orders
</Link></li>
      </ul>
    </div>
  );
}
