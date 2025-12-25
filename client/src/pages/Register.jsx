// client/src/pages/Register.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
    address: { street: "", city: "", state: "", zipcode: "" },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(path, value) {
    if (path.startsWith("address.")) {
      const key = path.split(".")[1];
      setForm((f) => ({ ...f, address: { ...f.address, [key]: value } }));
    } else {
      setForm((f) => ({ ...f, [path]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      const { token, user } = res.data;
      localStorage.setItem("kisan_token", token);
      localStorage.setItem("kisan_user", JSON.stringify(user));
      nav("/");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kc-auth-page">
      <div className="kc-auth-card shadow-sm">

        <div className="text-center mb-3">
          <div className="kc-leaf">🌿</div>
          <h3 className="fw-bold">Create your account</h3>
          <p className="text-muted">Join KisanCart today</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="px-2">

          <div className="mb-3">
            <label className="form-label kc-label">Full Name</label>
            <input
              className="form-control kc-input"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label kc-label">Email</label>
            <input
              className="form-control kc-input"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label kc-label">Phone</label>
            <input
              className="form-control kc-input"
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>

          <div className="row">
            <div className="mb-3 col-md-6">
              <label className="form-label kc-label">Password</label>
              <input
                className="form-control kc-input"
                type="password"
                required
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </div>

            <div className="mb-3 col-md-6">
              <label className="form-label kc-label">Confirm Password</label>
              <input
                className="form-control kc-input"
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label kc-label">Role</label>
            <select
              className="form-select kc-input"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <fieldset className="border p-3 rounded">
            <legend className="float-none w-auto px-2 fs-6">Address (Optional)</legend>

            <div className="row">
              <div className="mb-3 col-md-6">
                <input
                  className="form-control kc-input"
                  placeholder="Street"
                  value={form.address.street}
                  onChange={(e) => update("address.street", e.target.value)}
                />
              </div>

              <div className="mb-3 col-md-6">
                <input
                  className="form-control kc-input"
                  placeholder="City"
                  value={form.address.city}
                  onChange={(e) => update("address.city", e.target.value)}
                />
              </div>

              <div className="mb-3 col-md-6">
                <input
                  className="form-control kc-input"
                  placeholder="State"
                  value={form.address.state}
                  onChange={(e) => update("address.state", e.target.value)}
                />
              </div>

              <div className="mb-3 col-md-6">
                <input
                  className="form-control kc-input"
                  placeholder="Zipcode"
                  value={form.address.zipcode}
                  onChange={(e) => update("address.zipcode", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className="btn btn-success w-100 mt-3 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-success fw-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
