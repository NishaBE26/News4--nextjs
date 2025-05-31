"use client";

import React, { useEffect, useState } from "react";
import {
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
} from "../../services/Api";
import "../../Styles/EmployeeDetails.css";

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.designation === "admin") {
      setIsAdmin(true);
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
    const data = await getAllEmployees();
    setEmployees(data);
  };

  const handleEditClick = (emp) => {
    setEditingEmployee(emp._id);
    setEditForm({
      name: emp.name,
      email: emp.email,
      mobileno: emp.mobileno,
      dob: emp.dob?.slice(0, 10) || "",
      gender: emp.gender,
      department: emp.department,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    await updateEmployeeById(editingEmployee, editForm);
    setEditingEmployee(null);
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      await deleteEmployeeById(id);
      fetchEmployees();
    }
  };

  if (!isAdmin) return <div className="access-denied">Access Denied</div>;

  return (
    <div className="details-container">
      <h2>All Employee Details</h2>
      <table className="details-table">
        <thead>
          <tr>
            <th>Profile</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Phone</th>
            <th>DOB</th>
            <th>Gender</th>
            <th>Joining Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp._id}>
              <td>
                {emp.photo ? (
                  <img
                    src={emp.photo}
                    alt="Profile"
                    className="profile-thumbnail"
                  />
                ) : (
                  <span className="initial">{emp.name?.charAt(0)}</span>
                )}
              </td>
              {editingEmployee === emp._id ? (
                <>
                  <td><input name="name" value={editForm.name} onChange={handleEditChange} /></td>
                  <td><input name="email" value={editForm.email} onChange={handleEditChange} /></td>
                  <td>{emp.designation}</td>
                  <td><input name="department" value={editForm.department} onChange={handleEditChange} /></td>
                  <td><input name="mobileno" value={editForm.mobileno} onChange={handleEditChange} /></td>
                  <td><input type="date" name="dob" value={editForm.dob} onChange={handleEditChange} /></td>
                  <td>
                    <select name="gender" value={editForm.gender} onChange={handleEditChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </td>
                  <td>{emp.joiningdate ? new Date(emp.joiningdate).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingEmployee(null)} className="cancel-btn">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.designation}</td>
                  <td>{emp.department}</td>
                  <td>{emp.mobileno}</td>
                  <td>{emp.dob ? new Date(emp.dob).toLocaleDateString() : "N/A"}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.joiningdate ? new Date(emp.joiningdate).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button onClick={() => handleEditClick(emp)}>Edit</button>
                    <button onClick={() => handleDelete(emp._id)} className="delete-btn">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeDetails;
