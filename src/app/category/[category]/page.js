'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  getAllCategories,
  getPostsByCategoryId,
  getEmployeeById,
  getAllTags
} from '../../services/Api';
import CategoryBar from '@/app/components/CategoryBar';
import Footer from '@/app/components/Footer';
import '../../Styles/PostDisplay.css';
import { useRouter } from 'next/navigation';

export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorMap, setAuthorMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await getAllCategories();
        const matchCat = cats.categories.find(
          (c) => c.name.toLowerCase().replace(/\s+/g, '-') === category
        );
        if (!matchCat) return;

        const res = await getPostsByCategoryId(matchCat._id);
        const published = res.newsList.filter((p) => p.status === 'Published');

        const tagsRes = await getAllTags();
        const tagMap = {};
        tagsRes?.Tags?.forEach((tag) => {
          tagMap[tag._id] = tag.name;
        });

        const postsWithTags = published.map((p) => ({
          ...p,
          tags: (Array.isArray(p.tags) ? p.tags : [p.tags]).map(
            (tagId) => tagMap[tagId] || 'Unknown Tag'
          )
        }));

        setPosts(postsWithTags);

        const authorIds = [...new Set(published.map((p) => p.authorName))];
        const authorData = await Promise.all(
          authorIds.map((id) => getEmployeeById(id))
        );
        const map = {};
        authorIds.forEach((id, i) => {
          map[id] = authorData[i]?.name || 'Unknown';
        });
        setAuthorMap(map);
      } catch (error) {
        console.error('Error fetching category page data:', error);
      }
    };

    fetchData();
  }, [category]);

  return (
    <div style={{ background: '#fff' }}>
      <div className="category-title">
        <CategoryBar />
      </div>
      <div className="category-page">
        <h2 className="category-heading">{category.replace(/-/g, ' ')}</h2>
        <div className="post-list">
          {posts.map((post) => (
            <div
              key={post._id}
              className="post-item-category"
              onClick={() =>
                router.push(`/Mainpost?id=${post._id}&category=${category}`)
              }
            >
              <div className="post-left">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">
                  {post.newsContent.slice(0, 100)}...
                </p>
                <p className="post-footer">
                  {post.tags?.join(', ') || 'No tags'} ·{' '}
                  {Math.ceil(post.newsContent.split(' ').length / 100)} min read
                </p>
              </div>
              <div className="post-right">
                <img
                  src={post.file || '/default-image.jpg'}
                  alt={post.title}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
