"use client";
import React, { useEffect, useState } from "react";
import "../../Styles/TaskNotification.css";
import { getTasksByAuthorId, getTypeById } from "@/app/services/Api";

const TaskNotification = () => {
  const [tasks, setTasks] = useState([]);
  const [typeNames, setTypeNames] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchTasks = async (authorEmployeeId) => {
    try {
      const response = await getTasksByAuthorId(authorEmployeeId);
      const taskList = response?.task || [];
      setTasks(taskList);

      // Extract unique type IDs (assuming task.types is correct field)
      const uniqueTypeIds = [...new Set(taskList.map((task) => task.types))];
      const typeNameMap = {};

      await Promise.all(
        uniqueTypeIds.map(async (id) => {
          if (!id) return; // skip if id undefined/null
          try {
            const typeData = await getTypeById(id);
            // Adjust if your API returns typeData.Type.name
            if (typeData && typeData.Type && typeData.Type.name) {
              typeNameMap[id] = typeData.Type.name;
            } else {
              typeNameMap[id] = "Unknown Type";
            }
          } catch {
            typeNameMap[id] = "Unknown Type";
          }
        })
      );

      setTypeNames(typeNameMap);
      console.log("Type names:", typeNameMap);
    } catch (error) {
      console.error("Error fetching tasks or types:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setLoggedInUser(parsedUser);
      if (parsedUser.designation === "author") {
        fetchTasks(parsedUser.employeeId);
      }
    }
  }, []);

  if (!loggedInUser || loggedInUser.designation !== "author") {
    return <p>Only authors can view their task notifications.</p>;
  }

  return (
    <div className="task-notification-wrapper">
      <h2 className="task-notification-title">Task Notifications</h2>
      <div className="task-scroll-container">
        <div className="task-list">
          {[...tasks].reverse().map((task) => (
            <div key={task._id} className="task-card">
              {task.file && (
                <img src={task.file} alt="Task visual" className="task-image" />
              )}
              <div className="task-content">
                <h3>{task.title}</h3>
                <p>
                  <strong>Type:</strong> {typeNames[task.types] || "Loading..."}
                </p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Created On:</strong> {new Date(task.createDate).toLocaleDateString()}</p>
                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="task-link"
                  >
                    🔗 View Reference link
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskNotification;
