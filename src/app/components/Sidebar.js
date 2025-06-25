"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaInfoCircle,
  FaCashRegister,
  FaPenFancy,
  FaUser,
  FaFacebookF,
  FaInstagram,
  FaGlobe,
  FaYoutube,
  FaBars,
} from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import "../Styles/Sidebar.css";
import { logout, getEmployeeById, getAllCategories } from "../services/Api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const [loggedEmployeeId, setLoggedEmployeeId] = useState();
  const [employeephoto, setEmployeePhoto] = useState();
  const [currentTime, setCurrentTime] = useState({ day: "", date: "", time: "" });
  const [designation, setDesignation] = useState();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [name, setName] = useState();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const profileRef = useRef();
  const router = useRouter();

  const toggledarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setDesignation(user.designation);
      setName(user.name);
      setLoggedEmployeeId(user.employeeId);
      const fetchProfilePhoto = async () => {
        try {
          const value = await getEmployeeById(user.employeeId);
          if (value && value.photo) setEmployeePhoto(value.photo);
        } catch (error) {
          console.error("Error fetching employee photo:", error);
        }
      };
      const fetchCategories = async () => {
        try {
          const categoriesResponse = await getAllCategories();
          if (categoriesResponse?.categories) {
            setCategories(categoriesResponse.categories);
          }
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchProfilePhoto();
      fetchCategories();
    }

    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
    if (savedMode) document.documentElement.classList.add("dark");

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
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogoutModal = () => setShowLogoutModal(true);
  const closeLogoutModal = () => setShowLogoutModal(false);

  return (
    <div>
      {/* Top Navigation */}
      <div className="topnav">
        <div className="nav-left">
          <div className="hamburger-icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <FaBars />
          </div>
          <Image src="/assets/News4-logo.png" alt="Logo" width={120} height={0} className="logo" priority />
        </div>
        <div className="nav-center">
          <Link href="/posts/AllPosts" className="nav-page">All posts</Link>
          <span className="divider">|</span>
          <div className="nav-dropdown">
            <button className="nav-page dropdown-toggle">Categories</button>
            <div className="dropdown-menu">
              {categories.map((category) => (
                <Link
                  href={`/posts/Category/${category._id}`}
                  className="dropdown-item"
                  key={category._id}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="dark-mode-toggle" onClick={toggledarkMode}>
          {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
        </div>
        <div className="name-display">
          👋 Hi, <strong>{name} / {designation}</strong>
        </div>
        <div className="nav-right" ref={profileRef}>
          <p className="datetime">
            <span className="day">{currentTime.day}, </span>
            <span className="date">{currentTime.date}, </span>
            <span className="time">{currentTime.time}</span>
          </p>
          <div className="social-icons-container">
            <a href="https://news4tamil.com/" target="_blank" rel="noopener noreferrer" className="nav-icon website"><FaGlobe /></a>
            <a href="https://www.instagram.com/news4tamillive" target="_blank" rel="noopener noreferrer" className="nav-icon instagram"><FaInstagram /></a>
            <a href="https://www.facebook.com/share/1GBDKfKBSU/" target="_blank" rel="noopener noreferrer" className="nav-icon facebook"><FaFacebookF /></a>
            <a href="https://youtube.com/@news4tamil" target="_blank" rel="noopener noreferrer" className="nav-icon youtube"><FaYoutube /></a>
          </div>
          <div className="profile-container" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ cursor: "pointer" }}>
            {employeephoto ? (
              <img src={employeephoto} alt="User" width={40} height={40} className="user-photo" style={{ borderRadius: "50%" }} />
            ) : (
              <div className="user-initial" style={{
                width: "35px",
                height: "35px",
                backgroundColor: "#888",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                fontWeight: "bold",
                fontSize: "18px",
              }}>
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            {showProfileMenu && (
              <div className="profile-dropdown">
                <Link href="/posts/Profile" className="dropdown-item"><FaUser /> Profile</Link>
                <button onClick={openLogoutModal} className="dropdown-item"><IoLogOut /> Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <div className="sidebar-section">
          <Link href="/posts" className="sidebar-link"><FaPenFancy className="sidebar-icon" /> Posts</Link>
          <div className="sidebar-submenu" style={{ marginTop: "-8px" }}>
            <Link href="/posts/AddNewPost" className="sidebar-sublink">Add New Post</Link>
            <Link href="/posts/CategoryPage" className="sidebar-sublink">Category</Link>
            <Link href="/posts/TagsPage" className="sidebar-sublink">Tags</Link>
            <Link href="/posts/StatusPage" className="sidebar-sublink">Status</Link>
            {designation === "admin" && (
              <>
                <Link href="/posts/Type" className="sidebar-sublink">Type</Link>
                <Link href="/posts/TaskList" className="sidebar-sublink">Task List</Link>
              </>
            )}
          </div>
        </div>

        {designation === "admin" && (
          <>
            <Link href="/posts/EmployeeRegister" className="sidebar-link"><FaCashRegister className="sidebar-icon" /> Register</Link>
            <Link href="/posts/EmployeeDetails" className="sidebar-link"><FaInfoCircle className="sidebar-icon" /> Details</Link>
          </>
        )}

        <Link href="/posts/Profile" className="sidebar-link"><FaUser className="sidebar-icon" /> Profile</Link>
        <Link href="#" onClick={(e) => { e.preventDefault(); openLogoutModal(); }} className="sidebar-link">
          <IoLogOut className="sidebar-icon" /> Logout
        </Link>
      </div>
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Logout Modal */}
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
    </div>
  );
}
