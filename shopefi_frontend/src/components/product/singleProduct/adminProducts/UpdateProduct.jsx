import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BaseUrl } from "../../../api/ApiPoint";
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const { pid } = useParams();
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BaseUrl}shopefi/products/show/${pid}`, {
          headers: { token: adminToken },
        });

        if (response.data) {
          setFormData({
            pname: response.data.product_name,
            price: response.data.product_price,
            discount: response.data.product_discount,
            category: response.data.product_category,
            description: response.data.product_description,
            pImage: null, // Image won't be prefetched
          });
        }
      } catch (error) {
        setMessage({ text: "Error fetching product details.", type: "error" });
      }
    };

    fetchProduct();
  }, [pid, adminToken]);

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

    if (!formData.pname || !formData.price || !formData.discount || !formData.category || !formData.description) {
      setMessage({ text: "All fields are required!", type: "error" });
      return;
    }

    const productData = new FormData();
    productData.append("pname", formData.pname);
    productData.append("price", formData.price);
    productData.append("discount", formData.discount);
    productData.append("category", formData.category);
    productData.append("description", formData.description);
    if (formData.pImage) {
      productData.append("pImage", formData.pImage);
    }

    try {
      const response = await axios.put(`${BaseUrl}shopefi/products/update/${pid}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: adminToken,
        },
      });

      if (response.status === 200) {
        setMessage({ text: "Product updated successfully! Redirecting...", type: "success" });
        setTimeout(() => navigate("/admin/dashboard"), 2000);
      } else {
        setMessage({ text: "Failed to update product.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error updating product. Please try again.", type: "error" });
    }
  };

  return (
    <div className="update-product-container">
      <div className="update-product-box">
        <h2>Update Product</h2>

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

          <input type="file" name="pImage" className="form-control-file" accept="image/*" onChange={handleFileChange} />

          <button type="submit" className="stylish-btn">Update Product</button>
        </form>

        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};

export default UpdateProduct;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useParams } from "react-router-dom";
// import { BaseUrl } from "../../../api/ApiPoint";
// import "./UpdateProduct.css";

// const UpdateProduct = () => {
//   const { pid } = useParams();
//   const navigate = useNavigate();
//   const adminToken = localStorage.getItem("adminToken");

//   const [formData, setFormData] = useState({
//     pname: "",
//     price: "",
//     discount: "",
//     category: "",
//     description: "",
//     pImage: null,
//   });

//   const [message, setMessage] = useState({ text: "", type: "" });

//   // Fetch product details
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(`${BaseUrl}shopefi/products/show/${pid}`, {
//           headers: { token: adminToken },
//         });

//         if (response.data) {
//           setFormData({
//             pname: response.data.product_name,
//             price: response.data.product_price,
//             discount: response.data.product_discount,
//             category: response.data.product_category,
//             description: response.data.product_description,
//             pImage: null, // Image won't be prefetched
//           });
//         }
//       } catch (error) {
//         setMessage({ text: "Error fetching product details.", type: "error" });
//       }
//     };

//     fetchProduct();
//   }, [pid, adminToken]);

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validExtensions = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
//       if (validExtensions.includes(file.type)) {
//         setFormData({ ...formData, pImage: file });
//         setMessage({ text: "", type: "" });
//       } else {
//         setMessage({ text: "Only JPG, PNG, JPEG, and GIF images are allowed.", type: "error" });
//       }
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.pname || !formData.price || !formData.discount || !formData.category || !formData.description) {
//       setMessage({ text: "All fields are required!", type: "error" });
//       return;
//     }

//     const productData = new FormData();
//     productData.append("pname", formData.pname);
//     productData.append("price", formData.price);
//     productData.append("discount", formData.discount);
//     productData.append("category", formData.category);
//     productData.append("description", formData.description);
//     if (formData.pImage) {
//       productData.append("pImage", formData.pImage);
//     }

//     try {
//       const response = await axios.put(`${BaseUrl}shopefi/products/update/${pid}`, productData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           token: adminToken,
//         },
//       });

//       if (response.status === 200) {
//         setMessage({ text: "Product updated successfully! Redirecting...", type: "success" });
//         setTimeout(() => navigate("/admin/dashboard"), 2000);
//       } else {
//         setMessage({ text: "Failed to update product.", type: "error" });
//       }
//     } catch (error) {
//       setMessage({ text: "Error updating product. Please try again.", type: "error" });
//     }
//   };

//   return (
//     <div className="update-product-container">
//       <div className="update-product-box">
//         <h2>Update Product</h2>

//         {message.text && (
//           <p className={`message ${message.type === "success" ? "success-message" : "error-message"}`}>
//             {message.text}
//           </p>
//         )}

//         <form onSubmit={handleSubmit} encType="multipart/form-data">
//           <input type="text" name="pname" className="form-control" placeholder="Product Name" value={formData.pname} onChange={handleChange} required />

//           <input type="number" name="price" className="form-control" placeholder="Price" value={formData.price} onChange={handleChange} required />

//           <input type="number" name="discount" className="form-control" placeholder="Discount (%)" value={formData.discount} onChange={handleChange} required />

//           <input type="text" name="category" className="form-control" placeholder="Category" value={formData.category} onChange={handleChange} required />

//           <textarea name="description" className="form-control" placeholder="Description" value={formData.description} onChange={handleChange} required />

//           <input type="file" name="pImage" className="form-control-file" accept="image/*" onChange={handleFileChange} />

//           <button type="submit" className="stylish-btn">Update Product</button>
//         </form>

//         <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
//       </div>
//     </div>
//   );
// };

// export default UpdateProduct;
