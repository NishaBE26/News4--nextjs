"use client";
import React, { useState, useEffect } from "react";
import { createEmployee } from "../../services/Api";
import "../../Styles/EmployeeRegister.css";

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    rfidcardno: "",
    name: "",
    dob: "",
    email: "",
    mobileno: "",
    employeecode: "",
    designation: "",
    department: "",
    gender: "",
    maritalstatus: "",
    joiningdate: "",
    address: "",
  });

  const [uploading, setUploading] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!uploading) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(uploading);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submitted data:", formData)
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
      });
      form.append("file", uploading);

      const result = await createEmployee(form);    // multipart form data
      // application/json
      console.log("api response:", result);
      if (result.success) {
        alert("Employee created successfully!");
        setFormData({
          rfidcardno: "",
          name: "",
          dob: "",
          email: "",
          mobileno: "",
          employeecode: "",
          designation: "",
          department: "",
          gender: "",
          maritalstatus: "",
          joiningdate: "",
          address: "",
        });
        setUploading(null);
      }
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  return (
    <div className="employee-register-container">
      <h2>Employee Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="rfidcardno" placeholder="RFID Card No" value={formData.rfidcardno} onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={handleFileChange} required />

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="tel" name="mobileno" placeholder="Mobile No" value={formData.mobileno} onChange={handleChange} />

        <input type="text" name="employeecode" placeholder="Employee Code" value={formData.employeecode} onChange={handleChange} />
        <input type="date" name="joiningdate" value={formData.joiningdate} onChange={handleChange} />

        <select name="designation" value={formData.designation} onChange={handleChange} required>
          <option value="">Select Designation</option>
          <option value="author">Author</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <select name="department" value={formData.department} onChange={handleChange} required>
          <option value="">Select Department</option>
          <option value="news">News</option>
          <option value="sports">Sports</option>
        </select>

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <select name="maritalstatus" value={formData.maritalstatus} onChange={handleChange}>
          <option value="">Select Marital Status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
        </select>

        {previewUrl && (
          <div className="full-width">
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <textarea
          className="full-width"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />

        <button type="submit" className="full-width">Submit</button>
      </form>
    </div>
  );
};

export default EmployeeRegister;
