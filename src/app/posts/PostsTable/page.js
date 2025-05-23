"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PostsTable = ({
  posts,
  currentPage,
  totalPages,
  paginate,
  indexOfFirstPost,
  employeeNames,
  categoryNames,
  statusList,
  handleViewNewsDetail,
  handleEdit,
  handleDelete,
  updatePostById,
}) => {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  const handleStatusChange = (postId, newStatus) => {
    if (!loggedInUser) {
      alert("User not logged in.");
      return;
    }
    if (loggedInUser.designation !== "admin" && newStatus === "Published") {
      alert("Only admins can publish posts.");
      return;
    }
    updatePostById(postId, newStatus);
  };

  return (
    <div className="posts-table-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1 className="allposts" style={{ margin: 0 }}>
            All posts
          </h1>
          <button
            style={{
              padding: "8px 10px",
              fontSize: "14px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: "#F0F8FF",
              color: "#333",
              border: "1px solid #ccc",
            }}
            onClick={() => router.push("/posts/AddNewPost")}
          >
            Add New Post
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <span>{posts.length} posts</span>
          <button
            onClick={() => paginate(1)}
            disabled={currentPage === 1}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              backgroundColor: "#eee",
            }}
            title="First Page"
          >
            {"<<"}
          </button>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              backgroundColor: "#eee",
            }}
            title="Previous Page"
          >
            {"<"}
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              backgroundColor: "#eee",
            }}
            title="Next Page"
          >
            {">"}
          </button>
          <button
            onClick={() => paginate(totalPages)}
            disabled={currentPage === totalPages}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "3px",
              border: "1px solid #ccc",
              backgroundColor: "#eee",
            }}
            title="Last Page"
          >
            {">>"}
          </button>
        </div>
      </div>
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
          {posts.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                No posts found.
              </td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr key={post._id}>
                <td>{indexOfFirstPost + index + 1}</td>
                <td>
                  {post.file ? (
                    <img
                      src={post.file}
                      alt="Post Thumbnail"
                      width={80}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: "7px" }}
                    />
                  ) : (
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      No image
                    </span>
                  )}
                </td>
                <td style={{ color: "#007bff" }}>{post.title}</td>
                <td>
                  <span
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                    }}
                  >
                    {employeeNames[post.authorName] || "Unknown"}
                  </span>
                </td>
                <td style={{ color: "#007bff" }}>{post.wordCount}</td>
                <td style={{ color: "#007bff" }}>
                  {categoryNames[post.category]}
                </td>
                <td>
                  <select
                    className="status-select"
                    value={post.status}
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    disabled={loggedInUser?.designation !== "admin"}
                  >
                    {statusList.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  {(() => {
                    const d = new Date(post.createDate);
                    let hours = d.getHours();
                    const minutes = String(d.getMinutes()).padStart(2, "0");
                    const ampm = hours >= 12 ? "pm" : "am";
                    hours = hours % 12 || 12;
                    return `${String(d.getDate()).padStart(2, "0")}.${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}.${d.getFullYear()} ${hours}.${minutes}${ampm}`;
                  })()}
                </td>
                <td>
                  {(() => {
                    const d = new Date(post.updatedAt);
                    let hours = d.getHours();
                    const minutes = String(d.getMinutes()).padStart(2, "0");
                    const ampm = hours >= 12 ? "pm" : "am";
                    hours = hours % 12 || 12;
                    return `${String(d.getDate()).padStart(2, "0")}.${String(
                      d.getMonth() + 1
                    ).padStart(2, "0")}.${d.getFullYear()} ${hours}.${minutes}${ampm}`;
                  })()}
                </td>
                <td>
                  <span
                    className="action-link"
                    onClick={() => handleViewNewsDetail(post._id)}
                  >
                    View
                  </span>{" "}
                |{" "}
                <span
                  className="action-link"
                  onClick={() => router.push(`/posts/Edit/${post._id}`)}
                >
                  Edit
                </span>{" "}
                |{" "}
                <span
                  className="action-link"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </span>
              </td>
              </tr>
        ))
          )}
      </tbody>
    </table>
    </div >
  );
};

export default PostsTable;
