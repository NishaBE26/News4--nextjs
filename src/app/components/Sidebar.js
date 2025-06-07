"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaInfoCircle, FaCashRegister, FaPenFancy } from "react-icons/fa";
import "../Styles/Sidebar.css";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const [currentTime, setCurrentTime] = useState({ day: "", date: "", time: "" });
  const [designation, setDesignation] = useState();
  const [name, setName] = useState();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setDesignation(user.designation);
      setName(user.name);
    }

    let frameId;

    const updateTime = () => {
      const now = new Date();
      const day = now.toLocaleDateString("en-US", { weekday: "long" });
      const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      setCurrentTime({ day, date, time });
      frameId = requestAnimationFrame(updateTime);
    };

    updateTime();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div>
      <div className="topnav">
        <div className="nav-left">
          <Image src="/assets/News4-logo.png" alt="Logo" width={100} height={80} priority />
        </div>
        <div className="nav-links">
          <div className="name-display">
            👋 Hi,<strong>{name} / {designation}</strong>
          </div>
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
        <div className="sidebar-section">
          <Link href="/posts" className="sidebar-link">
            <FaPenFancy className="sidebar-icon" />
            Posts
          </Link>
          <div className="sidebar-submenu" style={{ marginTop: "-8px" }}>
            <Link href="/posts/AddNewPost" className="sidebar-sublink">Add New Post</Link>
            <Link href="/posts/CategoryPage" className="sidebar-sublink">Category</Link>
            <Link href="/posts/TagsPage" className="sidebar-sublink">Tags</Link>
            <Link href="/posts/StatusPage" className="sidebar-sublink">Status</Link>
            {designation === "admin" && (
              <>
                <Link href="/posts/TaskList" className="sidebar-sublink">Task List</Link>
                <Link href="/posts/Type" className="sidebar-sublink">Type</Link>
              </>
            )}
          </div>
        </div>

        {designation === "admin" && (
          <>
            <Link href="/posts/EmployeeRegister" className="sidebar-link">
              <FaCashRegister className="sidebar-icon" />
              Register
            </Link>
            <Link href="/posts/EmployeeDetails" className="sidebar-link">
              <FaInfoCircle className="sidebar-icon" />
              Details
            </Link>
          </>
        )}

        <Link href="/posts/Profile" className="sidebar-link">
          <FaSignOutAlt className="sidebar-icon" />
          Profile
        </Link>
      </div>
    </div>
  );
};
