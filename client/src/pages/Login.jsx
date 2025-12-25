// client/src/pages/Login.jsx
import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../index.css";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      const { token, user } = res.data;
      localStorage.setItem("kisan_token", token);
      localStorage.setItem("kisan_user", JSON.stringify(user));
      nav("/");
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="kc-auth-page">
      <div className="kc-auth-card shadow-sm">
        <div className="text-center mb-3">
          <div className="kc-leaf">🌿</div>
          <h3 className="fw-bold">Sign in to your account</h3>
          <p className="text-muted">Or create a new account</p>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <form onSubmit={submit} className="px-3">
          <div className="mb-3">
            <label className="form-label">Email address</label>
           
              
              <input
                type="email"
                className="form-control kc-input border-start-0"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
           
              
              <input
                type="password"
                className="form-control kc-input border-start-0"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
           
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <Link to="/forgot" className="text-success">Forgot your password?</Link>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center mt-3 mb-1">
          <small className="text-muted">
            New here? <Link to="/register" className="text-success fw-semibold">Create account</Link>
          </small>
        </div>
      </div>
    </div>
  );
}
