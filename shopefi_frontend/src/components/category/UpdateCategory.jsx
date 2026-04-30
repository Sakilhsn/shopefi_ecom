import React, { useEffect, useState } from "react";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import { useNavigate, useParams } from "react-router-dom";
import "./CategoryStyle.css";

const UpdateCategory = () => {
  const { cid } = useParams();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}shopefi/category/show/${cid}`
        );

        setCategoryName(res.data.category_name);
      } catch (error) {
        setMessage({ text: "Error fetching category", type: "error" });
      }
    };

    fetchCategory();
  }, [cid]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      setMessage({ text: "Category name is required", type: "error" });
      return;
    }

    try {
      await axios.put(
        `${BaseUrl}shopefi/category/update/${cid}`,
        { category_name: categoryName },
        { headers: { token: adminToken } }
      );

      setMessage({ text: "Category updated successfully!", type: "success" });

      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (error) {
      setMessage({
        text: error?.response?.data?.message || "Update failed",
        type: "error",
      });
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Update Category</h2>

        {message.text && (
          <p className={`message ${message.type}`}>{message.text}</p>
        )}

        <form onSubmit={handleUpdate}>
          <input
            type="text"
            className="form-control"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <button type="submit" className="btn-custom btn-primary-custom">
            Update Category
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

export default UpdateCategory;