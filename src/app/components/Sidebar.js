"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
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
          <Link href="/posts">Posts</Link>
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
        <Link href="/posts" className="sidebar-link">
          All Posts
        </Link>
        <Link href="addpost" className="sidebar-link">
          Add Post
        </Link>
        <Link href="Category" className="sidebar-link">
          Category
        </Link>
        <Link href="Tags" className="sidebar-link">
          Tags
        </Link>
        <Link href="details" className="sidebar-link">
          Details
        </Link>
        <Link href="report" className="sidebar-link">
          Report
        </Link>
        <Link href="settings" className="sidebar-link">
          Settings
        </Link>
        <Link href="profile" className="sidebar-link">
          Profile
        </Link>
      </div>
    </>
  );
};

export default Sidebar;
