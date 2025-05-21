"use client";
import React, { useState, useEffect } from "react";
import {
  createPost,
  getAllCategories,
  getAllTags,
} from "../../services/Api";
import "../../Styles/AddNewPost.css";

const AddNewPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    newsContent: "",
    category: "",
    tags: [],
    seoTitle: "",
    seoMetaDescription: "",
    status: "Pending",
    publishedDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedfile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    loadCategories();
    loadTags();

    const todayDate = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: todayDate }));
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const res = await getAllTags();
      setTags(res.Tags || []);
    } catch (error) {
      console.error("Failed to load tags:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleimageChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
    }
  };

  const handleCategorySelect = (categoryName) => {
    setFormData({ ...formData, category: categoryName });
  };

  const handleTagToggle = (tagName) => {
    setFormData((prev) => {
      const updatedTags = prev.tags.includes(tagName)
        ? prev.tags.filter((tag) => tag !== tagName)
        : [...prev.tags, tagName];
      return { ...prev, tags: updatedTags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.newsContent.trim()) {
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.name || !storedUser.id) {
      alert("User not found.");
      return;
    }

    const name = storedUser.name;
    const id = storedUser.id;

    const cleanData = new FormData();
    cleanData.append("title", formData.title.trim());
    cleanData.append("url", formData.url.trim());
    cleanData.append("newsContent", formData.newsContent.trim());
    cleanData.append("tags", formData.tags);
    cleanData.append("category", formData.category);
    cleanData.append("seoTitle", formData.seoTitle.trim());
    cleanData.append("seoMetaDescription", formData.seoMetaDescription.trim());
    cleanData.append("status", storedUser.designation === "admin" ? formData.status : "Pending");
    cleanData.append("publishedDate", formData.publishedDate || new Date().toISOString());
    cleanData.append("authorName", name);
    cleanData.append("publishedBy", name);
    cleanData.append("updatedBy", "");
    cleanData.append("createdAt", new Date().toISOString());

    if (selectedfile) {
      cleanData.append("file", selectedfile);
    }

    try {
      const response = await createPost(cleanData);
      if (response?.message === "News Created") {
        alert("Post created successfully!");

        const today = new Date().toISOString().split("T")[0];
        setFormData({
          title: "",
          url: "",
          newsContent: "",
          category: "",
          tags: [],
          seoTitle: "",
          seoMetaDescription: "",
          status: "Pending",
          publishedDate: today,
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
      alert("An error occurred while saving the post.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="addposttitle">Add New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-body">
          <div className="form-left">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="url"
              placeholder="News URL"
              value={formData.url}
              onChange={handleChange}
            />
            <textarea
              name="newsContent"
              placeholder="Text Content"
              value={formData.newsContent}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: "none" }}
              onChange={handleimageChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("image-upload").click()}
              className="image-upload-button"
            >
              {selectedfile ? "Change Image" : "Upload Image"}
            </button>
            {selectedfile && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(selectedfile)}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    marginTop: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <input
              type="text"
              name="seoTitle"
              placeholder="SEO Title"
              value={formData.seoTitle}
              onChange={handleChange}
            />
            <input
              type="text"
              name="seoMetaDescription"
              placeholder="SEO Description"
              value={formData.seoMetaDescription}
              onChange={handleChange}
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={user?.designation !== "admin"}
            >
            </select>
            <input
              type="date"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
            />
            <button type="submit">Create Post</button>
          </div>

          <div className="form-right">
            <div className="checkbox-group">
              <label><strong>Select Category</strong></label>
              <div className="scroll-box">
                {categories.map((category) => {
                  const displayName = typeof category.name === "object" ? category.name.name : category.name;
                  return (
                    <div key={category._id}>
                      <label>
                        <input
                          type="radio"
                          name="category"
                          value={displayName}
                          checked={formData.category === displayName}
                          onChange={() => handleCategorySelect(displayName)}
                        />
                        {displayName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="checkbox-group">
              <label><strong>Select Tags</strong></label>
              <div className="scroll-box">
                {tags.map((tag) => {
                  const displayName = typeof tag.name === "object" ? tag.name.name : tag.name;
                  return (
                    <div key={tag._id}>
                      <label>
                        <input
                          type="checkbox"
                          value={displayName}
                          checked={formData.tags.includes(displayName)}
                          onChange={() => handleTagToggle(displayName)}
                        />
                        {displayName}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewPost;
