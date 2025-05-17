"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  createPost,
  updatePostById,
  getPostById,
  getAllCategories,
  getAllTags,
} from "../../services/Api";
import "../../Styles/AddNewPost.css";

const AddNewPost = () => {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    newsContent: "",
    category: "", 
    tags: [],
    file: null,
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
    setUser(storedUser);
    loadCategories();
    loadTags();

    const todayDate = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: todayDate }));

    if (postId) {
      fetchPostData(postId);
    }
  }, [postId]);

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

  const fetchPostData = async (id) => {
    try {
      const res = await getPostById(id);
      const post = res?.news;
      if (post) {
        setFormData({
          title: post.title || "",
          url: post.url || "",
          newsContent: post.newsContent || "",
          category: post.category || "", 
          tags: post.tags || [],
          file: post.file || null,
          seoTitle: post.seoTitle || "",
          seoMetaDescription: post.seoMetaDescription || "",
          status: post.status || "Pending",
          publishedDate: post.publishedDate
            ? post.publishedDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
        
        if (post.file) {
          setFormData(prev => ({
            ...prev,
            imageUrl: post.file.url || null
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch post data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        imageUrl: reader.result,
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId
    }));
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

    if (!formData.title.trim() || !formData.newsContent.trim()) {
      alert("Title and Content are required.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.name || !storedUser.id) {
      alert("User not found.");
      return;
    }

    const name = storedUser.name;
    const id = storedUser.id;
    const isEdit = !!postId;

    const cleanData = {
      title: formData.title.trim(),
      url: formData.url.trim(),
      newsContent: formData.newsContent.trim(),
      tags: formData.tags,
      category: formData.category, // Directly use the category ID
      file: formData.imageFile,
      seoTitle: formData.seoTitle.trim(),
      seoMetaDescription: formData.seoMetaDescription.trim(),
      status: storedUser.designation === "admin" ? formData.status : "Pending",
      publishedDate: formData.publishedDate || new Date().toISOString(),
      authorName: isEdit ? id : name,
      publishedBy: isEdit ? id : name,
      updatedBy: null,
    };

    console.log("Submitting data:", cleanData);

    try {
      const response = postId
        ? await updatePostById(postId, cleanData)
        : await createPost({ ...cleanData, createdAt: new Date().toISOString() });

      if (response?.message === (postId ? "Post Updated" : "News Created")) {
        alert(postId ? "Post updated successfully!" : "Post created successfully!");
        
        // Only reset if not editing
        if (!postId) {
          const today = new Date().toISOString().split("T")[0];
          setFormData({
            title: "",
            url: "",
            newsContent: "",
            category: "",
            tags: [],
            file: null,
            seoTitle: "",
            seoMetaDescription: "",
            status: "Pending",
            publishedDate: today,
          });
        }
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
      alert("An error occurred while saving the post.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="addposttitle">{postId ? "Edit Post" : "Add New Post"}</h1>
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
            <div className="image-upload-container">
              <input
                type="file"
                accept="image/*"
                id="image-upload"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: file,
                      imageUrl: URL.createObjectURL(file),
                    }));
                  }
                }}
              />
              <button
                type="button"
                onClick={() => document.getElementById("image-upload").click()}
                className="image-upload-button"
              >
                {formData.imageUrl ? "Change Image" : "Upload Image"}
              </button>
              {formData.imageUrl && (
                <div className="image-preview">
                  <img
                    src={formData.imageUrl}
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
            </div>
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
            <button type="submit">{postId ? "Update Post" : "Create Post"}</button>
          </div>

          <div className="form-right">
            <div className="checkbox-group">
              <label><strong>Select Category</strong></label>
              <div className="scroll-box">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category._id}>
                      <label>
                        <input
                          type="radio"
                          name="category"
                          value={category._id}
                          checked={formData.category === category._id}
                          onChange={() => handleCategorySelect(category._id)}
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