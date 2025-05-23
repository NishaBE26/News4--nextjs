'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getPostById, updatePostById } from '../../../services/Api';
import "../../../Styles/Edit.css";

const EditPostPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [originalPost, setOriginalPost] = useState(null);
  const [storedUser, setStoredUser] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    file: '',
    status: 'Pending',
    url: '',
    seoTitle: '',
    seoMetaDescription: '',
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        const post = data.news || data;

        setOriginalPost(post);

        setFormData({
          title: post.title || '',
          content: post.newsContent || '',
          category: post.category || '',
          file: post.file || '',
          status: post.status || 'Pending',
          url: post.url || '',
          seoTitle: post.seoTitle || '',
          seoMetaDescription: post.seoMetaDescription || '',
        });
        setLoading(false);
      } catch (err) {
   
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalPost) {
      alert('Original post data missing!');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log(user);
      setStoredUser(user);
      const employeeId = user.employeeId;

      await updatePostById(id, {
        title: formData.title,
        newsContent: formData.content,
        category: formData.category,
        file: formData.file,
        status: formData.status,
        url: formData.url,
        seoTitle: formData.seoTitle,
        seoMetaDescription: formData.seoMetaDescription,

    
        authorName: originalPost.authorName,
        publishedBy: originalPost.publishedBy,
        updatedBy: employeeId,
      });

      alert('Post updated successfully!');
      router.push('/posts');
    } catch (err) {
      alert('Failed to update post: ' + err.message);
    }
  };

  return (
    <div className="edit-post-container">
      <h1 className="edit-post-title">Edit Post</h1>
      <form onSubmit={handleSubmit} className="edit-post-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={5}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">URL</label>
          <input
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seoTitle" className="form-label">SEO Title</label>
          <input
            id="seoTitle"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="seoMetaDescription" className="form-label">SEO Meta Description</label>
          <input
            id="seoMetaDescription"
            name="seoMetaDescription"
            value={formData.seoMetaDescription}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Pending">Pending</option>
            <option value="Published">Published</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="file" className="form-label">Image URL</label>
          <input
            id="file"
            name="file"
            value={formData.file}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostPage;
