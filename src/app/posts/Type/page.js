"use client";
import React, { useEffect, useState } from "react";
import {
  getAllTypes,
  createType,
  updateTypeById,
  deleteTypeById,
} from "../../services/Api";
import "../../Styles/Typepage.css";

const Type = () => {
  const [typelist, setTypeList] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    loadType();
  }, []);

  const loadType = async () => {
    const response = await getAllTypes();
    setTypeList(response.Type || []);
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      alert("Name is required.");
      return;
    }
    const newType = {
      name: newName.trim(),
      description: newDescription.trim() || "", 
    };
    await createType(newType);
    setNewName("");
    setNewDescription("");
    loadType();
  };

  const startEdit = (id, name, description) => {
    setEditId(id);
    setEditName(name);
    setEditDescription(description || "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleUpdate = async () => {
    if (!editName.trim()) {
      alert("Name is required.");
      return;
    }
    const updatedType = {
      name: editName.trim(),
      description: editDescription.trim() || "", 
    };
    await updateTypeById(editId, updatedType);
    cancelEdit();
    loadType();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this type?")) {
      await deleteTypeById(id);
      loadType();
    }
  };

  return (
    <div className="type-container">
      <div className="type-page-container">
        <div className="type-add-container">
          <h2>{editId ? "Edit Type" : "Add New Type"}</h2>
          <input
            type="text"
            placeholder="Type Name"
            value={editId ? editName : newName}
            onChange={(e) =>
              editId ? setEditName(e.target.value) : setNewName(e.target.value)
            }
          />
          <textarea
            placeholder="Type Description (optional)"
            value={editId ? editDescription : newDescription}
            onChange={(e) =>
              editId
                ? setEditDescription(e.target.value)
                : setNewDescription(e.target.value)
            }
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={editId ? handleUpdate : handleAdd}
            >
              {editId ? "Update Type" : "Add Type"}
            </button>
            {editId && <button onClick={cancelEdit}>Cancel</button>}
          </div>
        </div>

        <div className="type-table-container">
          <h2>Type List</h2>
          <table className="type-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Type Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {typelist.length > 0 ? (
                typelist.map((type, index) => (
                  <tr key={type._id}>
                    <td>{index + 1}</td>
                    <td>{type.name}</td>
                    <td>{type.description}</td>
                    <td className="actions">
                      <button
                        onClick={() =>
                          startEdit(type._id, type.name, type.description)
                        }
                        className="edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(type._id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No Type entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Type;
