import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../../api/ApiPoint";
import "./AddProducts.css";

const AddProducts = () => {
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
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BaseUrl}shopefi/category/show`, {
          headers: { token: adminToken },
        });
        console.log("Fetched categories:", res.data);
        setCategories(res.data.categories);
      } catch (err) {
        console.log("Category fetch error");
      }
    };

    fetchCategories();
  }, [adminToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const valid = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

    if (file && valid.includes(file.type)) {
      setFormData({ ...formData, pImage: file });
      setMessage({ text: "", type: "" });
    } else {
      setMessage({ text: "Only image files allowed", type: "error" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!Object.values(formData).every(Boolean)) {
      setMessage({ text: "All fields required!", type: "error" });
      return;
    }

    const productData = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      productData.append(key, val)
    );

    try {
      await axios.post(`${BaseUrl}shopefi/products/add`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: adminToken,
        },
      });

      setMessage({ text: "Product added successfully!", type: "success" });
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch {
      setMessage({ text: "Error adding product", type: "error" });
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h2>Add Product</h2>

        {message.text && <p className={`message ${message.type}`}>{message.text}</p>}

        <form onSubmit={handleSubmit}>
          <input name="pname" placeholder="Product Name" onChange={handleChange} className="form-control" />

          <input name="price" type="number" placeholder="Price" onChange={handleChange} className="form-control" />

          <input name="discount" type="number" placeholder="Discount" onChange={handleChange} className="form-control" />

          {/* 🔥 CATEGORY DROPDOWN */}
          <select name="category" className="form-control" onChange={handleChange}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          <textarea name="description" placeholder="Description" onChange={handleChange} className="form-control" />

          <input type="file" onChange={handleFileChange} className="form-control" />

          <button className="btn-custom btn-primary-custom">Add Product</button>

          <button type="button" className="btn-custom btn-warning-custom" onClick={() => navigate(-1)}>
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;