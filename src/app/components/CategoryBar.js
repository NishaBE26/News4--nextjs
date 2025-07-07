'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { getAllCategories, getAllPosts } from '../services/Api';
import '../Styles/HomeNavBar.css';

export default function CategoryBar({ showSearch, navbarOpen }) {
  const [categories, setCategories] = useState([]);
  const [underlineWidth, setUnderlineWidth] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);

  const router = useRouter();

  // Capitalize first letter of every word
  const toAllCaps = (text) => text.toUpperCase();


  useEffect(() => {
    const fetchData = async () => {
      const postsRes = await getAllPosts();
      const categoriesRes = await getAllCategories();
      const postList = postsRes?.newsList || [];
      const categoryList = categoriesRes?.categories || [];

      setAllPosts(postList);
      setAllCategories(categoryList);

      const customOrder = [
        'Home', 'Breaking News', 'Tamilnadu', 'India', 'World', 'Politics',
        'Sports', 'Cinema', 'Lifestyles', 'Health Tips', 'Astrology'
      ];

      const filteredList = categoryList.filter(cat =>
        customOrder.some(name => name.toLowerCase() === cat.name.toLowerCase())
      );

      const sortByOrder = (a, b) =>
        customOrder.findIndex(name => name.toLowerCase() === a.name.toLowerCase()) -
        customOrder.findIndex(name => name.toLowerCase() === b.name.toLowerCase());

      const sorted = [...filteredList].sort(sortByOrder);
      const withHome = [{ _id: 'home-static', name: 'Home' }, ...sorted.filter(c => c.name.toLowerCase() !== 'home')];

      setCategories(withHome);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, Math.max(10, (scrollTop / docHeight) * 100));
      setUnderlineWidth(scrollPercent);
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  useEffect(() => {
    const normalize = (text) => text.toLowerCase().trim().replace(/\s+/g, ' ');

    const term = normalize(searchTerm);

    const matchedPosts = allPosts
      .filter(p => normalize(p.title || '').includes(term))
      .map(p => ({ ...p, type: 'post' }));

    const matchedCategories = allCategories
      .filter(c => normalize(c.name || '').includes(term))
      .map(c => ({ ...c, type: 'category' }));

    setFilteredResults([...matchedCategories, ...matchedPosts]);
  }, [searchTerm, allPosts, allCategories]);

  const handleSearchClick = (item) => {
    if (!item || !item.type) return;

    if (item.type === 'category') {
      const slug = item.name.toLowerCase().replace(/\s+/g, '-');
      router.push(`/category/${slug}`);
    } else if (item.type === 'post') {
      router.push(`/Mainpost?id=${item._id}&category=${item.category}`);
    }

    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const firstResult = filteredResults[0];
      if (firstResult) handleSearchClick(firstResult);
    }
  };

  return (
    <div className={`categorymenu ${navbarOpen ? 'hide-category' : ''}`}>
      {showSearch && (
        <div className="search-container">
          <div className="search-box-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search news or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <FaSearch
              className="search-icon-right"
              onClick={() => handleSearchClick(filteredResults[0])}
            />
          </div>
          {searchTerm && (
            <div className="search-results">
              {filteredResults.length > 0 ? (
                filteredResults.map((item, index) => (
                  <div
                    key={index}
                    className="search-result-item"
                    onClick={() => handleSearchClick(item)}
                  >
                    {item.type === 'category'
                      ? `Category: ${toAllCaps(item.name)}`
                      : `Post: ${toAllCaps(item.title)}`}

                  </div>
                ))
              ) : (
                <div className="search-no-results">No matching categories or posts.</div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="category-bar">
        {categories.map(cat => (
          <span
            key={cat._id}
            className="category-item"
            onClick={() => {
              const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
              router.push(cat.name.toLowerCase() === 'home' ? '/' : `/category/${slug}`);
            }}
          >
            {toAllCaps(cat.name)}
          </span>
        ))}
        <div className="category-underline" style={{ width: `${underlineWidth}%` }} />
      </div>
    </div>
  );
}
