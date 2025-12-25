import React, { useEffect, useState } from "react";
import API from "../api/axios";

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
      console.error(err);
      setError("Failed to load farmers");
    } finally {
      setLoading(false);
    }
  }

  // unique states
  const states = [
    ...new Set(farmers.map(f => f.address?.state).filter(Boolean))
  ];

  // filter logic
  const filteredFarmers = farmers.filter(f => {
    const nameMatch = f.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const stateMatch =
      !stateFilter || f.address?.state === stateFilter;

    return nameMatch && stateMatch;
  });

  return (
    <div className="container mt-4">

      {/* PAGE HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold">Meet Our Farmers</h2>
        <p className="text-muted">
          Discover farmers directly selling fresh produce on KisanCart
        </p>
      </div>

      {/* FILTERS */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search farmer by name"
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
            <option value="">All States</option>
            {states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-muted">Loading farmers...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-danger">{error}</p>
      )}

      {/* EMPTY */}
      {!loading && filteredFarmers.length === 0 && (
        <p className="text-muted">No farmers found.</p>
      )}

      {/* FARMERS GRID */}
      <div className="row g-4">
        {filteredFarmers.map(farmer => (
          <div className="col-md-4" key={farmer._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">

                <h5 className="fw-bold mb-1">
                  {farmer.name}
                </h5>

                <p className="text-muted mb-2">
                  {farmer.address?.city || "—"},
                  {" "}
                  {farmer.address?.state || ""}
                </p>

                <p className="mb-0">
                  <strong>Products Listed:</strong>{" "}
                  {farmer.productCount}
                </p>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
