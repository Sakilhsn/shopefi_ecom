import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import adminImage from "../../assets/adminImage.jpg";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("adminToken");

  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Pagination state
  const [currentPageProducts, setCurrentPageProducts] = useState(1);
  const [currentPageUsers, setCurrentPageUsers] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/signin");
    } else {
      fetchProducts();
      fetchUsers();
    }
  }, [adminToken]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/products/show`);
      if(response?.data?.message==="No data found"){
setProducts([]);
      }else{
        setProducts(response.data);
      }
    } catch (error) {+
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/users/show/all`, {
        headers: { token: adminToken },
      });

      if (response.data && response.data.user_info) {
        setUsers(response.data.user_info);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${BaseUrl}shopefi/products/delete/${productId}`, {
          headers: { token: adminToken },
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/signin");
  };

  // Pagination Logic for Products
  const indexOfLastProduct = currentPageProducts * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Pagination Logic for Users
  const indexOfLastUser = currentPageUsers * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <img src={adminImage} alt="Admin" className="admin-img" />
        <h2 className="m-2 px-2">Admin Dashboard</h2>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {/* Product Management Section */}
      <div className="section">
        <h3>Manage Products</h3>
        <Link to="/admin/dashboard/add-product" className="add-btn">Add Product</Link>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>₹{product.product_price}</td>
                <td>{product.product_discount}%</td>
                <td>
                  <Link to={`/admin/dashboard/update/${product.product_id}`} className="btn btn-warning">Edit</Link>
                </td>
                <td><button onClick={() => handleDeleteProduct(product.product_id)} className="btn btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Product Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(products.length / itemsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => setCurrentPageProducts(index + 1)} className={currentPageProducts === index + 1 ? "active" : ""}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* User Management Section */}
      <div className="section">
        <h3>Registered Users</h3>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.user_name}</td>
                  <td>{user.user_email}</td>
                  <td>{user.user_age}</td>
                  <td>{user.user_gender}</td>
                  <td>{user.user_phone}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* User Pagination Controls */}
        <div className="pagination">
          {Array.from({ length: Math.ceil(users.length / itemsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => setCurrentPageUsers(index + 1)} className={currentPageUsers === index + 1 ? "active" : ""}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
