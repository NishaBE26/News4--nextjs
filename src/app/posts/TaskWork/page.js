"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createPost, getAllCategories, getAllTags } from "@/app/services/Api";

const TaskWork = () => {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id"); // get task id from URL
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);

  // For file preview and upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    newsContent: "",
    tags: [],
    category: "",
    authorName: "",
    seoTitle: "",
    seoMetaDescription: "",
    publishedDate: new Date().toISOString().substring(0, 10),
    status: "Pending",
    task: taskId || "",
    publishedBy: "",
  });

  // Load categories and tags
  useEffect(() => {
    async function fetchOptions() {
      try {
        const catRes = await getAllCategories();
        const tagRes = await getAllTags();
        setCategories(catRes.categories || []);
        setTagsOptions(tagRes.Tags || []);
      } catch (error) {
        console.error("Error loading categories/tags", error);
      }
    }
    fetchOptions();
  }, []);

  // Load user info from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setFormData((prev) => ({
        ...prev,
        authorName: parsed.name || "",
        publishedBy: parsed.name || "",
      }));
    }
  }, []);

  // Update formData.task if taskId changes
  useEffect(() => {
    if (taskId) {
      setFormData((prev) => ({ ...prev, task: taskId }));
    }
  }, [taskId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tags") {
      setFormData((prev) => ({
        ...prev,
        tags: checked
          ? [...prev.tags, value]
          : prev.tags.filter((tag) => tag !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle file select and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result); // base64 string for preview only
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formPayload = new FormData();

      // Append other form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          // Append each tag separately
          value.forEach((tag) => formPayload.append("tags[]", tag));
        } else if (value !== null && value !== undefined) {
          formPayload.append(key, value);
        }
      });

      // Append file if selected
      if (selectedFile) {
        formPayload.append("file", selectedFile);
      }

      // Append task ID explicitly if needed
      if (taskId) {
        formPayload.append("task", taskId);
      }

      const res = await createPost(formPayload);

      if (res?.success) {
        alert("Post submitted successfully!");
        router.push("/posts");
      } else {
        alert("Failed to submit post");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting post");
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: "1rem" }}>
      <h2>Work on Assigned Task</h2>
      {!taskId && <p>No Task ID found in URL</p>}

      {taskId && (
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              required
            />
          </label>

          <label>
            Reference URL:
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              type="url"
            />
          </label>

          <label>
            News Content:
            <textarea
              name="newsContent"
              value={formData.newsContent}
              onChange={handleChange}
              rows={5}
              required
            />
          </label>

          <fieldset>
            <legend>Tags:</legend>
            {tagsOptions.map((tag) => (
              <label key={tag._id} style={{ marginRight: 10 }}>
                <input
                  type="checkbox"
                  name="tags"
                  value={tag.name}
                  checked={formData.tags.includes(tag.name)}
                  onChange={handleChange}
                />
                {tag.name}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Category:</legend>
            {categories.map((cat) => (
              <label key={cat._id} style={{ marginRight: 10 }}>
                <input
                  type="radio"
                  name="category"
                  value={cat.name}
                  checked={formData.category === cat.name}
                  onChange={handleChange}
                />
                {cat.name}
              </label>
            ))}
          </fieldset>

          <label>
            Attach File (Image):
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {filePreview && (
            <div>
              <p>File Preview:</p>
              <img
                src={filePreview}
                alt="Preview"
                style={{ width: 200, marginTop: 10 }}
              />
            </div>
          )}

          <label>
            SEO Title:
            <input
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              type="text"
            />
          </label>

          <label>
            SEO Meta Description:
            <textarea
              name="seoMetaDescription"
              value={formData.seoMetaDescription}
              onChange={handleChange}
              rows={3}
            />
          </label>

          <label>
            Published Date:
            <input
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              type="date"
              required
            />
          </label>

          <button type="submit" style={{ marginTop: 20 }}>
            Submit Post
          </button>
        </form>
      )}
    </div>
  );
};

export default TaskWork;
