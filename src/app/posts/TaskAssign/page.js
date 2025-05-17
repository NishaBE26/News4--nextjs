"use client";
import React, { useState } from "react";

const TaskAssign= ({ 
  employees, 
  typesList, 
  onTaskSubmit 
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskassign, setTaskAssign] = useState({
    title: "",
    link: "",
    author: "",
    assignedBy: "admin",
    status: "Assigned",
    types: "",
  });

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) setSelectedFile(uploadedFile);
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

    await onTaskSubmit(formData);
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
          <input className="assignedby" value={taskassign.assignedBy} readOnly />
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
  );
};

export default TaskAssign;