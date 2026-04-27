import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../api/ApiPoint";
import "./UpdateUser.css";

const UpdateUser = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const userId = localStorage.getItem("user_id")?.split(",")[0];

  const [user, setUser] = useState({
    uname: "",
    uage: "",
    ugender: "",
    uemail: "",
    uphone: "",
    upass: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token || !userId || userId !== uid) {
      navigate("/users/signin");
    } else {
      fetchUserData();
    }
  }, [token, userId, uid]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${BaseUrl}shopefi/users/show/${uid}`, {
        headers: { token: token },
      });

      if (response.data.user_info) {
        const { user_name, user_age, user_gender, user_email, user_phone } =
          response.data.user_info;
        setUser({
          uname: user_name,
          uage: user_age,
          ugender: user_gender,
          uemail: user_email,
          uphone: user_phone,
          upass: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user details.");
    }
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.uname || !user.uage || !user.ugender || !user.uemail || !user.uphone || !user.upass) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.put(`${BaseUrl}shopefi/users/update/${uid}`, user, {
        headers: { token: token },
      });

      if (response.status === 200) {
        setSuccess("User successfully updated!");
        setTimeout(() => navigate(-1), 2000); // Redirect after 2s
      }
    } catch (error) {
      setError("Error updating user. Please try again.");
    }
  };

  return (
    <div className="update-user-container">
      <h2>Update Profile</h2>
      {error && <p className="error-msg">{error}</p>}
      {success && <p className="success-msg">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input type="text" name="uname" placeholder="Name" value={user.uname} onChange={handleInputChange} />
        <input type="number" name="uage" placeholder="Age" value={user.uage} onChange={handleInputChange} />
        
        <select name="ugender" value={user.ugender} onChange={handleInputChange}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>

        <input type="email" name="uemail" placeholder="Email" value={user.uemail} onChange={handleInputChange} />
        <input type="text" name="uphone" placeholder="Phone" value={user.uphone} onChange={handleInputChange} />
        <input type="password" name="upass" placeholder="New Password" value={user.upass} onChange={handleInputChange} />

        <button type="submit" className="update-btn">Update</button>
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
};

export default UpdateUser;
