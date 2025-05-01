"use client";
import React, { useState } from 'react';
import "../../Styles/register.css";
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        joiningDate: "",
        dob: "",
        mobile: "",
        address: "",
        department: "",
        gender: "",
        maritalStatus: "",
        authorCode: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("registeredUser", JSON.stringify(formData));
        router.push('/');
    };

    return (
        <div className="register-wrapper">
            <div className="register-page">
                <div className="register-panel">
                    <form className="register-form" onSubmit={handleSubmit}>
                        <h2 className='register-title'>Author Registration</h2>
                        <div className="register-form">
                            {[
                                { label: "Name", name: "name", type: "text" },
                                { label: "Email", name: "email", type: "email" },
                                { label: "Password", name: "password", type: "password" },
                                { label: "Role", name: "role", type: "text" },
                                { label: "Joining Date", name: "joiningDate", type: "date" },
                                { label: "Date of Birth", name: "dob", type: "date" },
                                { label: "Mobile Number", name: "mobile", type: "text" },
                                { label: "Address", name: "address", type: "text" },
                                { label: "Department", name: "department", type: "text" },
                                { label: "Author Code", name: "authorCode", type: "text" }
                            ].map((field) => (
                                <div className="register-group" key={field.name}>
                                    <label htmlFor={field.name}>{field.label}:</label>
                                    <input
                                        type={field.type}
                                        id={field.name}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            ))}

                            <div className="register-group">
                                <label>Gender:</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="register-group">
                                <label>Marital Status:</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>

                            <button type="submit">Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
