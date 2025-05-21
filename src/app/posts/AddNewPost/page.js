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
          seoTitle: post.seoTitle || "",
          seoMetaDescription: post.seoMetaDescription || "",
          status: post.status || "Pending",
          publishedDate: post.publishedDate
            ? post.publishedDate.split("T")[0]
            : new Date().toISOString().split("T")[0],
        });

        if (post.file) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: post.file.url || null,
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

  const handleimageChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
    }
  };

  const handleCategorySelect = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
  };

  const handleTagToggle = (tagName) => {
    setFormData((prev) => {
      const tagsSet = new Set(prev.tags);
      if (tagsSet.has(tagName)) {
        tagsSet.delete(tagName);
      } else {
        tagsSet.add(tagName);
      }
      return { ...prev, tags: Array.from(tagsSet) };
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

    const form = new FormData();

    form.append("title", formData.title.trim());
    form.append("url", formData.url.trim());
    form.append("newsContent", formData.newsContent.trim());
    form.append("seoTitle", formData.seoTitle.trim());
    form.append("seoMetaDescription", formData.seoMetaDescription.trim());
    form.append(
      "status",
      storedUser.designation === "admin" ? formData.status : "Pending"
    );
    form.append(
      "publishedDate",
      formData.publishedDate || new Date().toISOString()
    );
    form.append("category", formData.category);
    form.append("authorName", isEdit ? id : name);
    form.append("publishedBy", isEdit ? id : name);
    form.append("updatedBy", isEdit ? name : null);

    // Append tags array
    formData.tags.forEach((tag) => form.append("tags[]", tag));

    if (selectedfile) {
      form.append("file", selectedfile);
    }

    try {
      const response = isEdit
        ? await updatePostById(postId, form, true)
        : await createPost(form, true);

      console.log("Response from API: ", response);

      if (response?.message === (isEdit ? "News Updated" : "News Created")) {
        alert(isEdit ? "Post updated successfully!" : "Post created successfully!");

        if (isEdit) {
          // Update formData state with updated news from API response
          const updatedPost = response.updatedNews;
          setFormData({
            title: updatedPost.title || "",
            url: updatedPost.url || "",
            newsContent: updatedPost.newsContent || "",
            category: updatedPost.category || "",
            tags: updatedPost.tags || [],
            seoTitle: updatedPost.seoTitle || "",
            seoMetaDescription: updatedPost.seoMetaDescription || "",
            status: updatedPost.status || "Pending",
            publishedDate: updatedPost.publishedDate
              ? updatedPost.publishedDate.split("T")[0]
              : new Date().toISOString().split("T")[0],
          });
          // Reset selected file if needed
          setSelectedFile(null);
        } else {
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
              {selectedfile ? `Selected: ${selectedfile.name}` : "Select Image"}
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
              <label>
                <strong>Select Category</strong>
              </label>
              <div className="scroll-box">
                {categories.length > 0 &&
                  categories.map((category) => {
                    const displayName =
                      typeof category.name === "object"
                        ? category.name.name
                        : category.name;
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
              <label>
                <strong>Select Tags</strong>
              </label>
              <div className="scroll-box">
                {tags.length > 0 &&
                  tags.map((tag) => {
                    const displayName =
                      typeof tag.name === "object" ? tag.name.name : tag.name;
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
