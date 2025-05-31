"use client";
import React, { useState } from "react";
import { createEmployee } from "../../services/Api";
import "../../Styles/EmployeeRegister.css";

const EmployeeRegister = () => {
    const [formData, setFormData] = useState({
        rfidcardno: "",
        photo: "",
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
    const [uploading, setUploading] = useState(false);

    const designations = ["author", "editor", "admin", "manager"];
    const departments = ["news", "sports", "marketing", "finance"];
    const genders = ["male", "female", "other"];
    const maritalStatuses = ["single", "married", "divorced"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const uploadfile = e.target.files[0];
        if (uploadfile) {
            setUploading(uploadfile);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("submitting data:",formData);
            const result = await createEmployee(formData);
            alert("Employee created successfully!");
            console.log("Created Employee:", result);
        } catch (error) {
            alert("Error creating employee: " + error.message);
        }
    };

    return (
        <div className="employee-register-container">
            <h2 className="employee-register-title">Employee Registration</h2>
            <form onSubmit={handleSubmit} className="employee-register-form">
                <div className="employee-register-grid">

                    <div className="employee-form-group">
                        <label className="employee-form-label">RFID Card No:</label>
                        <input type="text" name="rfidcardno" value={formData.rfidcardno} onChange={handleChange} className="employee-form-input" required />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Upload Photo:</label>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="employee-form-input" />
                        {formData.photo && <img src={formData.photo} alt="Uploaded" height="60" style={{ marginTop: "10px" }} />}
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Full Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="employee-form-input" required />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Date of Birth:</label>
                        <input type="date" name="dob" value={formData.dob ? formData.dob.split("T")[0] : ""} onChange={handleChange} className="employee-form-input" />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="employee-form-input" required />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Mobile No:</label>
                        <input type="tel" name="mobileno" value={formData.mobileno} onChange={handleChange} className="employee-form-input" />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Employee Code:</label>
                        <input type="text" name="employeecode" value={formData.employeecode} onChange={handleChange} className="employee-form-input" />
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Designation:</label>
                        <select name="designation" value={formData.designation} onChange={handleChange} className="employee-form-input" required>
                            <option value="">--Select Designation--</option>
                            {designations.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Department:</label>
                        <select name="department" value={formData.department} onChange={handleChange} className="employee-form-input" required>
                            <option value="">--Select Department--</option>
                            {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Gender:</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="employee-form-input" required>
                            <option value="">--Select Gender--</option>
                            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Marital Status:</label>
                        <select name="maritalstatus" value={formData.maritalstatus} onChange={handleChange} className="employee-form-input">
                            <option value="">--Select Marital Status--</option>
                            {maritalStatuses.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="employee-form-group">
                        <label className="employee-form-label">Joining Date:</label>
                        <input type="date" name="joiningdate" value={formData.joiningdate ? formData.joiningdate.split("T")[0] : ""} onChange={handleChange} className="employee-form-input" />
                    </div>

                    <div className="employee-form-group full-width">
                        <label className="employee-form-label">Address:</label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="employee-form-input" rows="3" />
                    </div>
                </div>

                <div className="employee-form-actions">
                    <button type="submit" className="employee-submit-button">Register Employee</button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeRegister; 