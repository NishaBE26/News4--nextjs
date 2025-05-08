"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { createPost, getAllCategories, getAllTags, updatePost, getPostById } from "../../services/Api";
import TiptapMenuBar from "../../components/TiptapMenuBar";
import "../../Styles/add-new-post.css";

const AddNewPost = () => {
  const { postId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    newsContent: "",
    category: "",
    tags: [],
    file: "",
    seoTitle: "",
    seoMetaDescription: "",
    status: "Pending",
    publishedDate: new Date().toISOString(),
    visibility: "Public",
    format: "Standard",
    publishedBy: "",
  });

  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      setLoggedInUserId(userId);
    }
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      setFormData((prev) => ({
        ...prev,
        publishedBy: loggedInUserId,
      }));
    }
  }, [loggedInUserId]);

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    }
  }, [postId]);

  const fetchPostById = async (id) => {
    try {
      const post = await getPostById(id);
      if (post) {
        setFormData((prev) => ({
          ...prev,
          title: post.title,
          url: post.url,
          newsContent: post.newsContent,
          category: post.category,
          tags: post.tags,
          file: post.file,
          seoTitle: post.seoTitle,
          seoMetaDescription: post.seoMetaDescription,
          status: post.status,
          publishedDate: post.publishedDate,
        }));
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6, 7] }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: formData.newsContent,
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, newsContent: editor.getHTML() }));
    },
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      const res = await getAllTags();
      setTags(res.Tags || []);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleTagToggle = (tagId) => {
    setFormData((prev) => {
      const updatedTags = prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId];
      return { ...prev, tags: updatedTags };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", "your_upload_preset");

    const res = await fetch("https://api.cloudinary.com/v1_1/deak6louz/image/upload", {
      method: "POST",
      body: form,
    });
    const data = await res.json();
    setFormData((prev) => ({ ...prev, file: data.secure_url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, newsContent } = formData;

    if (!title || !newsContent) {
      alert("Title and Content are required.");
      return;
    }

    try {
      if (postId) {
        await updatePost(postId, formData);
        alert("Post updated successfully!");
      } else {
        await createPost(formData);
        alert("Post created successfully!");
      }
    } catch (error) {
      console.error("Error creating/updating post:", error);
      alert("Failed to create/update post");
    }
  };

  const wordCount = editor ? editor.getText().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="form-container">
      <h1>{postId ? "Edit Post" : "Add New Post"}</h1>
      <form onSubmit={handleSubmit} className="new-post-form">
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
          placeholder="URL"
          value={formData.url}
          onChange={handleChange}
        />
        <label><strong>Content</strong></label>
        <TiptapMenuBar editor={editor} />
        <div className="tiptap-editor">
          <EditorContent editor={editor} />
        </div>
        <p>Word Count: {wordCount}</p>

        <input type="file" onChange={handleFileChange} />

        <input
          type="date"
          name="publishedDate"
          value={formData.publishedDate.slice(0, 10)}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              publishedDate: new Date(e.target.value).toISOString(),
            }))
          }
        />

        <select name="category" onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <div className="tags-list">
          {tags.map((tag) => (
            <label key={tag._id}>
              <input
                type="checkbox"
                value={tag._id}
                checked={formData.tags.includes(tag._id)}
                onChange={() => handleTagToggle(tag._id)}
              />
              {tag.name}
            </label>
          ))}
        </div>

        <input
          type="text"
          name="seoTitle"
          placeholder="SEO Title"
          value={formData.seoTitle}
          onChange={handleChange}
        />
        <textarea
          name="seoMetaDescription"
          placeholder="SEO Meta Description"
          value={formData.seoMetaDescription}
          onChange={handleChange}
        />

        <button type="submit">{postId ? "Update Post" : "Create Post"}</button>
      </form>
    </div>
  );
};

export default AddNewPost;
