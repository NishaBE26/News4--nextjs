'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  getPostById,
  getAllPosts,
  getEmployeeById,
  getAllCategories,
  getPostsByCategoryId,
  getCategoryById
} from '../services/Api';
import Footer from '../components/Footer';
import CategoryBar from '../components/CategoryBar';
import '../Styles/PostDisplay.css';

export default function MainPost() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('id');
  const categorySlug = searchParams.get('category');

  const [post, setPost] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [latestPosts, setLatestPosts] = useState([]);
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [authorName, setAuthorName] = useState('Unknown');
  const [authorPhoto, setAuthorPhoto] = useState(null);

  const slugify = (str) => str?.toLowerCase().replace(/\s+/g, '-');

  // Fetch current post details
  useEffect(() => {
    if (postId) {
      getPostById(postId).then(async (res) => {
        const newsPost = res?.news;
        setPost(newsPost);

        // Fetch author details
        if (newsPost?.authorName) {
          const authorRes = await getEmployeeById(newsPost.authorName);
          setAuthorName(authorRes?.name || 'Unknown');
          setAuthorPhoto(authorRes?.photo || null);
        }

        // Fetch category name by ID
        if (newsPost?.category) {
          const catRes = await getCategoryById(newsPost.category);
          setCategoryName(catRes?.category?.name || '');
        }
      });
    }
  }, [postId]);

  // Fetch related posts
  useEffect(() => {
    // Always fetch all latest posts
    getAllPosts().then((res) => {
      const posts = res.newsList
        ?.filter((p) => p.status === 'Published')
        ?.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
      setLatestPosts(posts);
    });

    // Fetch posts under current category (by slug)
    const fetchCategoryPosts = async () => {
      const allCats = await getAllCategories();
      const matchCat = allCats.categories.find(
        (cat) => slugify(cat.name) === slugify(categorySlug)
      );

      if (matchCat?._id) {
        const res = await getPostsByCategoryId(matchCat._id);
        const published = res?.newsList
          ?.filter((p) => p.status === 'Published')
          ?.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
        setCategoryPosts(published);
        setCategoryName(matchCat.name);
      }
    };

    if (categorySlug) fetchCategoryPosts();
  }, [categorySlug]);

  const handlePostClick = (id) => {
    router.push(`/Mainpost?id=${id}${categorySlug ? `&category=${categorySlug}` : ''}`);
  };

  if (!post || !post.title) return null;

  const relatedPosts = categorySlug ? categoryPosts : latestPosts;
  const filteredPosts = relatedPosts.filter((p) => p._id !== postId).slice(0, 6);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', width: '100%' }}>
      <div className="category">
        <CategoryBar />
      </div>

      <div className="mainpost-container">
        {/* Left */}
        <div className="mainpost-left">
          <h1 className="post-category">{categoryName}</h1>
          <h1 className="post-title">{post.title}</h1>
          <p className="author-date">
            By{' '}
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/author?id=${post?.authorName}`)}
            >
              {authorName}
            </span>{' '}
            | Posted on{' '}
            {post?.createDate
              ? new Date(post.createDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
              : 'Unknown date'}
          </p>
          <img
            src={post?.file}
            alt={post?.title}
            className="main-image"
          />
          <div
            className="news-content"
            dangerouslySetInnerHTML={{ __html: post.newsContent }}
          />
          {authorPhoto && (
            <div className="author-box">
              <img
                src={authorPhoto}
                alt={authorName}
                className="author-photo"
                onClick={() => router.push(`/author?id=${post?.authorName}`)}
                style={{ cursor: "pointer" }}
              />
              <div className="author-info">
                <p className="author-name">{authorName}</p>
                <span className="author-department">Digital Content Writer</span>
              </div>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="mainpost-right">
          <h3 className="display-title">Latest {categoryName || 'Posts'}</h3>
          <ul>
            {filteredPosts.map((item) => (
              <li key={item._id}>
                <img src={item.file} alt={item.title} />
                <span
                  onClick={() => handlePostClick(item._id)}
                  className="latest-post-link"
                >
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
