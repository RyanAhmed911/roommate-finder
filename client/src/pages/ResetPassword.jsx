import React, { useState } from "react";
import "./login.css";
import api from "../api";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/reset-password", { email, otp, newPassword });

      if (res.data.success) {
        alert("Password reset successful. Please login.");
        navigate("/login");
      } else {
        alert(res.data.message || "Reset failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="login-card">
        <div className="welcome-section">
          <h2 className="welcome-title">Reset Password</h2>
          <p className="welcome-subtitle">Enter OTP and set a new password</p>
        </div>

        <form className="login-form" onSubmit={handleReset}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">OTP</label>
            <div className="input-wrapper">
              <input className="form-input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="input-wrapper">
              <input className="form-input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>
          </div>

          <button className="login-button" type="submit">
            <span>Reset Password</span>
          </button>
        </form>

        <div className="signup-section">
          <p><Link to="/login" className="signup-link">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}


