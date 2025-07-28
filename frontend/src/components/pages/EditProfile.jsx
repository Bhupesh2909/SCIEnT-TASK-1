import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

const EditProfilePage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData({ name: res.data.name, email: res.data.email });
    };
    fetchData();
  }, [userId, token]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:5000/api/users/${userId}`,
      userData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input name="name" value={userData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input name="email" value={userData.email} onChange={handleChange} required />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfilePage;
