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
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    pname: "",
    price: "",
    discount: "",
    category: "",
    description: "",
    pImage: null,
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}shopefi/category/show`,
          {
            headers: { token: adminToken },
          }
        );

        setCategories(res.data.categories || []);
      } catch (error) {
        console.log("Category error:", error);
      }
    };

    fetchCategories();
  }, [adminToken]);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${BaseUrl}shopefi/products/show/${pid}`,
          {
            headers: { token: adminToken },
          }
        );

        const p = res.data;

        console.log("Fetched product:", p);

        const categoryId =
          typeof p.product_category === "object"
            ? p.product_category?._id
            : p.product_category;

        setFormData({
          pname: p.product_name || "",
          price: p.product_price || "",
          discount: p.product_discount || "",
          category: categoryId || "",
          description: p.product_description || "",
          pImage: null,
        });

        // Existing image
        setExistingImage(p.product_image || "");

        // Initially show existing image as preview
        if (p.product_image) {
          const imageUrl = `${BaseUrl}${
            p.product_image.startsWith("/") ? "" : "/"
          }${p.product_image}`;

          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.log("Product error:", error);

        setMessage({
          text: "Error loading product",
          type: "error",
        });
      }
    };

    fetchProduct();
  }, [pid, adminToken]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // IMAGE CHANGE + PREVIEW
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        pImage: file,
      });

      // Create preview URL for selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("pname", formData.pname);
    fd.append("price", formData.price);
    fd.append("discount", formData.discount);
    fd.append("category", formData.category);
    fd.append("description", formData.description);

    // Only send new image if selected
    if (formData.pImage) {
      fd.append("pImage", formData.pImage);
    }

    try {
      await axios.put(
        `${BaseUrl}shopefi/products/update/${pid}`,
        fd,
        {
          headers: {
            token: adminToken,
          },
        }
      );

      setMessage({
        text: "Updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      console.log("Update error:", error);

      setMessage({
        text: "Update failed",
        type: "error",
      });
    }
  };

  return (
    <div className="update-product-container">
      <div className="update-product-box">

        <h2>Update Product</h2>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            name="pname"
            value={formData.pname}
            onChange={handleChange}
            className="form-control"
            placeholder="Product Name"
          />

          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="form-control"
            placeholder="Price"
          />

          <input
            name="discount"
            value={formData.discount}
            onChange={handleChange}
            className="form-control"
            placeholder="Discount"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat._id}
              >
                {cat.category_name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            placeholder="Description"
          />

          {/* IMAGE PREVIEW */}
          {imagePreview && (
            <div className="existing-image">
              <p>
                {formData.pImage
                  ? "New Image Preview:"
                  : "Current Image:"}
              </p>

              <img
                src={imagePreview}
                alt={formData.pname}
                className="product-preview"
              />
            </div>
          )}

          {/* NEW IMAGE */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="form-control"
          />

          {formData.pImage && (
            <p className="selected-image-name">
              New image selected: {formData.pImage.name}
            </p>
          )}

          <button
            type="submit"
            className="btn-custom btn-primary-custom"
          >
            Update Product
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

export default UpdateProduct;