'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  getAllCategories,
  getPostsByCategoryId,
  getEmployeeById,
  getAllTags,
} from '../../services/Api';
import CategoryBar from '@/app/components/CategoryBar';
import Footer from '@/app/components/Footer';
import '../../Styles/PostDisplay.css';
import { useRouter } from 'next/navigation';

export default function CategoryPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [authorMap, setAuthorMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 20;
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
        const published = res.newsList
          .filter((p) => p.status === 'Published')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const tagsRes = await getAllTags();
        const tagMap = {};
        tagsRes?.Tags?.forEach((tag) => {
          tagMap[tag._id] = tag.name;
        });

        const postsWithTags = published.map((p) => ({
          ...p,
          tags: (Array.isArray(p.tags) ? p.tags : [p.tags]).map(
            (tagId) => tagMap[tagId] || 'Unknown Tag'
          ),
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

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div style={{ background: '#fff' }}>
      <div className="category-title">
        <CategoryBar />
      </div>
      <div className="category-page">
        <h2 className="category-heading">{category.replace(/-/g, ' ')}</h2>
        <div className="post-list">
          {currentPosts.map((post) => (
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
                    {post.newsContent.replace(/<[^>]+>/g, "").slice(0, 100)}...
                  </p>                                            
               <p className="post-footer">
                  {post.tags?.join(', ')} ·{' '}
                  {Math.ceil(post.newsContent.split(' ').length / 100)} min read
                </p>
              </div>
              <div className="post-right">
                <Image
                  src={post.file}
                  alt={post.title}
                  width={1200}
                  height={675}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {posts.length > postsPerPage && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              const shouldShow =
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1;

              if (shouldShow) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={page === currentPage ? 'active' : ''}
                  >
                    {page}
                  </button>
                );
              } else if (
                (page === currentPage - 2 && page > 2) ||
                (page === currentPage + 2 && page < totalPages - 1)
              ) {
                return <span key={page}>...</span>;
              }

              return null;
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
