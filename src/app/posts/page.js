"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllPosts,
  deletePostById,
  getCategoryById,
  createTask,
  getAllEmployees,
  getAllTypes
} from "../services/Api";
import "../Styles/posts.css";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [employeeNames, setEmployeeNames] = useState({});
  const [taskTypes, setTaskTypes] = useState([]);
  const [taskForm, setTaskForm] = useState({
    title: '',
    file: '',
    link: '',
    author: '',
    assignedBy: 'admin',
    updatedBy: '',
    status: 'Assigned',
    types: ''
  });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getAllPosts();
      if (response?.newsList) {
        setPosts(response.newsList);

        const categoryMap = {};
        for (const post of response.newsList) {
          const categoryId = post.category;
          if (categoryId && !categoryMap[categoryId]) {
            const categoryData = await getCategoryById(categoryId);
            categoryMap[categoryId] = categoryData.category.name || "Unknown";
          }
        }
        setCategoryNames(categoryMap);
      }

      // Fetch all employees
      const employeeResponse = await getAllEmployees();
      if (employeeResponse?.employees) {
        const employees = {};
        employeeResponse.employees.forEach((emp) => {
          employees[emp._id] = emp.name; // Store only the name string
        });
        setEmployeeNames(employees);
      }

      // Fetch all task types
      const typeResponse = await getAllTypes();
      if (typeResponse?.types) {
        setTaskTypes(typeResponse.types);
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

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskForm({ ...taskForm, [name]: value });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(taskForm);
      alert("Task Created Successfully!");
      setTaskForm({
        title: '',
        file: '',
        link: '',
        author: '',
        assignedBy: 'admin',
        updatedBy: '',
        status: 'Assigned',
        types: ''
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="posts-wrapper">
      {/* Task Create Form */}
      <div className="task-container">
        <h2>Create New Task</h2>
        <form onSubmit={handleTaskSubmit} className="task-form">
          <input
            type="text"
            name="title"
            value={taskForm.title}
            onChange={handleTaskChange}
            placeholder="Task Title"
            required
          />
          <input
            type="file"
            name="file"
            onChange={handleTaskChange}
          />
          <input
            type="text"
            name="link"
            value={taskForm.link}
            onChange={handleTaskChange}
            placeholder="Link (optional)"
          />
          <select
            name="author"
            value={taskForm.author}
            onChange={handleTaskChange}
            required
          >
            <option value="">Select Author</option>
            {Object.entries(employeeNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <select
            name="assignedBy"
            value={taskForm.assignedBy}
            onChange={handleTaskChange}
            required
          >
            <option value="admin">Admin (default)</option>
            {Object.entries(employeeNames).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="updatedBy"
            value={taskForm.updatedBy}
            onChange={handleTaskChange}
            placeholder="Updated By (optional)"
          />
          <select
            name="types"
            value={taskForm.types}
            onChange={handleTaskChange}
            required
          >
            <option value="">Select Task Type</option>
            {taskTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <button type="submit">Create Task</button>
        </form>
      </div>

      {/* Posts Table */}
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
                    <span style={{ color: "#888", fontSize: "12px" }}>No image</span>
                  )}
                </td>
                <td>{post.title}</td>
                <td>{employeeNames[post.authorName] || "Unknown Author"}</td>
                <td>{post.wordCount}</td>
                <td>{categoryNames[post.category]}</td>
                <td>{post.status}</td>
                <td>
                  {`${String(new Date(post.createDate).getDate()).padStart(2, "0")}.${String(
                    new Date(post.createDate).getMonth() + 1
                  ).padStart(2, "0")}.${new Date(post.createDate).getFullYear()}, ${String(
                    new Date(post.createDate).getHours() % 12 || 12
                  ).padStart(2, "0")}:${String(new Date(post.createDate).getMinutes()).padStart(2, "0")}${new Date(post.createDate).getHours() >= 12 ? "pm" : "am"}`}
                </td>
                <td>
                  {`${String(new Date(post.updatedAt).getDate()).padStart(2, "0")}.${String(
                    new Date(post.updatedAt).getMonth() + 1
                  ).padStart(2, "0")}.${new Date(post.updatedAt).getFullYear()}, ${String(
                    new Date(post.updatedAt).getHours() % 12 || 12
                  ).padStart(2, "0")}:${String(new Date(post.updatedAt).getMinutes()).padStart(2, "0")}${new Date(post.updatedAt).getHours() >= 12 ? "pm" : "am"}`}
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
