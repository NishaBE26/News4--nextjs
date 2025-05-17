"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaInfoCircle, FaPhotoVideo, FaChartBar, FaPenFancy, FaCog } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "../Styles/Sidebar.css";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [currentTime, setCurrentTime] = useState({ day: "", date: "", time: "" });
  useEffect (() => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
setCurrentTime({ day, date, time });
}, []);
  return (
    <div>
      <div className="topnav">
        <div className="nav-left">
          <Image src="/assets/News4-logo.png" alt="Logo" width={100} height={100} priority />
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
            <span className="day">{currentTime.day}, </span>
            <span className="date">{currentTime.date}, </span>
            <span className="time">{currentTime.time}</span>
          </p>
          <FaUser className="user-icon" />
        </div>
      </div>
      <div className="sidebar">
        <Link href="/dashboard" className="sidebar-link">
          <MdDashboard className="sidebar-icon" />
          Dashboard
        </Link>
        <div className="sidebar-section">
          <Link href="/posts" className="sidebar-link">
            <FaPenFancy className="sidebar-icon" />
            Posts
          </Link>
          <div className="sidebar-submenu" style={{ marginTop: "-8px" }}>
            <Link href="/posts/AllPostsPage" className="sidebar-sublink">
              All Posts
            </Link>
            <Link href="/posts/AddNewPost" className="sidebar-sublink">
              Add New Post
            </Link>
            <Link href="/posts/CategoryPage" className="sidebar-sublink">
              Category
            </Link>
            <Link href="/posts/TagsPage" className="sidebar-sublink">
              Tags
            </Link>
            <Link href ="/posts/StatusPage" className="sidebar-sublink">
              Status
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
        <Link href="/settings" className="sidebar-link">
          <FaCog className="sidebar-icon" />
          Settings
        </Link>
        <Link href="/logout" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          Profile
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
