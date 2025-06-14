"use client";

import React, { useEffect, useState } from "react";
import { getEmployeeById, updateEmployeeById } from "../../services/Api";
import "../../Styles/Profile.css";

export default function Profile () {
  const [loggedInEmployeeId, setLoggedInEmployeeId] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.employeeId) {
      setLoggedInEmployeeId(user.employeeId);
    }
  }, []);

  useEffect(() => {
    if (!loggedInEmployeeId) return;

    (async () => {
      const data = await getEmployeeById(loggedInEmployeeId);
      setEmployee(data);
      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.mobileno || "");
      setAddress(data.address || "");
      setProfilePicPreview(data.photo || null);
    })();
  }, [loggedInEmployeeId]);
  const onProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("name", name);
    updatedData.append("email", email);
    updatedData.append("mobileno", phone);
    updatedData.append("address", address);
    if (profilePic) updatedData.append("file", profilePic);

    await updateEmployeeById(loggedInEmployeeId, updatedData);
    setEditMode(false);
    const refreshed = await getEmployeeById(loggedInEmployeeId);
    setEmployee(refreshed);
    setProfilePicPreview(refreshed.photo || null);
  };

  return (
    <div className="container">
      <div className="profileHeader">
        {profilePicPreview ? (
          <img src={profilePicPreview} alt="Profile" className="profileImageHeader" />
        ) : (
          <div className="profileImagePlaceholderHeader">
            {employee?.name?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <h2 className="profileTitle">My Profile</h2>
      </div>

      {!editMode ? (
        <div className="profileView">
          <div className="profileSection">
            <h2 className="sectionTitle">Personal Information</h2>
            <div className="infoGrid">
              <div className="infoGroup"><label>Name:</label><span>{employee?.name || "N/A"}</span></div>
              <div className="infoGroup"><label>Email:</label><span>{employee?.email || "N/A"}</span></div>
              <div className="infoGroup"><label>Phone:</label><span>{employee?.mobileno || "N/A"}</span></div>
              <div className="infoGroup"><label>Address:</label><span>{employee?.address || "N/A"}</span></div>
              <div className="infoGroup"><label>DOB:</label><span>{employee?.dob ? new Date(employee.dob).toLocaleDateString() : "N/A"}</span></div>
              <div className="infoGroup"><label>Gender:</label><span>{employee?.gender || "N/A"}</span></div>
              <div className="infoGroup"><label>Marital Status:</label><span>{employee?.maritalstatus || "N/A"}</span></div>
            </div>
          </div>

          <div className="profileSection">
            <h2 className="sectionTitle">Employment Details</h2>
            <div className="infoGrid">
              <div className="infoGroup"><label>Role:</label><span>{employee?.designation || "N/A"}</span></div>
              <div className="infoGroup"><label>Department:</label><span>{employee?.department || "N/A"}</span></div>
              <div className="infoGroup"><label>RFID Card No:</label><span>{employee?.rfidcardno || "N/A"}</span></div>
              <div className="infoGroup"><label>Employee Code:</label><span>{employee?.employeecode || "N/A"}</span></div>
              <div className="infoGroup"><label>Joining Date:</label><span>{employee?.joiningdate ? new Date(employee.joiningdate).toLocaleDateString() : "N/A"}</span></div>
            </div>
          </div>
          <button className="button" onClick={() => setEditMode(true)} type="button">Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleProfileUpdate} className="form">
          <div className="formGroup"><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} required /></div>
          <div className="formGroup"><label>Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="formGroup"><label>Phone</label><input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="formGroup"><label>Address</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} /></div>
          <div className="formGroup">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={onProfilePicChange} />
            {profilePicPreview && <img src={profilePicPreview} alt="Preview" className="profilePreview" />}
          </div>
          <div className="buttonGroup">
            <button type="submit" className="button">Save Changes</button>
            <button type="button" className="button cancelButton" onClick={() => setEditMode(false)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

