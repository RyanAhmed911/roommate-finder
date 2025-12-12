import React, { useEffect, useState } from "react";
import "./login.css";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/user/data");
        if (!res.data.success) {
          navigate("/login");
          return;
        }
        setMe(res.data.userData);
      } catch (e) {
        navigate("/login");
      }
    };
    load();
  }, [navigate]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      navigate("/login");
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
          <h2 className="welcome-title">Home</h2>
          <p className="welcome-subtitle">You are logged in</p>
        </div>

        <div style={{ marginTop: 10, lineHeight: 1.8 }}>
          <div><b>Name:</b> {me?.name || "..."}</div>
          <div><b>Email:</b> {me?.email || "..."}</div>
          <div><b>Verified:</b> {me?.isAccountVerified ? "Yes ✅" : "No ❌"}</div>
        </div>

        {!me?.isAccountVerified && (
          <button className="login-button" style={{ marginTop: 18 }} onClick={() => navigate("/verify-account")}>
            <span>Verify Account</span>
          </button>
        )}

        <button className="login-button" style={{ marginTop: 14 }} onClick={logout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

