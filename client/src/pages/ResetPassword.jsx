import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      alert("Password updated successfully ✅");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Error resetting password ❌");
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-lg col-md-4 mx-auto">
        <h4 className="text-center mb-3">🔐 Set New Password</h4>

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Enter new password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleReset}>
          Update Password
        </button>
      </div>
    </div>
  );
}