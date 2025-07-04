"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdArrowDropdown } from "react-icons/io";

export default function PostsTable({
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
  selectedMonth,
  setSelectedMonth,
}) {
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [authorFilter, setAuthorFilter] = useState(null);

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

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const generateMonthOptions = () => {
    const startMonth = new Date(2025, 3); // April 2025
    const now = new Date();
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1);
    const months = [];

    while (startMonth <= endMonth) {
      const label = startMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      months.push(label);
      startMonth.setMonth(startMonth.getMonth() + 1);
    }

    return months;
  };

  const monthOptions = generateMonthOptions();

  const handleClearMonthFilter = () => setSelectedMonth("All");

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const hour12 = hours % 12 || 12;
    return `${day}.${month}.${year} & ${hour12}.${minutes}${ampm}`;
  };

  const filteredPosts = authorFilter
    ? posts.filter((post) => post.authorName === authorFilter)
    : posts;

  return (
    <div className="posts-table-container">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h1 className="allposts" style={{ margin: 0 }}>
            All posts
          </h1>

          {/* Author Filter Display with Clear Button */}
          {authorFilter && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#fdecea",
                padding: "6px 12px",
                borderRadius: "5px",
                border: "1px solid #f5c6cb",
                fontSize: "13px",
                color: "#b71c1c",
              }}
            >
              <span>Showing posts by: {employeeNames[authorFilter]}</span>
              <button
                onClick={() => setAuthorFilter(null)}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  color: "#b71c1c",
                }}
              >
                Clear Filter
              </button>
            </div>
          )}

          {/* Add Post */}
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

          {/* Month Filter */}
          <select
            style={{
              padding: "8px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
            }}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="All">Filter by Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month === currentMonth ? `${month} (Current)` : month}
              </option>
            ))}
          </select>

          <button
            onClick={handleClearMonthFilter}
            style={{
              padding: "8px",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear Month
          </button>
        </div>

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: "14px",
          }}
        >
          <span>
            {authorFilter ? filteredPosts.length : posts.length} posts
          </span>
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>
            {"<<"}
          </button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            {"<"}
          </button>
          <span>
            {currentPage} of {totalPages}
          </span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            {">"}
          </button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
            {">>"}
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="posts-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>
              Title <IoMdArrowDropdown />
            </th>
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
          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan="10" style={{ textAlign: "center", padding: "20px" }}>
                No posts found.
              </td>
            </tr>
          ) : (
            filteredPosts.map((post, index) => (
              <tr key={post._id}>
                <td>{indexOfFirstPost + index + 1}</td>
                <td>
                  {post.file ? (
                    <img
                      src={post.file}
                      alt="Post"
                      width={80}
                      height={60}
                      style={{ objectFit: "cover", borderRadius: "7px" }}
                    />
                  ) : (
                    <span style={{ color: "#888" }}>No image</span>
                  )}
                </td>
                <td style={{ color: "#007bff" }}>{post.title}</td>
                <td
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                  }}
                  onClick={() => setAuthorFilter(post.authorName)}
                >
                  {employeeNames[post.authorName] || "Unknown"}
                </td>
                <td style={{ color: "#007bff" }}>{post.wordCount}</td>
                <td style={{ color: "#007bff" }}>
                  {categoryNames[post.category]}
                </td>
                <td>
                  {post.status === "Published" ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      {post.status}
                    </span>
                  ) : (
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
                  )}
                </td>
                <td>{formatDateTime(post.createDate)}</td>
                <td>{formatDateTime(post.updatedAt)}</td>
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
                    onClick={() => handleEdit(post._id)}
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
    </div>
  );
}
