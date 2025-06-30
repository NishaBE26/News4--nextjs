'use client';
import React, { useState, useEffect } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { getAllCategories } from '../services/Api';
import { useRouter } from 'next/navigation';
import '../Styles/HomeNavBar.css';

export default function CategoryBar({ showSearch, navbarOpen }) {
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [underlineWidth, setUnderlineWidth] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories();
      const customOrder = [
        "Home", "Breaking News", "Tamilnadu", "India", "World",
        "Sports", "Cinema", "Lifestyles", "Health Tips", "Astrology"
      ];
      let catList = Array.isArray(data) ? data : data?.categories || [];
      const sortByCustomOrder = (a, b) => {
        const indexA = customOrder.findIndex(name => name.toLowerCase() === a.name.toLowerCase());
        const indexB = customOrder.findIndex(name => name.toLowerCase() === b.name.toLowerCase());
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      };
      const sortedCategories = [...catList].sort(sortByCustomOrder);
      const filtered = sortedCategories.filter(cat => cat.name.toLowerCase() !== "home");
      const withHome = [{ _id: 'home-static', name: 'Home' }, ...filtered];
      setCategories(withHome);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.more-categories')) setShowMore(false);
    };
    if (showMore) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMore]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, Math.max(10, (scrollTop / docHeight) * 100));
      setUnderlineWidth(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`categorymenu ${navbarOpen ? 'hide-category' : ''}`}>
      <div className="category-bar">
        {categories.slice(0, 11).map(cat => (
          <span
            key={cat._id}
            className="category-item"
            onClick={() => {
              if (cat.name.toLowerCase() === 'home') {
                router.push('/');
              } else {
                router.push(`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`);
              }
            }}
          >
            {cat.name}
          </span>
        ))}

        {categories.length > 11 && (
          <div className="more-categories">
            <span className="more-icon" onClick={() => setShowMore(prev => !prev)}>
              <BsThreeDotsVertical />
            </span>
            {showMore && (
              <div className="dropdown">
                {categories.slice(11).map(cat => (
                  <div
                    key={cat._id}
                    className="dropdown-item"
                    onClick={() =>
                      router.push(`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`)
                    }
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showSearch && (
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search news or categories..." />
        </div>
      )}
    </div>
  );
}
