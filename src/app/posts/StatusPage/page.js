'use client';
import React, { useEffect, useState } from 'react';
import {
    getAllStatus,
    createStatus,
    updateStatusById,
    deleteStatusById,
} from '../../services/Api';
import "../../Styles/StatusPage.css";

export default function StatusPage() {
    const [statusList, setStatusList] = useState([]);
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState("");
    const [editingDescription, setEditingDescription] = useState("");

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const res = await getAllStatus();
            console.log("Load Status response:", res);
            setStatusList(res.Status);
        } catch (error) {
            console.error("Error loading status list:", error);
        }
    };

    const handleAdd = async () => {
        if (newName.trim() && newDescription.trim()) {
            const newStatus = { status: newName, description: newDescription };  // <-- key is status now
            console.log("Adding new status:", newStatus);

            try {
                const response = await createStatus(newStatus);
                console.log("Add status response:", response);
                setNewName("");
                setNewDescription("");
                loadStatus();
            } catch (error) {
                console.error("Error adding status:", error);
            }
        }
    };

    const startEditing = (id, name, description) => {
        setEditingId(id);
        setEditingName(name);
        setEditingDescription(description);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditingName("");
        setEditingDescription("");
    };

    const handleUpdate = async () => {
        if (editingName.trim() && editingDescription.trim()) {
            const updatedStatus = {
                status: editingName,  // <-- key is status now
                description: editingDescription,
            };
            console.log(`Updating status ID ${editingId}:`, updatedStatus);

            try {
                const response = await updateStatusById(editingId, updatedStatus);
                console.log("Update status response:", response);
                cancelEditing();
                loadStatus();
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this status?")) {
            console.log("Deleting status ID:", id);
            try {
                const response = await deleteStatusById(id);
                console.log("Delete status response:", response);
                loadStatus();
            } catch (error) {
                console.error("Error deleting status:", error);
            }
        }
    };

    return (
        <div className="container">
            <div className="status-page-container">
                <div className="status-add-container">
                    <h2>{editingId ? "Edit Status" : "Add New Status"}</h2>
                    <input
                        type="text"
                        placeholder="Stats Name"
                        value={editingId ? editingName : newName}
                        onChange={(e) =>
                            editingId ? setEditingName(e.target.value) : setNewName(e.target.value)
                        }
                    />
                    <textarea
                        placeholder="Status Description"
                        value={editingId ? editingDescription : newDescription}
                        onChange={(e) =>
                            editingId ? setEditingDescription(e.target.value) : setNewDescription(e.target.value)
                        }
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={editingId ? handleUpdate : handleAdd}>
                            {editingId ? "Update Status" : "Add Status"}
                        </button>
                        {editingId && (
                            <button onClick={cancelEditing}>Cancel</button>
                        )}
                    </div>
                </div>

                {/* Status List Table */}
                <div className="status-table-container">
                    <h2>Status List</h2>
                    <table className="status-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Status Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(statusList) && statusList.length > 0 ? (
                                statusList.map((stat, index) => (
                                    <tr key={stat._id}>
                                        <td>{index + 1}</td>
                                        <td>{stat.status}</td>
                                        <td>{stat.description}</td>
                                        <td className="actions">
                                            <button
                                                onClick={() => startEditing(stat._id, stat.status, stat.description)}
                                                className="edit"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(stat._id)}
                                                className="delete"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No status entries found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

