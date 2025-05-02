"use client";
import React from "react";
import "../../Styles/register.css";
const Register = () => {
    return (
        <div className="register-page">
            <h1 className="register-title">Author Register form</h1>
            <form>
                <div className="form-register">
                    <label htmlFor="username">Authorname:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div className="form-register">
                    <label htmlFor="author-code">Author Code:</label>
                    <input type="text" id="author-code" name="author-code" required />
                </div>
                <div className="form-register">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div className="form-register">
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div className="form-register">
                    <label htmlFor="date-of-birth">Date of Birth:</label>
                    <input type="date" id="date-of-birth" name="date-of-birth" required />
                </div>
                <div className="form-register">
                    <label htmlFor="role">Role:</label>
                    <select id="role" name="role" required>
                        <option value="author">Author</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-register">
                    <label htmlFor="joining-date">Joining Date:</label>
                    <input type="date" id="joining-date" name="joining-date" required />
                </div>
                <div className="form-register">
                    <label htmlFor="mobile-number">Mobile Number:</label>
                    <input type="tel" id="mobile-number" name="mobile-number" required />
                </div>
                <div className="form-register">
                    <label htmlFor="address">Address:</label>
                    <input type="text" id="address" name="address" required />
                </div>
                <div className="form-register">
                    <label htmlFor="department">Department:</label>
                    <input type="text" id="department" name="department" required />
                </div>
                <div className="form-register">
                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" name="gender" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    </div>
                    <div className="form-register">
                        <label htmlFor="marital-status">Marital Status:</label>
                        <select id="marital-status" name="marital-status" required>
                            <option value="">Select Marital Status</option>
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                    </div>
                <div className="form-register full-width">
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    )
}
export default Register;