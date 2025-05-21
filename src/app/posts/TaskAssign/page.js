"use client";
import React, { useState } from "react";

const TaskAssign = ({ employees, typesList, onTaskSubmit, loggedInAdmin }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const [taskassign, setTaskAssign] = useState({
    title: "",
    link: "",
    author: "",
    assignedBy: loggedInAdmin?.name || "admin",
    status: "Assigned",
    types: "",
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setSelectedFile(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (!taskassign.title || !selectedFile || !taskassign.author || !taskassign.types) {
      alert("Please fill all required fields: Title, File, Author, and Type.");
      return;
    }

    const formData = new FormData();
    formData.append("title", taskassign.title);
    formData.append("file", selectedFile);
    formData.append("link", taskassign.link);
    formData.append("author", taskassign.author);
    formData.append("assignedBy", taskassign.assignedBy);
    formData.append("status", taskassign.status);
    formData.append("types", taskassign.types);

    try {
      const response = await onTaskSubmit(formData);
      console.log("Response from server:", response);
      alert("Task Assigned Successfully");

      setTaskAssign({
        title: "",
        link: "",
        author: "",
        assignedBy: loggedInAdmin?.name || "admin",
        status: "Assigned",
        types: "",
      });
      setSelectedFile(null);
    } catch (error) {
      alert("Failed to assign task. Please check console.");
      console.error("Task Submit Error:", error);
    }
  };

  return (
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
                <option key={emp._id} value={emp.name}>
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
            {typesList.map((type, index) => (
              <option key={index} value={typeof type.name === "object" ? type.name.name : type.name}>
                {typeof type.name === "object" ? type.name.name : type.name}
              </option>
            ))}
          </select>
        </label>

        <button className="submit-btn" onClick={handleSubmit}>
          Assign Task
        </button>
      </div>
    </div>
  );
};

export default TaskAssign;
