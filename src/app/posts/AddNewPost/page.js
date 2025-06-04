"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
  createPost,
  getAllCategories,
  getAllTags,
  getPostById,
  updatePostById,
} from "../../services/Api";
import "../../Styles/AddNewPost.css";

const AddNewPost = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const taskid = searchParams.get("task");
  console.log("task id :", taskid);
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
        setOriginalPost(post);
        setFormData({
          title: post.title || "",
          url: post.url || "",
          newsContent: post.newsContent || "",
          category: post.category || "",
          tags: post.tags || [],
          seoTitle: post.seoTitle || "",
          seoMetaDescription: post.seoMetaDescription || "",
          file: post.file || "",
          status: post.status || "Pending",
          publishedDate: post.publishedDate || new Date().toISOString(),
          task: taskid || "",
        });
      } catch (err) {
        console.error("Failed to fetch post:", err);
      }
    };

    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: today }));

    if (id) fetchPost();
    loadCategories();
    loadTags();
  }, [id]);

  // ExecCommand wrapper (for toolbar buttons)
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  // New: Handle Shift+Alt+J to full width center align the selected block
  const handleFullWidthCenterAlign = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Find the closest block element that contains the selection start
    let selectedNode = range.startContainer;
    while (selectedNode && selectedNode !== document && !isBlockElement(selectedNode)) {
      selectedNode = selectedNode.parentNode;
    }

    if (selectedNode && selectedNode.style) {
      selectedNode.style.display = "block";
      selectedNode.style.width = "100%";
      selectedNode.style.textAlign = "center";
    }
  };

  // Helper: Check if element is block-level (simple check)
  const isBlockElement = (el) => {
    if (!el || el.nodeType !== 1) return false; // Not an element
    const display = window.getComputedStyle(el).display;
    return display === "block" || display === "flex" || display === "table" || display === "list-item" || display === "grid";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.altKey && e.key.toLowerCase() === "j") {
        e.preventDefault();
        handleFullWidthCenterAlign();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
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
    cleanData.append("task", formData.task || "");

    if (selectedfile) cleanData.append("file", selectedfile);
    console.log("submited data for new post:", formData);
    let response;
    if (originalPost) {
      response = await updatePostById(id, {
        title: formData.title,
        url: formData.url,
        newsContent: formData.newsContent,
        category: formData.category,
        tags: formData.tags,
        seoTitle: formData.seoTitle,
        seoMetaDescription: formData.seoMetaDescription,
        file: formData.file,
        status: resubmitted ? "Resubmitted" : formData.status,
        publishedDate: formData.publishedDate,
        authorName: originalPost.authorName,
        publishedBy: originalPost.publishedBy,
        updatedBy: employeeId,
        task: formData.task || taskid || originalPost?.task || null,
      });
    } else {
      response = await createPost(cleanData);
      console.log("Api response:", response);
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
            <div className="editor-toolbar">
              <button type="button" onClick={() => execCommand("bold")}>
                <b>B</b>
              </button>
              <button type="button" onClick={() => execCommand("italic")}>
                <i>I</i>
              </button>
              <button type="button" onClick={() => execCommand("formatBlock", "<h1>")}>
                H1
              </button>
              <button type="button" onClick={() => execCommand("formatBlock", "<h2>")}>
                H2
              </button>
              <button type="button" onClick={() => execCommand("formatBlock", "<h3>")}>
                H3
              </button>
              <button type="button" onClick={() => execCommand("formatBlock", "<p>")}>
                P
              </button>
              <button type="button" onClick={() => execCommand("justifyLeft")}>⬅</button>
              <button type="button" onClick={() => execCommand("justifyCenter")}>⬍</button>
              <button type="button" onClick={() => execCommand("justifyRight")}>➡</button>
            </div>

            <div
              contentEditable
              className="editable-area"
              onInput={(e) => {
                const target = e.currentTarget || e.target;
                if (target) {
                  setFormData((prev) => ({ ...prev, newsContent: target.innerHTML }));
                }
              }}

              dangerouslySetInnerHTML={{ __html: formData.newsContent }}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                minHeight: "200px",
                marginTop: "10px",
                backgroundColor: "#fff",
              }}
            ></div>
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
export default AddNewPost;
