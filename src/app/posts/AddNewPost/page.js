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
    categoryId: "",
    tags: [],
    tagIds: [],
    seoTitle: "",
    seoMetaDescription: "",
    status: "Pending",
    publishedDate: "",
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    loadCategories();
    loadTags();

    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, publishedDate: today }));

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
        const categoryName =
          typeof post.category?.name === "object"
            ? post.category.name.name
            : post.category?.name || post.category;

        const tagNames = post.tags?.map((tag) =>
          typeof tag.name === "object" ? tag.name.name : tag.name
        );
        const tagIds = post.tags?.map((tag) => tag._id);

        setFormData({
          title: post.title || "",
          url: post.url || "",
          newsContent: post.newsContent || "",
          category: categoryName,
          categoryId: post.category?._id || "",
          tags: tagNames || [],
          tagIds: tagIds || [],
          seoTitle: post.seoTitle || "",
          seoMetaDescription: post.seoMetaDescription || "",
          status: post.status || "Pending",
          publishedDate: post.publishedDate?.split("T")[0] || new Date().toISOString().split("T")[0],
          authorName: post.authorName || "",
          publishedBy: post.publishedBy || "",
          createdAt: post.createdAt || "",
        });

        if (post.file) setSelectedFile(post.file);
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
    if (file) setSelectedFile(file);
  };

  const handleCategorySelect = (cat) => {
    const name = typeof cat.name === "object" ? cat.name.name : cat.name;
    setFormData((prev) => ({
      ...prev,
      category: name,
      categoryId: cat._id,
    }));
  };

  const handleTagToggle = (tag) => {
    const name = typeof tag.name === "object" ? tag.name.name : tag.name;

    setFormData((prev) => {
      const isSelected = prev.tags.includes(name);
      const updatedTags = isSelected
        ? prev.tags.filter((t) => t !== name)
        : [...prev.tags, name];
      const updatedTagIds = isSelected
        ? prev.tagIds.filter((id) => id !== tag._id)
        : [...prev.tagIds, tag._id];
      return {
        ...prev,
        tags: updatedTags,
        tagIds: updatedTagIds,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.newsContent.trim()) {
      alert("Title and content are required.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      alert("User not found.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("title", formData.title.trim());
    formPayload.append("url", formData.url.trim());
    formPayload.append("newsContent", formData.newsContent.trim());
    formPayload.append("category", formData.categoryId);
    formPayload.append("tags", JSON.stringify(formData.tagIds));
    formPayload.append("seoTitle", formData.seoTitle.trim());
    formPayload.append("seoMetaDescription", formData.seoMetaDescription.trim());
    formPayload.append(
      "status",
      currentUser.designation === "admin" ? formData.status : "Pending"
    );
    formPayload.append("publishedDate", formData.publishedDate);

    if (!postId) {
  
      formPayload.append("authorName", currentUser.name);  
      formPayload.append("publishedBy", currentUser.name); 
      formPayload.append("createdAt", new Date().toISOString());
      formPayload.append("updatedBy", "");
    } else {
      formPayload.append("authorName", formData.authorName || ""); 
      formPayload.append("publishedBy", formData.publishedBy || "");
      formPayload.append("createdAt", formData.createdAt || "");
      formPayload.append("updatedBy", currentUser.name);  
    }

    if (selectedFile instanceof File) {
      formPayload.append("file", selectedFile);
    }
console.log("Form data:", formPayload);
    try {
      const res = postId
        ? await updatePostById(postId, formPayload)
        : await createPost(formPayload);
        console.log("Response:", res);

      if (res?.message) {
        alert(postId ? "Post updated successfully!" : "Post created successfully!");
        if (!postId) {
          setFormData({
            title: "",
            url: "",
            newsContent: "",
            category: "",
            categoryId: "",
            tags: [],
            tagIds: [],
            seoTitle: "",
            seoMetaDescription: "",
            status: "Pending",
            publishedDate: new Date().toISOString().split("T")[0],
          });
          setSelectedFile(null);
        }
        console.log("Post data:", res);
      }
    } catch (error) {
      console.error("Failed to submit post:", error);
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
              onChange={handleImageChange}
            />
            <button
              type="button"
              onClick={() => document.getElementById("image-upload").click()}
              className="image-upload-button"
            >
              {selectedFile ? "Change Image" : "Upload Image"}
            </button>
            {selectedFile && (
              <div className="image-preview">
                <img
                  src={
                    selectedFile instanceof File
                      ? URL.createObjectURL(selectedFile)
                      : selectedFile
                  }
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
              <label><strong>Select Category</strong></label>
              <div className="scroll-box">
                {categories.map((cat) => {
                  const name = typeof cat.name === "object" ? cat.name.name : cat.name;
                  return (
                    <label key={cat._id}>
                      <input
                        type="radio"
                        name="category"
                        value={name}
                        checked={formData.category === name}
                        onChange={() => handleCategorySelect(cat)}
                      />
                      {name}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="checkbox-group">
              <label><strong>Select Tags</strong></label>
              <div className="scroll-box">
                {tags.map((tag) => {
                  const name = typeof tag.name === "object" ? tag.name.name : tag.name;
                  return (
                    <label key={tag._id}>
                      <input
                        type="checkbox"
                        value={name}
                        checked={formData.tags.includes(name)}
                        onChange={() => handleTagToggle(tag)}
                      />
                      {name}
                    </label>
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
