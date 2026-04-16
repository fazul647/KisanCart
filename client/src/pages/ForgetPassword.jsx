import { useState } from "react";
import API from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSendLink = async () => {
    try {
      await API.post("/auth/forgot-password", { email });

      alert("Reset link sent to your email 📧");
    } catch (err) {
      alert(err?.response?.data?.message || "Error sending email ❌");
    }
  };

  return (
    <div className="container py-5">
      <div className="card p-4 shadow-lg col-md-4 mx-auto">
        <h4 className="text-center mb-3">🔐 Forgot Password</h4>

        <input
          className="form-control mb-3"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="btn btn-success w-100" onClick={handleSendLink}>
          Send Reset Link
        </button>
      </div>
    </div>
  );
}