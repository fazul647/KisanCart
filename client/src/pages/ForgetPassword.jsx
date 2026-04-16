import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    try {
      await API.post("/auth/forgot-password", {
        email,
        newPassword,
      });

      alert("Password updated successfully ✅");
      nav("/login");
    } catch (err) {
      alert("Error resetting password ❌");
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-lg col-md-4 mx-auto">
        <h4 className="text-center mb-3">🔐 Reset Password</h4>

        <input
          className="form-control mb-3"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}