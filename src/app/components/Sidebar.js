"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaInfoCircle, FaCashRegister, FaPenFancy } from "react-icons/fa";
import "../Styles/Sidebar.css";
import { logout, getAllPosts } from "../services/Api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [currentTime, setCurrentTime] = useState({ day: "", date: "", time: "" });
  const [designation, setDesignation] = useState();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState();
  const [todayPostCount, setTodayPostCount] = useState(0);
  const [workSpeed, setWorkSpeed] = useState(0);
  const [avgTimePerPost, setAvgTimePerPost] = useState(0);
  const [weeklyPostCount, setWeeklyPostCount] = useState(0);

  const router = useRouter();

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

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const userData = localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        const allPosts = await getAllPosts();

        if (user && allPosts?.length) {
          const today = new Date().toISOString().split("T")[0];
          const startOfWeek = new Date();
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
          const weekStart = startOfWeek.toISOString().split("T")[0];

          const userPosts = allPosts.filter(post => post.updatedBy === user._id);

          const todayPosts = userPosts.filter(post => post.createdAt?.startsWith(today));
          const weekPosts = userPosts.filter(post => post.createdAt?.slice(0, 10) >= weekStart);

          setTodayPostCount(todayPosts.length);
          setWeeklyPostCount(weekPosts.length);

          if (todayPosts.length > 0) {
            const times = todayPosts.map(post => new Date(post.updatedAt) - new Date(post.createdAt));
            const totalTimeMs = times.reduce((sum, time) => sum + time, 0);
            const avgTimeMin = Math.round(totalTimeMs / todayPosts.length / 60000);
            const now = new Date();
            const firstPostTime = new Date(todayPosts[0].createdAt);
            const hoursWorked = Math.max((now - firstPostTime) / 3600000, 1);

            setAvgTimePerPost(avgTimeMin);
            setWorkSpeed((todayPosts.length / hoursWorked).toFixed(1));
          }
        }
      } catch (error) {
        console.error("Metric error:", error);
      }
    };

    fetchMetrics();
  }, []);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <div>
      <div className="topnav">
        <div className="nav-left">
          <Image src="/assets/News4-logo.png" alt="Logo" width={120} height={110} className="logo" priority />
        </div>
        <div className="nav-links">
          <div className="name-display">
            👋 Hi,<strong>{name} / {designation}</strong>
            📝 Posts: {todayPostCount} Today | ⚡ Speed: {workSpeed} Posts/hour
            ⏱️ Avg: {avgTimePerPost} min/post | 📅 This Week: {weeklyPostCount} Posts
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
        {showLogoutModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Are you sure you want to logout?</p>
              <div className="modal-buttons">
                <button onClick={closeLogoutModal} className="modal-btn cancel-btn">Cancel</button>
                <button
                  onClick={async () => {
                    const result = await logout();
                    if (result.success) {
                      localStorage.removeItem("user");
                      router.push("/login");
                    } else {
                      alert("Logout failed: " + result.message);
                    }
                  }}
                  className="modal-btn logout-btn"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={openLogoutModal}
          className="sidebar-link logout-button"
          style={{
            cursor: "pointer",
            background: "none",
            border: "none",
            color: "whitesmoke",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FaSignOutAlt className="sidebar-icon" />
          Logout
        </button>
      </div>
    </div>
  );
};
