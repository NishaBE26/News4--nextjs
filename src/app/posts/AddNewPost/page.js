"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  createPost,
  getAllCategories,
  getAllTags,
  getPostById,
  updatePostById,
  getCategoryById,
  getTagById,
} from "../../services/Api";
import "../../Styles/AddNewPost.css";

export default function AddNewPost() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const taskid = searchParams.get("task");
  const resubmitted = searchParams.get("resubmitted") === "true";

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
    task: taskid || null,
  });

  const [originalPost, setOriginalPost] = useState(null);
  const [selectedfile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        const post = data.news || data;

        // Fetch category name
        const categoryRes = await getCategoryById(post.category);
        const categoryName = categoryRes?.category?.name || "Unknown Category";

        // Fetch tag names (support array or single ID)
        const tagIds = Array.isArray(post.tags) ? post.tags : [post.tags];
        const tagNames = await Promise.all(
          tagIds.map(async (tagId) => {
            const tagRes = await getTagById(tagId);
            return tagRes?.Tags?.name || "Unknown Tag";
          })
        );
        setFormData({
          title: post.title || "",
          url: post.url || "",
          newsContent: post.newsContent || "",
          category: categoryName,
          tags: tagNames,
          seoTitle: post.seoTitle || "",
          seoMetaDescription: post.seoMetaDescription || "",
          file: post.file || "",
          status: post.status || "Pending",
          publishedDate: post.publishedDate || new Date().toISOString(),
          task: taskid || "",
        });

        setOriginalPost(post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: today }));

    if (id) fetchPost();
    loadCategories();
    loadTags();
  }, [id]);
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

  const handleImageChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setSelectedFile(uploadedFile);
  };

  const handleCategorySelect = (categoryName) => {
    setFormData((prev) => ({ ...prev, category: categoryName }));
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

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.name || !storedUser?.employeeId) return;

    const name = storedUser.name;
    const employeeId = storedUser.employeeId;

    if (!formData.title.trim() || !formData.newsContent.trim()) return;

    const cleanData = new FormData();
    cleanData.append("title", formData.title);
    cleanData.append("url", formData.url);
    cleanData.append("newsContent", formData.newsContent);
    cleanData.append("category", formData.category);
    cleanData.append("tags", formData.tags);
    cleanData.append("seoTitle", formData.seoTitle);
    cleanData.append("seoMetaDescription", formData.seoMetaDescription);
    cleanData.append("status", storedUser.designation === "admin" ? formData.status : "Pending");
    cleanData.append("publishedDate", formData.publishedDate);
    cleanData.append("authorName", name);
    cleanData.append("publishedBy", name);
    cleanData.append("updatedBy", "");
    cleanData.append("createdAt", new Date().toISOString());
    if (formData.task && formData.task.trim() !== "") {
      cleanData.append("taskId", formData.task);
    }

    if (selectedfile) cleanData.append("file", selectedfile);
    console.log("submitted post:", formData)
    let response;
    if (originalPost) {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category || cat.name?.name === formData.category
      );
      const categoryId = selectedCategory?._id;
      const tagIds = tags
        .filter(
          (tag) =>
            formData.tags.includes(tag.name) || formData.tags.includes(tag.name?.name)
        )
        .map((tag) => tag._id);
      const response = await updatePostById(id, {
        title: formData.title,
        url: formData.url,
        newsContent: formData.newsContent,
        category: categoryId,         
        tags: tagIds,                
        seoTitle: formData.seoTitle,
        seoMetaDescription: formData.seoMetaDescription,
        file: formData.file,
        status: resubmitted ? "Resubmitted" : formData.status,
        publishedDate: formData.publishedDate,
        authorName: originalPost.authorName,
        publishedBy: originalPost.publishedBy,
        updatedBy: employeeId,
        taskId: formData.task || taskid || originalPost?.task || null,
      });

      console.log("api response:", response);
    }
    else {
      response = await createPost(cleanData);
      console.log("api response:", response)
    }

    if (response?.message === "News Created" || response?.message === "News Updated") {
      router.push("/posts");
    }
  };

  return (
    <div className="form-container">
      <h1 className="addposttitle">
        {resubmitted ? "Change Post" : originalPost ? "Edit Post" : "New Post"}
      </h1>
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
            {formData.task && <input type="hidden" name="task" value={formData.task} />}
            <input
              type="file"
              accept="image/*"
              id="image-upload"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("image-upload").click()}
              className="image-upload-button"
            >
              {originalPost ? "Change Image" : "Upload Image"}
            </button>
            {selectedfile ? (
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
            ) : originalPost?.file ? (
              <div className="image-preview">
                <img
                  src={originalPost.file}
                  alt="Existing Image"
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
            ) : null}
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
            <input
              type="text"
              name="status"
              value={resubmitted ? "Resubmitted" : formData.status}
              onChange={handleChange}
            />
            <button type="submit">{originalPost ? "Update Post" : "Create Post"}</button>
          </div>

          <div className="form-right">
            <div className="checkbox-group">
              <label>
                <strong>Select Category</strong>
              </label>
              <div className="scroll-box">
                {categories.map((category) => {
                  const displayName =
                    typeof category.name === "object" ? category.name.name : category.name;
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

