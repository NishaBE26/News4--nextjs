'use client';
import React from 'react';
import { FaGlobe, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import '../Styles/HomeNavBar.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <img src="/assets/News4-logo.png" alt="News4 Tamil" className="footer-logo" />
          <h1 className="footer-brand">
            <span className="news4-red">NEWS4</span> <span className="tamil-green">TAMIL</span>
          </h1>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms & Conditions</a>
        </div>
      </div>

      <div className="footer-social">
        <a href="https://news4tamil.com/" target="_blank" rel="noopener noreferrer"><FaGlobe /></a>
        <a href="https://www.instagram.com/news4tamillive" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://www.facebook.com/share/1GBDKfKBSU/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://youtube.com/@news4tamil" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
      </div>

      <div className="footer-bottom">
        <p>© 2025 <span className="news4-red">News4</span><span className="tamil-green">Tamil</span>. All rights reserved.</p>
      </div>
    </footer>
  );
}
