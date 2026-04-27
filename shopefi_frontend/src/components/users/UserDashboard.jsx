import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import userImage from "../../assets/userImage.jpg";
import "./UserDashboard.css";

const UserDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const Ids = localStorage.getItem("user_id");
  const getIds = Ids ? Ids.split(",") : [];
  const userId = getIds[0];

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/users/signin");
    } else {
      fetchUserData();
    }
  }, [token, userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/users/show/${userId}`, {
        headers: { token: token },
      });
      setUser(response.data.user_info);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const response = await axios.delete(`${BaseUrl}shopefi/users/delete/${userId}`, {
          headers: { token: token },
        });
        // alert(response.data.message);
        console.log(response.data);
        if (response.data.message == "User data successfully deleted") {
          localStorage.clear();
          navigate("/");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user data");
      }
    }
  };

  const handleUpdateProfile = () => {
    navigate(`/users/dashboard/update/${userId}`);
  };

  if (loading) {
    return <p className="loading">Loading user data...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <img src={userImage} alt="User" className="user-img" style={{height:"250px",width:"250px",borderRadius:"50%"}} />
        <h2>Welcome, {user.user_name}</h2>
      </div>
      <div className="user-info">
        <p><strong>Email:</strong> {user.user_email}</p>
        <p><strong>Age:</strong> {user.user_age}</p>
        <p><strong>Gender:</strong> {user.user_gender}</p>
        <p><strong>Phone:</strong> {user.user_phone}</p>
      </div>
      <div className="button-group">
        <button className="update-btn" onClick={handleUpdateProfile}>Update Profile</button><hr />
        <button className="delete-btn" onClick={handleDeleteAccount}>Delete Profile</button><hr />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default UserDashboard;