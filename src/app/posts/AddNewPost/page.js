"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createPost,
  getAllCategories,
  getAllTags,
  getPostById,
  updatePostById,
  getTaskById,
} from "../../services/Api";
import "../../Styles/AddNewPost.css";

const AddNewPost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const resubmitted = searchParams.get("resubmitted") === "true";
  const taskid = searchParams.get("taskid");

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

  const [originalPost, setOriginalPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedfile, setSelectedFile] = useState(null);
  const [taskdata, setTaskData] = useState(null);
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const todayDate = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: todayDate }));
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setStoredUser(userData);
    }
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    const fetchData = async () => {
      if (id) {
        try {
          const postRes = await getPostById(id);
          const post = postRes.news || postRes;
          setOriginalPost(post);

          const task = await getTaskById(id);
          setTaskData(task);

          setFormData({
            title: task?.title || post.title || "",
            url: task?.link || post.url || "",
            newsContent: post.newsContent || "",
            category: post.category || "",
            tags: post.tags || [],
            seoTitle: task?.title || post.seoTitle || "",
            seoMetaDescription: task?.title || post.seoMetaDescription || "",
            status: post.status || "Pending",
            publishedDate: todayDate,
          });
        } catch (err) {
          console.error("Error loading post/task data:", err);
        }
      }

      try {
        const [catRes, tagRes] = await Promise.all([
          getAllCategories(),
          getAllTags(),
        ]);
        setCategories(catRes.categories || []);
        setTags(tagRes.Tags || []);
      } catch (err) {
        console.error("Failed to load categories/tags:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
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

    if (!formData.title.trim() || !formData.newsContent.trim()) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.name || !storedUser?.employeeId) return;

    const name = storedUser.name;
    const employeeId = storedUser.employeeId;

    const formPayload = new FormData();
    formPayload.append("title", formData.title.trim());
    formPayload.append("url", formData.url.trim());
    formPayload.append("newsContent", formData.newsContent.trim());
    formPayload.append("category", formData.category);
    formPayload.append("tags", formData.tags);
    formPayload.append("seoTitle", formData.seoTitle.trim());
    formPayload.append("seoMetaDescription", formData.seoMetaDescription.trim());
    formPayload.append("status", storedUser.designation === "admin" ? formData.status : "Pending");
    formPayload.append("publishedDate", formData.publishedDate || new Date().toISOString());
    formPayload.append("authorName", name);
    formPayload.append("publishedBy", name);
    formPayload.append("updatedBy", "");
    formPayload.append("createdAt", new Date().toISOString());
    if (selectedfile) formPayload.append("file", selectedfile);
    if (taskid) formPayload.append("task", taskid);

    let response;
    if (originalPost) {
      response = await updatePostById(id, {
        ...formData,
        file: formData.file,
        status: resubmitted ? "Resubmitted" : formData.status,
        authorName: originalPost.authorName,
        publishedBy: originalPost.publishedBy,
        updatedBy: employeeId,
        task: taskid || "",
      });
    } else {
      response = await createPost(formPayload);
    }

    if (response?.message === "News Created" || response?.message === "News Updated") {
      if (!originalPost) {
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
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <input type="text" name="url" placeholder="News URL" value={formData.url} onChange={handleChange} />
            <textarea name="newsContent" placeholder="Text Content" value={formData.newsContent} onChange={handleChange} required />

            <input type="file" accept="image/*" id="image-upload" style={{ display: "none" }} onChange={handleImageChange} />
            <button type="button" onClick={() => document.getElementById("image-upload").click()} className="image-upload-button">
              {originalPost ? "Change Image" : "Upload Image"}
            </button>

            {(selectedfile || originalPost?.file) && (
              <div className="image-preview">
                <img
                  src={selectedfile ? URL.createObjectURL(selectedfile) : originalPost?.file}
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

            <input type="text" name="seoTitle" placeholder="SEO Title" value={formData.seoTitle} onChange={handleChange} />
            <input type="text" name="seoMetaDescription" placeholder="SEO Description" value={formData.seoMetaDescription} onChange={handleChange} />
            <input type="text" name="status" value={resubmitted ? "Resubmitted" : formData.status} onChange={handleChange} readOnly={storedUser?.designation !== "admin"} />
            <button type="submit">{originalPost ? "Update Post" : "Create Post"}</button>
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
