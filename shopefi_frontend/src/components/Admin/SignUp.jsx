import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BaseUrl } from "../api/ApiPoint";
import "./SignUp.css";

const SignUp = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    try {
      const response = await axios.post(`${BaseUrl}shopefi/super-admin/signup`, {
        admin_email: adminEmail,
        admin_password: adminPassword,
      });

      if (response.data.message=="Signup successful") {
        setMessage({ text: "Signup successful! Redirecting...", type: "success" });
        setTimeout(() => navigate("/admin/signin"), 2000);
      } else {
        setMessage({ text: response.data.message || "Signup failed. Try again.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error signing up. Please check your details.", type: "error" });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="text-gradient">Admin Sign Up</h2>

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

          <button type="submit" className="stylish-btn">Sign Up</button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/admin/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
