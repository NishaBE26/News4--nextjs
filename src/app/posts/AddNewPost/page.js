"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import {
  createPost,
  getAllCategories,
  getAllTags,
  getPostById,
  updatePostById,
  getCategoryById,
  getTagById,
  getEmployeeById,
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

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        const post = data.news || data;
        const categoryRes = await getCategoryById(post.category);
        const categoryName = categoryRes?.category?.name || "Unknown Category";
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

  // ✅ Set newsContent in editable div when loaded
  useEffect(() => {
    if (contentRef.current && formData.newsContent) {
      contentRef.current.innerHTML = formData.newsContent;
    }
  }, [formData.newsContent]);

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
    if (!formData.title.trim() || !formData.newsContent.trim()) return;

    const uncategorizedCategory = categories.find(
      (cat) => cat.name.toLowerCase() === "uncategorized"
    );
    const categoryName = formData.category?.trim()
      ? formData.category
      : uncategorizedCategory?.name || "";

    const unknownTag = tags.find(
      (tag) => tag.name.toLowerCase() === "unknown tag"
    );

    let tagsName = "";
    if (Array.isArray(formData.tags)) {
      tagsName = formData.tags.length
        ? formData.tags.join(", ")
        : unknownTag?.name || "";
    } else if (typeof formData.tags === "string") {
      tagsName = formData.tags.trim()
        ? formData.tags
        : unknownTag?.name || "";
    } else {
      tagsName = unknownTag?.name || "";
    }

    const cleanData = new FormData();
    cleanData.append("title", formData.title);
    cleanData.append("url", formData.url);
    cleanData.append("newsContent", formData.newsContent);
    cleanData.append("category", categoryName);
    cleanData.append("tags", tagsName);
    cleanData.append("seoTitle", formData.seoTitle);
    cleanData.append("seoMetaDescription", formData.seoMetaDescription);
    cleanData.append(
      "status",
      storedUser.designation === "admin" ? formData.status : "Pending"
    );
    cleanData.append("publishedDate", formData.publishedDate);
    cleanData.append("authorName", name);
    cleanData.append("publishedBy", name);
    cleanData.append("updatedBy", "");
    cleanData.append("createdAt", new Date().toISOString());

    if (formData.task && formData.task.trim() !== "") {
      cleanData.append("taskId", formData.task);
    }

    if (selectedfile) cleanData.append("file", selectedfile);

    let response;

    if (originalPost) {
      const authorEmp = await getEmployeeById(originalPost.authorName);
      const publishedEmp = await getEmployeeById(originalPost.publishedBy);
      const authorName = authorEmp?.name;
      const publishedBy = publishedEmp?.name;

      const updateForm = new FormData();
      updateForm.append("title", formData.title);
      updateForm.append("url", formData.url);
      updateForm.append("newsContent", formData.newsContent);
      updateForm.append("category", categoryName);
      updateForm.append("tags", tagsName);
      updateForm.append("seoTitle", formData.seoTitle);
      updateForm.append("seoMetaDescription", formData.seoMetaDescription);
      updateForm.append(
        "status",
        resubmitted ? "Resubmitted" : formData.status
      );
      updateForm.append("publishedDate", formData.publishedDate);
      updateForm.append("authorName", authorName);
      updateForm.append("publishedBy", publishedBy);
      updateForm.append("updatedBy", name);
      updateForm.append(
        "taskId",
        formData.task || taskid || originalPost?.task || ""
      );

      if (selectedfile) updateForm.append("file", selectedfile);

      response = await updatePostById(id, updateForm);
    } else {
      response = await createPost(cleanData);
    }

    if (
      response?.message === "News Created" ||
      response?.message === "News Updated"
    ) {
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

            {/* ✅ Editable content block for news */}
            <div
              className="editable-div"
              contentEditable
              ref={contentRef}
              onInput={() => {
                if (contentRef.current) {
                  setFormData((prev) => ({
                    ...prev,
                    newsContent: contentRef.current.innerHTML,
                  }));
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const text = e.clipboardData.getData("text/plain");
                document.execCommand("insertText", false, text);
              }}
              suppressContentEditableWarning={true}
              style={{
                fontFamily: "'Noto Sans Tamil', sans-serif",
                fontSize: "15px",
                lineHeight: "26.1px",
                padding: "12px",
                minHeight: "200px",
                border: "1px solid #ccc",
                outline: "none",
                whiteSpace: "pre-wrap",
              }}
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
      </form >
    </div >
  );
};

