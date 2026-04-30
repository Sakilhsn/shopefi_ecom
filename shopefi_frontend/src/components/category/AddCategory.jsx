import React, { useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import { useNavigate } from "react-router-dom";
import "./CategoryStyle.css";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setMessage({ text: "Category name is required", type: "error" });
      return;
    }

    try {
      await axios.post(
        `${BaseUrl}shopefi/category/add`,
        { category_name: categoryName },
        { headers: { token: adminToken } }
      );

      setMessage({ text: "Category added successfully!", type: "success" });

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Error adding category",
        type: "error",
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Add Category</h2>

        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control"
            placeholder="Enter category name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button type="submit" className="btn-custom btn-primary-custom">
            Add Category
          </button>

          <button
            type="button"
            className="btn-custom btn-warning-custom"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;