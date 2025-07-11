'use client';
import React from 'react';
import Image from "next/image";
import { FaGlobe, FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import '../Styles/HomeNavBar.css';
import Link from 'next/link';


export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <Image src="/assets/News4-logo.png" alt="News4 Tamil" className="footer-logo"  width={1200} height={675}/>
          <h1 className="footer-brand">
            <span className="news4-red">NEWS4</span> <span className="tamil-green">TAMIL</span>
          </h1>
        </div>

        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/">About Us</Link>
          <Link href="/">Contact</Link>
          <Link href="/">Terms & Conditions</Link>
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
