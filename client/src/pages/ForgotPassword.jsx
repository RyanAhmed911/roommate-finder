import React, { useState } from "react";
import "./login.css";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/send-reset-otp", { email });

      if (res.data.success) {
        alert("Reset OTP sent to email");
        navigate("/reset-password", { state: { email } });
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending reset OTP");
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
          <h2 className="welcome-title">Forgot Password</h2>
          <p className="welcome-subtitle">We’ll send an OTP to reset your password</p>
        </div>

        <form className="login-form" onSubmit={handleSendOtp}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <button className="login-button" type="submit">
            <span>Send OTP</span>
          </button>
        </form>

        <div className="signup-section">
          <p><Link to="/login" className="signup-link">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
}


