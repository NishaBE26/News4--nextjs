"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPosts,
  deletePostById,
  getCategoryById,
  getEmployeeById,
  getAllEmployees,
  createTask,
  getAllTypes,
} from "../services/Api";
import "../Styles/posts.css";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const [typesList, setTypesList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskassign, setTaskAssign] = useState({
    title: "",
    link: "",
    author: "",
    assignedBy: "admin",
    status: "Assigned",
    types: "",
  });

  const router = useRouter();
  const fetchPosts = async () => {
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
            categoryMap[categoryId] = categoryData?.category?.name || "Unknown";
          } catch {
            categoryMap[categoryId] = "Unknown";
          }
        }

        if (authorId && !employeeMap[authorId]) {
          try {
            const authorData = await getEmployeeById(authorId);
            employeeMap[authorId] = authorData?.name || "Unknown";
          } catch {
            employeeMap[authorId] = "Unknown";
          }
        }
      }

      setCategoryNames(categoryMap);
      setEmployeeNames(employeeMap);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const employeesResponse = await getAllEmployees();
      setEmployees(employeesResponse);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchTypes = async () => {
    try {
      const typesResponse = await getAllTypes();
      if (typesResponse?.Type) {
        setTypesList(typesResponse.Type);
      }
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchAllEmployees();
    fetchTypes();
  }, []);

  const handleEdit = (id) => {

  };

  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (confirmed) {
      await deletePostById(id);
      setPosts(posts.filter((post) => post._id !== id));
    }
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
    }
  };
  const handleSubmit = async () => {
    if (!taskassign.title || !selectedFile || !taskassign.author) {
      alert("Please fill all required fields (title, file, author)");
      return;
    }

    const formData = new FormData();
    formData.append("title", taskassign.title);
    formData.append("file", selectedFile);
    formData.append("link", taskassign.link);
    formData.append("author", taskassign.author);
    formData.append("assignedBy", taskassign.assignedBy);
    formData.append("status", "Assigned");
    formData.append("types", taskassign.types);

    try {
      await createTask(formData);
      alert("Task Assigned Successfully");
      setTaskAssign({
        title: "",
        link: "",
        author: "",
        assignedBy: "admin",
        status: "Assigned",
        types: "",
      });
      setSelectedFile(null);
    } catch (error) {
      alert("Error assigning task");
      console.error(error);
    }
  };
  return (
    <div className="posts-wrapper">
      <div className="task-table">
        <div className="task-row">
          <label>
            Title:
            <input
              className="title"
              placeholder="Enter Title"
              value={taskassign.title}
              onChange={(e) =>
                setTaskAssign({ ...taskassign, title: e.target.value })
              }
            />
          </label>

          <label>
            Upload File:
            <input
              type="file"
              accept="image/*,video/*,audio/*,.doc,.docx,.pdf,.xls,.xlsx,.txt,.csv"
              onChange={handleFileChange}
            />
          </label>

          {selectedFile && <p>Selected File: {selectedFile.name}</p>}

          <label>
            Reference Link:
            <input
              className="link"
              placeholder="Reference Link"
              value={taskassign.link}
              onChange={(e) =>
                setTaskAssign({ ...taskassign, link: e.target.value })
              }
            />
          </label>
        </div>

        <div className="task-row">
          <label>
            Select Author:
            <select
              className="author"
              value={taskassign.author}
              onChange={(e) =>
                setTaskAssign({ ...taskassign, author: e.target.value })
              }
            >
              <option value="">Select Author</option>
              {employees
                ?.filter((emp) => emp.designation === "author")
                .map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Assigned By:
            <input
              className="assignedby"
              value={taskassign.assignedBy}
              readOnly
            />
          </label>

          <label>
            Select Type:
            <select
              className="types"
              value={taskassign.types}
              onChange={(e) =>
                setTaskAssign({ ...taskassign, types: e.target.value })
              }
            >
              <option value="">Select Type</option>
              {typesList.map((type) => (
                <option key={type._id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <button className="submit-btn" onClick={handleSubmit}>
            Assign Task
          </button>
        </div>
      </div>
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
                      onError={(e) =>
                        (e.target.src = "https://via.placeholder.com/80x60?text=No+Image")
                      }
                    />
                  ) : (
                    <span style={{ color: "#888", fontSize: "12px" }}>
                      No image
                    </span>
                  )}
                </td>
                <td>{post.title}</td>
                <td>{employeeNames[post.authorName]}</td>
                <td>{post.wordCount}</td>
                <td>{categoryNames[post.category]}</td>
                <td>{post.status}</td>
                <td>{new Date(post.createDate).toLocaleString()}</td>
                <td>{new Date(post.updatedAt).toLocaleString()}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(post._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post._id)}
                  >
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
