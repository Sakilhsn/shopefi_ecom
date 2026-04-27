import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BaseUrl } from "../../../api/ApiPoint";
import "./AddProducts.css";

const AddProducts = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    discount: "",
    category: "",
    description: "",
    pImage: null,
  });

  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validExtensions = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      if (validExtensions.includes(file.type)) {
        setFormData({ ...formData, pImage: file });
        setMessage({ text: "", type: "" });
      } else {
        setMessage({ text: "Only JPG, PNG, JPEG, and GIF images are allowed.", type: "error" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!formData.pname || !formData.price || !formData.discount || !formData.category || !formData.description || !formData.pImage) {
      setMessage({ text: "All fields are required!", type: "error" });
      return;
    }

    const productData = new FormData();
    productData.append("pname", formData.pname);
    productData.append("price", formData.price);
    productData.append("discount", formData.discount);
    productData.append("category", formData.category);
    productData.append("description", formData.description);
    productData.append("pImage", formData.pImage);

    try {
      const response = await axios.post(`${BaseUrl}shopefi/products/add`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: adminToken,
        },
      });

      if (response.status === 201) {
        setMessage({ text: "Product added successfully! Redirecting...", type: "success" });

        // Redirect after 2 seconds
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } else {
        setMessage({ text: response.data.message || "Failed to add product", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error adding product. Please try again.", type: "error" });
    }
  };

  return (
    <div className="add-product-container">
      <div className="add-product-box">
        <h2>Add Product</h2>

        {message.text && (
          <p className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="pname" className="form-control" placeholder="Product Name" value={formData.pname} onChange={handleChange} required />

          <input type="number" name="price" className="form-control" placeholder="Price" value={formData.price} onChange={handleChange} required />

          <input type="number" name="discount" className="form-control" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} required />

          <input type="text" name="category" className="form-control" placeholder="Category" value={formData.category} onChange={handleChange} required />

          <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required />

          <input type="file" name="pImage" className="form-control-file" accept="image/*" onChange={handleFileChange} required />

          <button type="submit" className="stylish-btn">Add Product</button><hr />
          <button className="btn btn-outline btn-warning" onClick={()=>{navigate(-1)}}>Back</button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
