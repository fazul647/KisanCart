import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/Farmer.css";

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  useEffect(() => {
    loadFarmers();
  }, []);

  async function loadFarmers() {
    try {
      const res = await API.get("/farmers");
      setFarmers(res.data.farmers || []);
    } catch (err) {
      setError("Failed to load farmers");
    } finally {
      setLoading(false);
    }
  }

  const states = [
    ...new Set(farmers.map(f => f.address?.state).filter(Boolean))
  ];

  const filteredFarmers = farmers.filter(f => {
    const nameMatch = f.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const stateMatch =
      !stateFilter || f.address?.state === stateFilter;

    return nameMatch && stateMatch;
  });

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">🌾 Explore Farmers</h2>
        <p className="text-muted">
          Connect directly with farmers and buy fresh produce
        </p>
      </div>

      {/* FILTER */}
      <div className="card p-3 shadow-sm mb-4">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search farmer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={stateFilter}
              onChange={e => setStateFilter(e.target.value)}
            >
              <option value="">📍 All States</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center">
          <div className="spinner-border text-success"></div>
          <p className="mt-2">Loading farmers...</p>
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-danger text-center">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && filteredFarmers.length === 0 && (
        <p className="text-muted text-center">No farmers found</p>
      )}

      {/* FARMERS GRID */}
      <div className="row g-4">
        {filteredFarmers.map(farmer => (
          <div className="col-md-4" key={farmer._id}>
            <div className="card border-0 shadow-sm h-100 farmer-card">

              <div className="card-body text-center">

                {/* 🔥 PROFILE IMAGE */}
                <div className="mb-3">
                  {farmer.profilePic ? (
                    <img
                      src={`http://localhost:5000${farmer.profilePic}`}
                      alt="profile"
                      className="farmer-img"
                    />
                  ) : (
                    <div className="avatar-circle">
                      {farmer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <h5 className="fw-bold">{farmer.name}</h5>

                {/* Location */}
                <p className="text-muted mb-2">
                  📍 {farmer.address?.city || "—"},{" "}
                  {farmer.address?.state || ""}
                </p>

                {/* Product Count */}
                <span className="badge bg-success mb-3">
                  🌱 {farmer.productCount} Products
                </span>

                {/* Button */}
                <div>
                  <button className="btn btn-outline-success btn-sm">
                    View Profile
                  </button>
                </div>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}