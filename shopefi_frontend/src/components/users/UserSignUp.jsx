import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../api/ApiPoint";
import "./UserSignUp.css";

const UserSignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    uname: "",
    uage: "",
    ugender: "",
    uemail: "",
    uphone: "",
    upass: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { uname, uage, ugender, uemail, uphone, upass } = formData;

    if (!uname || !uage || !ugender || !uemail || !uphone || !upass) {
      setMessage({ text: "All fields are required!", type: "error" });
      return false;
    }

    if (isNaN(uage) || uage < 18 || uage > 100) {
      setMessage({ text: "Age must be between 18 and 100.", type: "error" });
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(uemail)) {
      setMessage({ text: "Invalid email format!", type: "error" });
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/; // Ensures valid 10-digit phone number starting with 6-9
    if (!phoneRegex.test(uphone)) {
      setMessage({ text: "Invalid phone number! It must be 10 digits and start with 6-9.", type: "error" });
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
      const response = await axios.post(`${BaseUrl}shopefi/users/signup`, formData);

      if (response.data.message=="Signup successful") {
        setMessage({ text: "Signup successful! Redirecting to Sign-in...", type: "success" });

        setTimeout(() => {
          navigate("/users/signin");
        }, 1500); // Redirect after 1.5 seconds
      } else {
        setMessage({ text: response.data.message || "Signup failed!", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error during signup. Please try again.", type: "error" });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>User Sign Up</h2>

        {message.text && (
          <p className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input type="text" name="uname" className="form-control" placeholder="Full Name" value={formData.uname} onChange={handleChange} required />

          <input type="number" name="uage" className="form-control" placeholder="Age" value={formData.uage} onChange={handleChange} required />

          <select name="ugender" className="form-control" value={formData.ugender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>

          <input type="email" name="uemail" className="form-control" placeholder="Email Address" value={formData.uemail} onChange={handleChange} required />

          <input type="tel" name="uphone" className="form-control" placeholder="Phone Number" value={formData.uphone} onChange={handleChange} required />

          <input type="password" name="upass" className="form-control" placeholder="Password" value={formData.upass} onChange={handleChange} required />

          <button type="submit" className="stylish-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
