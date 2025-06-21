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
    const startMonth = new Date(2025, 3);
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

  const handleClearFilter = () => setSelectedMonth("All");

  return (
    <div className="posts-table-container">
      <div className="header-bar">
        <div className="left">
          <h1 className="allposts">All posts</h1>
          <button onClick={() => router.push("/posts/AddNewPost")}>Add New Post</button>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="All">Filter by Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month === currentMonth ? `${month} (Current)` : month}
              </option>
            ))}
          </select>
          <button onClick={handleClearFilter}>Clear</button>
        </div>

        <div className="pagination">
          <span>{posts.length} posts</span>
          <button onClick={() => paginate(1)} disabled={currentPage === 1}>{"<<"}</button>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
          <span>{currentPage} of {totalPages}</span>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
          <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>{">>"}</button>
        </div>
      </div>

      <table className="posts-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Image</th>
            <th>Title <IoMdArrowDropdown /></th>
            <th>Author</th>
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
              <td colSpan="10" style={{ textAlign: "center" }}>No posts found.</td>
            </tr>
          ) : (
            posts.map((post, index) => (
              <tr key={post._id}>
                <td>{indexOfFirstPost + index + 1}</td>
                <td>
                  {post.file ? <img src={post.file} alt="" width={80} /> : <span>No image</span>}
                </td>
                <td>{post.title}</td>
                <td>{employeeNames[post.authorName] || "Unknown"}</td>
                <td>{post.wordCount}</td>
                <td>{categoryNames[post.category]}</td>
                <td>
                  <select
                    value={post.status}
                    onChange={(e) => handleStatusChange(post._id, e.target.value)}
                    disabled={loggedInUser?.designation !== "admin"}
                  >
                    {statusList.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
                <td>{new Date(post.createDate).toLocaleString("en-GB")}</td>
                <td>{new Date(post.updatedAt).toLocaleString("en-GB")}</td>
                <td>
                  <span onClick={() => handleViewNewsDetail(post._id)}>View</span> |{" "}
                  <span onClick={() => handleEdit(post._id)}>Edit</span> |{" "}
                  <span onClick={() => handleDelete(post._id)}>Delete</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
