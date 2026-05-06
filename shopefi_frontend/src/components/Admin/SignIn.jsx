import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../api/ApiPoint";
import "./SignIn.css";

const SignIn = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${BaseUrl}shopefi/super-admin/signin`, {
        admin_email: adminEmail,
        admin_password: adminPassword,
      });

      if (response.status === 200) {
        console.log("Admin Sign In Response:", response.data);
        const { user_id,token } = response.data;
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("adminToken", token); // Save token to localStorage

        setMessage({ text: "Login successful! Redirecting...", type: "success" });
        setTimeout(() => {
          navigate("/admin/dashboard");
          window.location.reload();
        }, 1500);
      } else {
        setMessage({ text: "Login failed. Please check your credentials.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Invalid email or password. Try again.", type: "error" });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="text-gradient">Admin Sign In</h2>

        {message.text && (
          <p className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />

          <button type="submit" className="stylish-btn">Sign In</button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/admin/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
