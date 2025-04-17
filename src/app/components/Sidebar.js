"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser, FaFileAlt, FaPlus, FaListAlt, FaTags, FaInfoCircle, FaPhotoVideo, FaChartBar, FaPenFancy } from "react-icons/fa";
import "../Styles/Sidebar.css";

const Sidebar = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

  return (
    <>
      <div className="topnav">
        <div className="nav-left">
          <Image src="/News4-logo.png" alt="Logo" width={100} height={150} />
        </div>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/allposts">All Posts</Link>
          <Link href="/category/state">State</Link>
          <Link href="/category/national">National</Link>
          <Link href="/category/politics">Politics</Link>
          <Link href="/category/cinema">Cinema</Link>
          <Link href="/category/sports">Sports</Link>
        </div>

        <div className="nav-right">
          <p className="datetime">
            <span className="day">{day}, </span>
            <span className="date">{date}, </span>
            <span className="time">{time}</span>
          </p>
          <FaUser className="user-icon" />
        </div>
      </div>

      <div className="sidebar">
        <div className="sidebar-section">
          <Link href="/posts" className="sidebar-link">
            <FaPenFancy className="sidebar-icon" />
            Posts
          </Link>
          <div className="sidebar-submenu">
            <Link href="/all-posts" className="sidebar-sublink">
              All Posts
            </Link>
            <Link href="/add-new-post" className="sidebar-sublink">
              Add New Post
            </Link>
            <Link href="/category" className="sidebar-sublink">
              Category
            </Link>
            <Link href="/tags" className="sidebar-sublink">
              Tags
            </Link>
          </div>
        </div>
        <Link href="/media" className="sidebar-link">
          <FaPhotoVideo className="sidebar-icon" />
          Media
        </Link>
        <Link href="/report" className="sidebar-link">
          <FaChartBar className="sidebar-icon" />
          Report
        </Link>
        <Link href="/details" className="sidebar-link">
          <FaInfoCircle className="sidebar-icon" />
          Details
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
