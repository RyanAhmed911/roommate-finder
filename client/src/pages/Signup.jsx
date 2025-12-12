import React, { useState } from "react";
import "./login.css";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password });

      if (!res.data.success) {
        alert(res.data.message || "Signup failed");
        return;
      }

      // ✅ send OTP (requires token cookie, already set by register)
      const otpRes = await api.post("/auth/send-verify-otp");
      if (!otpRes.data.success) {
        alert(otpRes.data.message || "Failed to send OTP");
        return;
      }

      navigate("/verify-account");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while signing up");
    } finally {
      setLoading(false);
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
          <h2 className="welcome-title">Create Account</h2>
          <p className="welcome-subtitle">Sign up to get started</p>
        </div>

        <form className="login-form" onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <div className="input-wrapper">
              <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            <span>{loading ? "Creating..." : "Sign Up"}</span>
          </button>
        </form>

        <div className="signup-section">
          <p>
            Already have an account? <Link to="/login" className="signup-link">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
