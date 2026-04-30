import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BaseUrl } from "../../../api/ApiPoint";
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    discount: "",
    category: "",
    description: "",
    pImage: null,
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  // ✅ FETCH CATEGORIES
  useEffect(() => {
    axios.get(`${BaseUrl}shopefi/category/show`, {
      headers: { token: adminToken },
    })
      .then(res => setCategories(res.data.categories))
      .catch(() => console.log("Category error"));
  }, [adminToken]);

  // ✅ FETCH PRODUCT
  useEffect(() => {
    axios.get(`${BaseUrl}shopefi/products/show/${pid}`, {
      headers: { token: adminToken },
    }).then(res => {
      const p = res.data;
      console.log("Fetched product:", p);
      setFormData({
        pname: p.product_name,
        price: p.product_price,
        discount: p.product_discount,
        category: p.product_category, // 👈 already ObjectId
        description: p.product_description,
        pImage: null,
      });
    }).catch(() => {
      setMessage({ text: "Error loading product", type: "error" });
    });
  }, [pid]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, pImage: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([k, v]) => {
      if (v) fd.append(k, v);
    });

    try {
      await axios.put(`${BaseUrl}shopefi/products/update/${pid}`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: adminToken,
        },
      });

      setMessage({ text: "Updated successfully!", type: "success" });
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      setMessage({ text: "Update failed", type: "error" });
    }
  };

  return (
    <div className="update-product-container">
      <div className="update-product-box">
        <h2>Update Product</h2>

        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

        <form onSubmit={handleSubmit}>
          <input name="pname" value={formData.pname} onChange={handleChange} className="form-control" />

          <input name="price" value={formData.price} onChange={handleChange} className="form-control" />

          <input name="discount" value={formData.discount} onChange={handleChange} className="form-control" />

          {/* 🔥 DROPDOWN */}
          <select name="category" value={formData.category} onChange={handleChange} className="form-control">
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" />

          <input type="file" onChange={handleFileChange} className="form-control" />

          <button className="btn-custom btn-primary-custom">Update Product</button>

          <button type="button" className="btn-custom btn-warning-custom" onClick={() => navigate(-1)}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;