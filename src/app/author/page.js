'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getAllPosts,
  getEmployeeById,
  getAllCategories
} from '../services/Api';
import CategoryBar from '../components/CategoryBar';
import Footer from '../components/Footer';
import '../Styles/PostDisplay.css';

export default function AuthorPosts() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get('id');
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState(null);

  useEffect(() => {
    if (authorId) {
      getEmployeeById(authorId).then(setAuthor);

      Promise.all([getAllPosts(), getAllCategories()]).then(
        ([postRes, catRes]) => {
          const categoryMap = {};
          catRes.categories.forEach((cat) => {
            categoryMap[cat._id] = cat.name;
          });

          const filtered = postRes.newsList
            ?.filter(
              (p) => p.authorName === authorId && p.status === 'Published'
            )
            ?.sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
            ?.map((p) => ({
              ...p,
              categoryName: categoryMap[p.category] || 'பிரிவு'
            }));
          setPosts(filtered || []);

          const categoryCounts = {};
          (filtered || []).forEach((post) => {
            const cat = post.categoryName || 'பிரிவு';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
          });
        }
      );
    }
  }, [authorId]);

  if (!author) return null;

  // Get one post per category with count
  const uniqueCategoryPosts = [...new Set(posts.map((p) => p.categoryName))].map((categoryName) => {
    const firstPost = posts.find((p) => p.categoryName === categoryName);
    const count = posts.filter((p) => p.categoryName === categoryName).length;
    return { ...firstPost, categoryPostCount: count };
  });

  return (
    <div className="mainpost-left">
      <div className="author-category">
        <CategoryBar />
      </div>

      {/* Author Profile Section */}
      <div className='author-box-wrapper'>
        <div className="author-profile-top">
          <img
            src={author.photo}
            alt={author.name}
            className="author-profile-img"
          />
          <div>
            <h2 className="author-heading">{author.name}</h2>
            <p className="author-sub">Written Articles ({posts.length})</p>
            <p className='author-desc'>பல பிரிவுகளில் சரியான நேரத்தில் மற்றும் ஈடுபாட்டுடன் கூடிய செய்திகளை வழங்கும்
              ஆர்வமுள்ள டிஜிட்டல் உள்ளடக்க எழுத்தாளர். </p>
          </div>
        </div>
      </div>

      {/* Post Grid */}
      <div className="author-posts-grid">
        {uniqueCategoryPosts.map((post, index) => (
          <div key={post._id} className="styled-post-card">
            <div className="category-label">
              {post.categoryName} ({post.categoryPostCount})
            </div>
            <div
              onClick={() => router.push(`/Mainpost?id=${post._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={post.file}
                alt={post.title}
                className="styled-thumbnail"
              />
              <p className="styled-title">{post.title}</p>
            </div>
            <div className="post-footer">
              <span className="post-date">
                {new Date(post.createDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}
