"use client";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPosts,
  deletePostById,
  getCategoryById,
  getEmployeeById,
  getAllEmployees,
  createTask,
  getAllTypes,
  getAllStatus,
  updatePostById,
} from "../services/Api";
import TaskAssign from "../posts/TaskAssign/page";
import PostsTable from "./PostsTable/page";
import TaskNotification from "../posts/TaskNotification/page";
import { FaUser, FaClock } from "react-icons/fa";
import "../Styles/posts.css";

const PublishedPostsCardGrid = ({ posts, employeeNames }) => {
  const carouselRef = useRef();

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <div className="carousel-wrapper">
      <button className="nav-button" onClick={scrollLeft}>
        &lt;
      </button>

      <div className="carousel" ref={carouselRef}>
        {posts.map((post) => {
          const d = new Date(post.createDate);
          const dateStr = `${String(d.getDate()).padStart(2, "0")}.${String(
            d.getMonth() + 1
          ).padStart(2, "0")}.${d.getFullYear()}`;

          return (
            <div key={post._id} className="post-card">
              <img
                src={post.file || "/placeholder.png"}
                alt={post.title}
                className="post-card-image"
              />
              <div className="vertical-line" />
              <div className="post-card-content">
                <Link href={`/news/${post._id}`}>
                  <h3 className="post-card-title">{post.title}</h3>
                </Link>
                <p className="post-card-author">
                  <FaUser style={{ marginRight: "6px", verticalAlign: "middle" }} />
                  {employeeNames[post.authorName] || "Unknown"}
                </p>
                <p className="post-card-date">
                  <FaClock style={{ marginRight: "6px", verticalAlign: "middle" }} />
                  {dateStr}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="nav-button" onClick={scrollRight}>
        &gt;
      </button>
    </div>
  );
};

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const [typesList, setTypesList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const postsPerPage = 10;

  const router = useRouter();

  const fetchPosts = async () => {
    const response = await getAllPosts();
    if (response?.newsList) {
      const sortedPosts = response.newsList.sort((a, b) => {
        if (a.status !== "Published" && b.status === "Published") return -1;
        if (a.status === "Published" && b.status !== "Published") return 1;
        return new Date(b.createDate) - new Date(a.createDate);
      });
      setPosts(sortedPosts);
      setFilteredPosts(sortedPosts);

      const categoryMap = {};
      const employeeMap = {};

      for (const post of sortedPosts) {
        const categoryId = post.category;
        const authorId = post.authorName;

        if (categoryId && !categoryMap[categoryId]) {
          const categoryData = await getCategoryById(categoryId);
          categoryMap[categoryId] = categoryData?.category?.name || "Unknown";
        }

        if (authorId && !employeeMap[authorId]) {
          const authorData = await getEmployeeById(authorId);
          employeeMap[authorId] = authorData?.name || "Unknown";
        }
      }

      setCategoryNames(categoryMap);
      setEmployeeNames(employeeMap);
    }
  };

  const fetchAllEmployees = async () => {
    const employeesResponse = await getAllEmployees();
    setEmployees(employeesResponse);
  };

  const fetchTypes = async () => {
    const typesResponse = await getAllTypes();
    if (typesResponse?.Type) {
      setTypesList(typesResponse.Type);
    }
  };

  const fetchStatus = async () => {
    const statusResponse = await getAllStatus();
    if (statusResponse?.Status) {
      const statusOnly = statusResponse.Status.map((item) => item.status);
      const uniqueStatus = [...new Set(statusOnly)];
      setStatusList(uniqueStatus);
    }
  };

  const handleStatusChange = async (postId, newStatus) => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      alert("User not logged in.");
      return;
    }

    if (loggedInUser.designation !== "admin" && newStatus === "Published") {
      alert("Only admins can publish posts.");
      return;
    }
    const response = await updatePostById(postId, { status: newStatus });
    if (response.success) {
      alert("Status updated successfully");
      fetchPosts();
    }
  };

  const handleTaskSubmit = async (formData) => {
    if (!formData.get("assignedBy") && loggedInUser?.name) {
      formData.set("assignedBy", loggedInUser.name);
    }

    const response = await createTask(formData);
    fetchPosts();
    return response;
  };

  const handleViewNewsDetail = (newsId) => {
    router.push(`/news/${newsId}`);
  };
  const handleEdit = (postId) => {
    router.push(`/Editpost?id=${postId}`);
  };


  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePostById(id);
      setPosts(posts.filter((post) => post._id !== id));
      setFilteredPosts(filteredPosts.filter((post) => post._id !== id));
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
    fetchPosts();
    fetchAllEmployees();
    fetchTypes();
    fetchStatus();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (!loggedInUser) {
    return null;
  }

  const publishedPosts = posts
    .filter((post) => post.status === "Published")
    .sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));

  return (
    <div className="posts-wrapper">
      {loggedInUser?.designation === "author" && (
        <TaskNotification authorId={loggedInUser._id} />
      )}
      {loggedInUser?.designation === "admin" && (
        <PublishedPostsCardGrid posts={publishedPosts} employeeNames={employeeNames} />
      )}
      {loggedInUser?.designation === "admin" && (
        <TaskAssign
          employees={employees}
          typesList={typesList}
          onTaskSubmit={handleTaskSubmit}
          loggedInAdmin={loggedInUser}
        />
      )}
      <PostsTable
        posts={currentPosts}
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
        indexOfFirstPost={indexOfFirstPost}
        employeeNames={employeeNames}
        categoryNames={categoryNames}
        statusList={statusList}
        handleViewNewsDetail={handleViewNewsDetail}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        updatePostById={handleStatusChange}
      />
    </div>
  );
};

export default PostsPage;
