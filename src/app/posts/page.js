"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPosts,
  deletePostById,
  getCategoryById,
  getEmployeeById,
} from "../services/Api";
import "../Styles/posts.css";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllPosts();
      if (response?.newsList) {
        setPosts(response.newsList);

        const categoryMap = {};
        const employeeMap = {};

        for (const post of response.newsList) {
          const categoryId = post.category;
          const authorId = post.authorName;
          if (categoryId && !categoryMap[categoryId]) {
            try {
              const categoryData = await getCategoryById(categoryId);
              categoryMap[categoryId] = categoryData.category.name || "Unknown";
            } catch {
              categoryMap[categoryId] = "Unknown";
            }
          }
          if (authorId && !employeeMap[authorId]) {
            try {
              const employeeData = await getEmployeeById(authorId);
              employeeMap[authorId] = employeeData?.name || "Unknown";
            } catch {
              employeeMap[authorId] = "Unknown";
            }
          }
          
        }

        setCategoryNames(categoryMap);
        setEmployeeNames(employeeMap);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (id) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      await deletePostById(id);
      setPosts(posts.filter((post) => post._id !== id));
    }
  };

  return (
    <div className="posts-wrapper">
      <h1 className="all-posts">All Posts</h1>
      <div className="posts-table-container">
        <table className="posts-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author Name</th>
              <th>Words</th>
              <th>Category</th>
              <th>Status</th>
              <th>Create Time</th>
              <th>Update Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post._id}>
                <td>{index + 1}</td>
                <td>
                  {post.file ? (
                    <img
                      src={post.file}
                      alt="Post Thumbnail"
                      width={80}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: "7px" }}
                      onError={(e) => (e.target.src = "/default-image.jpg")}
                    />
                  ) : (
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      No image
                    </span>
                  )}
                </td>
                <td>{post.title}</td>
                <td>{employeeNames[post.authorName] }</td>
                <td>{post.wordCount}</td>
                <td>{categoryNames[post.category]}</td>
                <td>{post.status}</td>
                <td>
                  {`${String(new Date(post.createDate).getDate()).padStart(2, "0")}.${String(
                    new Date(post.createDate).getMonth() + 1
                  ).padStart(2, "0")}.${new Date(post.createDate).getFullYear()}, ${String(
                    new Date(post.createDate).getHours() % 12 || 12
                  ).padStart(2, "0")}:${String(new Date(post.createDate).getMinutes()).padStart(
                    2,
                    "0"
                  )}${new Date(post.createDate).getHours() >= 12 ? "pm" : "am"}`}
                </td>
                <td>
                  {`${String(new Date(post.updatedAt).getDate()).padStart(2, "0")}.${String(
                    new Date(post.updatedAt).getMonth() + 1
                  ).padStart(2, "0")}.${new Date(post.updatedAt).getFullYear()}, ${String(
                    new Date(post.updatedAt).getHours() % 12 || 12
                  ).padStart(2, "0")}:${String(new Date(post.updatedAt).getMinutes()).padStart(
                    2,
                    "0"
                  )}${new Date(post.updatedAt).getHours() >= 12 ? "pm" : "am"}`}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(post._id)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(post._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostsPage;
