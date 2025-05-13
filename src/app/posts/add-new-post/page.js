"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createPost, getAllCategories, getAllTags, getEmployeeById } from "../../services/Api";
import "../../Styles/add-new-post.css";

const AddNewPost = () => {
  const params = useParams();
  const taskId = params?.taskId || "";

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    newsContent: "",
    category: [],
    tags: [],
    imageUrl: "",
    seoTitle: "",
    seoMetaDescription: "",
    status: "Pending",
    publishedDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user:", storedUser);
    setUser(storedUser);

    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    const res = await getAllCategories();
    setCategories(res.categories || []);
  };

  const loadTags = async () => {
    const res = await getAllTags();
    setTags(res.Tags || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData((prev) => {
      const updatedCategories = prev.category.includes(categoryId)
        ? prev.category.filter((id) => id !== categoryId)
        : [...prev.category, categoryId];
      return { ...prev, category: updatedCategories };
    });
  };
  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const updatedTags = prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags: updatedTags };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.name) {
      return;
    }

    const name = storedUser.name;
    console.log("User name from stored user:", name);

    const cleanData = {
      title: formData.title?.trim() || "",
      url: formData.url?.trim() || "",
      newsContent: formData.newsContent?.trim() || "",
      tags: formData.tags,
      category: formData.category[0] || "",
      file: formData.imageUrl?.trim() || "",
      seoTitle: formData.seoTitle?.trim() || "",
      seoMetaDescription: formData.seoMetaDescription?.trim() || "",
      status: storedUser.designation === "admin" ? formData.status : "Pending",
      publishedDate: new Date().toISOString(),
      task: taskId || "",
      updatedBy: null,
      createdAt: new Date().toISOString(),
      authorName: name,
      publishedBy: name,
    };
    console.log("Data to be sent to the backend:", cleanData);
    const response = await createPost(cleanData);
    console.log("Response from createPost API:", response);
    if (response?.message === "News Created") {
      alert("Post created successfully!");
      setFormData({
        title: "",
        url: "",
        newsContent: "",
        category: [],
        tags: [],
        imageUrl: "",
        seoTitle: "",
        seoMetaDescription: "",
        status: "Pending",
        publishedDate: "",
      });
    } else {
      alert("Failed to create post. Please try again.");
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
              placeholder="TextContent"
              value={formData.newsContent}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleChange}
            />
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
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Published">Published</option>
              <option value="Rejected">Rejected</option>
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
              <label><strong>Select Categories</strong></label>
              <div className="scroll-box">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category._id || category.id}>
                      <label>
                        <input
                          type="checkbox"
                          value={category._id || category.id}
                          checked={formData.category.includes(category._id || category.id)}
                          onChange={() => handleCategoryToggle(category._id || category.id)}
                        />
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No categories available</p>
                )}
              </div>
            </div>

            <div className="checkbox-group">
              <label><strong>Select Tags</strong></label>
              <div className="scroll-box">
                {tags.length > 0 ? (
                  tags.map((tag) => (
                    <div key={tag._id}>
                      <label>
                        <input
                          type="checkbox"
                          value={tag._id}
                          checked={formData.tags.includes(tag._id)}
                          onChange={() => handleTagToggle(tag._id)}
                        />
                        {tag.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p>No tags available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewPost;
