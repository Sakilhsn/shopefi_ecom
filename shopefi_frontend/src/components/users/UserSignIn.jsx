import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../api/ApiPoint";
import "./UserSignIn.css";

const UserSignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uemail: "",
    upass: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { uemail, upass } = formData;

    if (!uemail || !upass) {
      setMessage({ text: "All fields are required!", type: "error" });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(uemail)) {
      setMessage({ text: "Invalid email format!", type: "error" });
      return false;
    }

    if (upass.length < 6) {
      setMessage({ text: "Password must be at least 6 characters.", type: "error" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BaseUrl}shopefi/users/signin`, formData);

      if (response.status === 200) {
        const { user_id, token } = response.data;
        localStorage.setItem("user_id", user_id);
        localStorage.setItem("userToken", token);

        setMessage({ text: "Login successful! Redirecting...", type: "success" });

        setTimeout(() => {
          navigate("/users/dashboard");
          window.location.reload();
        }, 1500); // Redirect after 1.5 seconds
      } else {
        setMessage({ text: response.data.message || "Login failed!", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Invalid credentials. Please try again.", type: "error" });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2>User Sign In</h2>

        {message.text && (
          <p className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input type="email" name="uemail" className="form-control" placeholder="Email Address" value={formData.uemail} onChange={handleChange} required />

          <input type="password" name="upass" className="form-control" placeholder="Password" value={formData.upass} onChange={handleChange} required />

          <button type="submit" className="stylish-btn">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default UserSignIn;
