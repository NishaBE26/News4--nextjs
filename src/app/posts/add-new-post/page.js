"use client";

import React, { useState, useEffect } from "react";
import { createPost, getAllCategories, getAllTags } from "../../services/Api";
import "../../Styles/add-new-post.css";

const AddNewPost = () => {
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        newsContent: "",
        authorName: "",
        category: "",
        tags: [],
        file: "",
        seoTitle: "",
        seoMetaDescription: "",
        status: "Pending",
        publishedDate: "",
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
            setCategories([]);
        }
    };

    const loadTags = async () => {
        try {
            const res = await getAllTags();
            setTags(res.Tags || []); // Corrected to match API response
        } catch (error) {
            console.error("Error loading tags:", error);
            setTags([]);
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
            const tags = prev.tags.includes(tagId)
                ? prev.tags.filter((id) => id !== tagId)
                : [...prev.tags, tagId];
            return { ...prev, tags };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Perform basic validation
        const { title, newsContent, authorName } = formData;
        if (!title || !newsContent || !authorName) {
            alert("Title, Content, and Author Name are required.");
            return;
        }
    
        try {
            console.log("Form data being sent:", formData);
            await createPost(formData);
            alert("Post created successfully!");
            setFormData({
                title: "", url: "", newsContent: "", authorName: "", category: "",
                tags: [], file: "", seoTitle: "", seoMetaDescription: "",
                status: "Pending", publishedDate: ""
            });
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post");
        }
    };
    return (
        <div className="form-container">
            <h1>Add New Post</h1>
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
                    placeholder="News URL" 
                    value={formData.url} 
                    onChange={handleChange} 
                />
                <textarea 
                    name="newsContent" 
                    placeholder="Content" 
                    value={formData.newsContent} 
                    onChange={handleChange} 
                    required 
                />
                <input 
                    type="text" 
                    name="authorName" 
                    placeholder="Author Name" 
                    value={formData.authorName} 
                    onChange={handleChange} 
                    required 
                />

                <div className="checkbox-group">
                    <label><strong>Select Category</strong></label>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <div key={category._id || category.id}>
                                <label>
                                    <input
                                        type="radio"
                                        name="category"
                                        value={category._id || category.id}
                                        checked={formData.category === (category._id || category.id)}
                                        onChange={() => handleCategoryChange(category._id || category.id)}
                                        required
                                    />
                                    {category.name}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p>No categories available</p>
                    )}
                </div>

                <div className="checkbox-group">
                    <label><strong>Select Tags</strong></label>
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

                <input 
                    type="text" 
                    name="file" 
                    placeholder="Image URL" 
                    value={formData.file} 
                    onChange={handleChange} 
                    required 
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
            </form>
        </div>
    );
};

export default AddNewPost;
