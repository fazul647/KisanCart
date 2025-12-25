import { useEffect, useState } from "react";
import API from "../api/axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/admin/users")
      .then(res => setUsers(res.data.users || []))
      .catch(() => alert("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.includes(searchTerm)
  );

  const getRoleBadge = (role) => {
    const roleMap = {
      farmer: { class: "success", icon: "🌾", label: "Farmer" },
      admin: { class: "danger", icon: "👑", label: "Admin" },
      user: { class: "info", icon: "👤", label: "Customer" },
      buyer: { class: "primary", icon: "🛒", label: "Buyer" }
    };
    const roleObj = roleMap[role] || { class: "secondary", icon: "👤", label: role };
    return (
      <span className={`badge bg-${roleObj.class} bg-opacity-10 text-${roleObj.class} border border-${roleObj.class} border-opacity-25`}>
        {roleObj.icon} {roleObj.label}
      </span>
    );
  };

  const getStatusBadge = (user) => {
    // Assuming user might have an active field or you can add one
    const isActive = user.isActive !== false; // Default to true if not specified
    return (
      <span className={`badge ${isActive ? 'bg-success' : 'bg-secondary'}`}>
        {isActive ? '✓ Active' : '✗ Inactive'}
      </span>
    );
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
      <div className="text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-muted">Loading farm community...</p>
      </div>
    </div>
  );

  const farmers = users.filter(u => u.role === 'farmer');
  const customers = users.filter(u => u.role === 'user' || u.role === 'buyer');
  const admins = users.filter(u => u.role === 'admin');

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-success mb-1">👥 Farm Community</h2>
          <p className="text-muted">Manage farmers, customers, and administrators</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Search by name, email, role, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-success bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-success">Total Users</h6>
                  <h3 className="mb-0">{users.length}</h3>
                </div>
                <i className="bi bi-people text-success fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-warning bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-warning">Farmers</h6>
                  <h3 className="mb-0">{farmers.length}</h3>
                </div>
                <i className="bi bi-person-badge text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm bg-info bg-opacity-10">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-info">Customers</h6>
                  <h3 className="mb-0">{customers.length}</h3>
                </div>
                <i className="bi bi-person text-info fs-4"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Community Members ({filteredUsers.length})</h5>
          </div>
        </div>
        <div className="card-body p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people text-muted fs-1"></i>
              <p className="mt-2 text-muted">No users found</p>
              {searchTerm && (
                <button 
                  className="btn btn-outline-success mt-2"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="border-0 ps-4">User</th>
                    <th className="border-0">Contact</th>
                    <th className="border-0">Role</th>
                    <th className="border-0">Status</th>
                    <th className="border-0 pe-4">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                               style={{width: "40px", height: "40px"}}>
                            {user.role === 'farmer' ? (
                              <i className="bi bi-tree text-success"></i>
                            ) : user.role === 'admin' ? (
                              <i className="bi bi-shield text-danger"></i>
                            ) : (
                              <i className="bi bi-person text-primary"></i>
                            )}
                          </div>
                          <div>
                            <div className="fw-semibold">{user.name}</div>
                            <small className="text-muted">Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">{user.email}</div>
                          <small className="text-muted">{user.phone || "No phone"}</small>
                        </div>
                      </td>
                      <td>
                        {getRoleBadge(user.role)}
                        {user.farmName && user.role === 'farmer' && (
                          <div className="mt-1 small text-muted">
                            <i className="bi bi-house-door me-1"></i>
                            {user.farmName}
                          </div>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(user)}
                      </td>
                      <td className="pe-4">
                        <button 
                          className="btn btn-sm btn-outline-success"
                          onClick={() => alert(`View details for ${user.name}`)}
                        >
                          <i className="bi bi-eye me-1"></i> View
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
        Showing {filteredUsers.length} of {users.length} community members
      </div>
    </div>
  );
}