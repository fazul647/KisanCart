import React, { useEffect, useState } from "react";
import API from "../api/axios";

export default function Profile() {
  const stored = JSON.parse(localStorage.getItem("kisan_user") || "null");

  const [loading, setLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [error, setError] = useState(null);

  // ONLY personal details (common for buyer & farmer)
  const [form, setForm] = useState({
    name: stored?.name || "",
    email: stored?.email || "",
    phone: stored?.phone || "",
    address: {
      street: stored?.address?.street || "",
      city: stored?.address?.city || "",
      state: stored?.address?.state || "",
      zipcode: stored?.address?.zipcode || "",
    },
  });

  /* LOAD LATEST PROFILE (OPTIONAL BUT GOOD) */
  useEffect(() => {
    API.get("/auth/me")
      .then(res => {
        const u = res.data.user;
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          address: {
            street: u.address?.street || "",
            city: u.address?.city || "",
            state: u.address?.state || "",
            zipcode: u.address?.zipcode || "",
          },
        });
      })
      .catch(() => {})
  }, []);

  /* HANDLE CHANGE */
  function handleChange(path, value) {
    if (path.startsWith("address.")) {
      const k = path.split(".")[1];
      setForm(f => ({ ...f, address: { ...f.address, [k]: value } }));
    } else {
      setForm(f => ({ ...f, [path]: value }));
    }
  }

  /* SAVE PROFILE */
  async function saveProfile(e) {
    e.preventDefault();
    setSaveMsg(null);
    setError(null);
    setLoading(true);

    try {
      const res = await API.put("/auth/me", {
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      // update localStorage
      if (res.data?.user) {
        localStorage.setItem("kisan_user", JSON.stringify(res.data.user));
      }

      setSaveMsg("Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "28px 20px", maxWidth: 700 }}>
      <div className="mb-4">
        <h2 className="kc-page-title">My Profile</h2>
        <p className="text-muted mb-0">
          Update your personal information
        </p>
      </div>

      {saveMsg && <div className="alert alert-success">{saveMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-4">
        <form onSubmit={saveProfile}>

          {/* NAME */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              className="form-control form-control-lg"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* EMAIL (READ ONLY) */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control form-control-lg"
              value={form.email}
              readOnly
            />
            <div className="form-text text-muted">
              Email cannot be changed
            </div>
          </div>

          {/* PHONE */}
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              className="form-control form-control-lg"
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
              required
            />
          </div>

          {/* ADDRESS */}
          <div className="mb-3">
            <label className="form-label">Street</label>
            <input
              className="form-control"
              value={form.address.street}
              onChange={e => handleChange("address.street", e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col-6 mb-3">
              <label className="form-label">City</label>
              <input
                className="form-control"
                value={form.address.city}
                onChange={e => handleChange("address.city", e.target.value)}
              />
            </div>

            <div className="col-6 mb-3">
              <label className="form-label">State</label>
              <input
                className="form-control"
                value={form.address.state}
                onChange={e => handleChange("address.state", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Zipcode</label>
            <input
              className="form-control"
              value={form.address.zipcode}
              onChange={e => handleChange("address.zipcode", e.target.value)}
            />
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                const s = JSON.parse(localStorage.getItem("kisan_user") || "null");
                if (s) {
                  setForm({
                    name: s.name || "",
                    email: s.email || "",
                    phone: s.phone || "",
                    address: {
                      street: s.address?.street || "",
                      city: s.address?.city || "",
                      state: s.address?.state || "",
                      zipcode: s.address?.zipcode || "",
                    },
                  });
                }
              }}
            >
              Reset
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
