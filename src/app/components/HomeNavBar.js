// components/HomeNavBar.js
'use client';
import React, { useState, useEffect } from 'react';
import { VscThreeBars, VscChromeClose } from "react-icons/vsc";
import { FaSearch, FaUserCircle, FaGlobe, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getAllCategories } from '../services/Api';
import { useRouter } from 'next/navigation';
import '../Styles/HomeNavBar.css';

export default function HomeNavBar({ showsearch, setShowSearch, activeCategory }) {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

  const toggleNavbar = () => setNavbarOpen(!navbarOpen);
  const handleLoginClick = () => router.push('/login');

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
    document.body.style.overflow = navbarOpen ? "hidden" : "auto";
  }, [navbarOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.more-categories')) setShowMore(false);
    };
    if (showMore) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMore]);

  return (
    <div className={`home ${navbarOpen ? "navbar-open" : ""}`}>
      {/* Sticky wrapper starts */}
      <div className="sticky-header-wrapper">
        <header className="home-header">
          <div className="header-left">
            <button className="navbar-toggle" onClick={toggleNavbar}><VscThreeBars /></button>
          </div>
          <div className="header-center">
            <img src="/assets/News4-logo.png" alt="News4 Tamil" />
            <h1 className="brand-text">
              <span className="news4">NEWS4</span> <span className="tamil">TAMIL</span>
            </h1>
          </div>
          <div className="header-right">
            <button className="search-button" onClick={() => setShowSearch(prev => !prev)}><FaSearch /></button>
            <button className="login-button" onClick={handleLoginClick}><FaUserCircle /></button>
          </div>
        </header>

        <div className="category-bar">
          {categories.slice(0, 11).map(cat => (
            <span
              key={cat._id}
              className={`category-item ${activeCategory === cat.name.toLowerCase().replace(/\s+/g, '') ? 'active' : ''}`}
            >
              {cat.name}
            </span>
          ))}
          {categories.length > 11 && (
            <div className="more-categories">
              <span className="more-icon" onClick={() => setShowMore(prev => !prev)}><BsThreeDotsVertical /></span>
              {showMore && (
                <div className="dropdown">
                  {categories.slice(11).map(cat => (
                    <div key={cat._id} className="dropdown-item">{cat.name}</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showsearch && (
        <div className="search-container">
          <input type="text" className="search-input" placeholder="Search news or categories..." />
        </div>
      )}

      {navbarOpen && <div className="overlay" onClick={toggleNavbar}></div>}

      {navbarOpen && (
        <aside className="sidebar-home">
          <button className="close-btn" onClick={toggleNavbar}><VscChromeClose /></button>
          <div className='sidebaricon'>
            <img src="/assets/News4-logo.png" alt="News4 Tamil" />
            <h1 className="text"><span className="news4-sidebar">NEWS4</span> <span className="tamil-sidebar">TAMIL</span></h1>
          </div>
          <nav className="sidebar-nav">
            <ul>
              {categories.map((cat) => <li key={cat._id}>{cat.name}</li>)}
            </ul>
          </nav>
          <div className="social-icons">
            <a href="https://news4tamil.com/" target="_blank" rel="noopener noreferrer" className="nav-icon website"><FaGlobe /></a>
            <a href="https://www.instagram.com/news4tamillive" target="_blank" rel="noopener noreferrer" className="nav-icon instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/share/1GBDKfKBSU/" target="_blank" rel="noopener noreferrer" className="nav-icon facebook"><FaFacebookF /></a>
            <a href="https://youtube.com/@news4tamil" target="_blank" rel="noopener noreferrer" className="nav-icon youtube"><FaYoutube /></a>
          </div>
        </aside>
      )}
    </div>
  );
}
