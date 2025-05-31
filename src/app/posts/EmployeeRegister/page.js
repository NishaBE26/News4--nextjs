"use client";
import React, { useState } from "react";
import { createEmployee } from "../../services/Api";
import "../../Styles/EmployeeRegister.css"; 

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    rfidcardno: "",
    photo: null, 
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

  const designations = ["author", "editor", "admin", "manager"];
  const departments = ["news", "sports", "marketing", "finance"];
  const genders = ["male", "female", "other"];
  const maritalStatuses = ["single", "married", "divorced"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photo" && value instanceof File) {
        submissionData.append(key, value);
      } else if (key !== "photo" && value) {
        submissionData.append(key, value);
      }
    });

    try {
      const result = await createEmployee(submissionData); 
      alert("Employee created successfully!");
      console.log("Created Employee:", result);
    } catch (error) {
      alert("Error creating employee: " + error.message); 
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="employee-registration-wrapper"> 
      <h2 className="registration-form-heading">Employee Registration</h2> 
      <form onSubmit={handleSubmit} className="employee-registration-form" encType="multipart/form-data"> 
        <div className="registration-form-grid"> 
          {/* RFID Card No */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">RFID Card No:</label> 
            <input type="text" name="rfidcardno" value={formData.rfidcardno} onChange={handleChange} className="registration-form-input" required /> 
          </div>

          {/* Photo File */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Upload Photo:</label> 
            <input type="file" name="photo" onChange={handleFileChange} className="registration-form-input" accept="image/*" /> 
          </div>

          {/* Name */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Full Name:</label> 
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="registration-form-input" required /> 
          </div>

          {/* DOB */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Date of Birth:</label> 
            <input type="date" name="dob" value={formData.dob ? formData.dob.split("T")[0] : ""} onChange={handleChange} className="registration-form-input" /> 
          </div>

          {/* Email */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Email:</label> 
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="registration-form-input" required /> 
          </div>

          {/* Mobile No */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Mobile No:</label> 
            <input type="tel" name="mobileno" value={formData.mobileno} onChange={handleChange} className="registration-form-input" /> 
          </div>

          {/* Employee Code */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Employee Code:</label> 
            <input type="text" name="employeecode" value={formData.employeecode} onChange={handleChange} className="registration-form-input" /> 
          </div>

          {/* Designation */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Designation:</label> 
            <select name="designation" value={formData.designation} onChange={handleChange} className="registration-form-input" required> 
              <option value="">--Select Designation--</option>
              {designations.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Department:</label> 
            <select name="department" value={formData.department} onChange={handleChange} className="registration-form-input" required> 
              <option value="">--Select Department--</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Gender:</label> 
            <select name="gender" value={formData.gender} onChange={handleChange} className="registration-form-input" required> 
              <option value="">--Select Gender--</option>
              {genders.map((g) => (
                <option key={g} value={g}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Marital Status */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Marital Status:</label> 
            <select name="maritalstatus" value={formData.maritalstatus} onChange={handleChange} className="registration-form-input"> 
              <option value="">--Select Marital Status--</option>
              {maritalStatuses.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Joining Date */}
          <div className="registration-form-group"> 
            <label className="registration-form-label">Joining Date:</label> 
            <input type="date" name="joiningdate" value={formData.joiningdate ? formData.joiningdate.split("T")[0] : ""} onChange={handleChange} className="registration-form-input" /> 
          </div>

          {/* Address */}
          <div className="registration-form-group registration-full-width"> 
            <label className="registration-form-label">Address:</label> 
            <textarea name="address" value={formData.address} onChange={handleChange} className="registration-form-input" rows="3" /> 
          </div>
        </div>

        <div className="registration-form-actions"> 
          <button type="submit" className="register-submit-button"> 
            Register Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeRegister;