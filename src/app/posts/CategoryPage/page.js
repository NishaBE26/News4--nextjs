'use client';
import React, { useEffect, useState } from 'react';
import {
  getAllCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from '../../services/Api';
import "../../Styles/CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.categories);
  };

  const handleAdd = async () => {
    if (newName.trim() && newDescription.trim()) {
      await createCategory({ name: newName, description: newDescription });
      setNewName("");
      setNewDescription("");
      loadCategories();
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
      await updateCategoryById(editingId, {
        name: editingName,
        description: editingDescription,
      });
      cancelEditing();
      loadCategories();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategoryById(id);
      loadCategories();
    }
  };

  return (
    <div className="container">
      <div className="category-page-container">
        {/* Add/Edit Category Form */}
        <div className="category-add-container">
          <h2>{editingId ? "Edit Category" : "Add New Category"}</h2>
          <input
            type="text"
            placeholder="Category Name"
            value={editingId ? editingName : newName}
            onChange={(e) => editingId ? setEditingName(e.target.value) : setNewName(e.target.value)}
          />
          <textarea
            placeholder="Category Description"
            value={editingId ? editingDescription : newDescription}
            onChange={(e) => editingId ? setEditingDescription(e.target.value) : setNewDescription(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={editingId ? handleUpdate : handleAdd}>
              {editingId ? "Update Category" : "Add Category"}
            </button>
            {editingId && (
              <button onClick={cancelEditing}>Cancel</button>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="category-table-container">
          <h2>Categories List</h2>
          <table className="category-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Category Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id}>
                  <td>{index + 1}</td>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td className="actions">
                    <button
                      onClick={() => startEditing(cat._id, cat.name, cat.description)}
                      className="edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
