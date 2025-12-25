import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0" style={{borderTop: "5px solid #28a745"}}>
        <div className="card-header bg-success text-white py-3">
          <h2 className="h4 mb-0">🌱 Farmer Admin Panel</h2>
          <p className="mb-0 text-light opacity-75 small">Manage your farm operations</p>
        </div>
        <div className="card-body p-4 bg-light">
          <div className="list-group list-group-flush">
            <li className="list-group-item px-0 py-3 border-bottom" style={{background: "transparent"}}>
              <Link to="/admin/products" className="text-decoration-none d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: "48px", height: "48px", background: "linear-gradient(135deg, #d4edda, #c3e6cb)"}}>
                  <i className="bi bi-seed text-success fs-5"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold text-dark">Manage Farm Products</h6>
                  <small className="text-muted">Add, edit, or remove crops, vegetables, and produce</small>
                </div>
                <i className="bi bi-chevron-right text-success fs-5"></i>
              </Link>
            </li>
            
            <li className="list-group-item px-0 py-3 border-bottom" style={{background: "transparent"}}>
              <Link to="/admin/users" className="text-decoration-none d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: "48px", height: "48px", background: "linear-gradient(135deg, #d4edda, #c3e6cb)"}}>
                  <i className="bi bi-person-badge text-success fs-5"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold text-dark">Manage Farmers & Customers</h6>
                  <small className="text-muted">View and manage farmer profiles and customer accounts</small>
                </div>
                <i className="bi bi-chevron-right text-success fs-5"></i>
              </Link>
            </li>
            
            <li className="list-group-item px-0 py-3" style={{background: "transparent"}}>
              <Link to="/admin/orders" className="text-decoration-none d-flex align-items-center">
                <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{width: "48px", height: "48px", background: "linear-gradient(135deg, #d4edda, #c3e6cb)"}}>
                  <i className="bi bi-truck text-success fs-5"></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-bold text-dark">Farm Orders & Deliveries</h6>
                  <small className="text-muted">Track harvest orders and delivery schedules</small>
                </div>
                <i className="bi bi-chevron-right text-success fs-5"></i>
              </Link>
            </li>
          </div>
          
          
        </div>
      </div>
    </div>
  );
}