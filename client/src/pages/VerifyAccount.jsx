import React, { useState } from "react";
import "./login.css";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function VerifyAccount() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-account", { otp });

      if (res.data.success) {
        alert("Email verified successfully");
        navigate("/home");
      } else {
        alert(res.data.message || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying account");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await api.post("/auth/send-verify-otp");
      alert(res.data.message || (res.data.success ? "OTP sent" : "Failed"));
    } catch (e) {
      alert("Failed to resend OTP");
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
          <h2 className="welcome-title">Verify Account</h2>
          <p className="welcome-subtitle">Enter the OTP sent to your email</p>
        </div>

        <form className="login-form" onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">OTP</label>
            <div className="input-wrapper">
              <input
                className="form-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                required
              />
            </div>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            <span>{loading ? "Verifying..." : "Verify"}</span>
          </button>
        </form>

        <div className="signup-section" style={{ display: "flex", justifyContent: "space-between" }}>
          <button type="button" className="social-button google" onClick={resendOtp}>
            Resend OTP
          </button>

          <Link to="/login" className="signup-link">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}


