"use client";
import React, { useEffect, useState } from "react";
import {
  createTag,
  updateTagById,
  deleteTagById,
  getAllTags,
} from "../../services/Api";
import "../../Styles/TagsPage.css";

const TagsPage = () => {
  const [tags, setTags] = useState([]);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState(false);
  const [editingTagId, setEditingTagId] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
      const data = await getAllTags();
      setTags(data?.Tags || []);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) return;
      if (editing) {
        await updateTagById(editingTagId, formData);
        setEditing(false);
        setEditingTagId(null);
      } else {
        await createTag(formData);
      }
      setFormData({ name: "", description: "" });
      fetchTags();
  };

  const handleEdit = (tag) => {
    setFormData({ name: tag.name, description: tag.description });
    setEditing(true);
    setEditingTagId(tag._id);
  };

  const handleCancelEdit = () => {
    setFormData({ name: "", description: "" });
    setEditing(false);
    setEditingTagId(null);
  };

  const handleDelete = async (id) => {
      await deleteTagById(id);
      fetchTags();
  };

  return (
    <div className="tags-container">
      <div className="tag-page-container">
        {/* Left Form Section */}
        <div className="tag-add-container">
          <h2>{editing ? "Edit Tag" : "Add New Tag"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Tag Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Tag Description"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit">{editing ? "Update Tag" : "Add Tag"}</button>
              {editing && (
                <button type="button" onClick={handleCancelEdit}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Table Section */}
        <div className="tag-table-container">
          <h2>All Tags</h2>
          {tags.length > 0 ? (
            <table className="tag-table">
              <thead>
                <tr>
                  <th>Tag Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag._id}>
                    <td>{tag.name}</td>
                    <td>{tag.description}</td>
                    <td className="actions">
                      <button className="edit" onClick={() => handleEdit(tag)}>
                        Edit
                      </button>
                      <button className="delete" onClick={() => handleDelete(tag._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tags found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TagsPage;
