import React, { useEffect, useState } from "react";
import "../../Styles/TaskNotification.css";
import { getTasksByAuthorId, getTypeById } from "@/app/services/Api";
import { useRouter } from "next/navigation";

export default function TaskNotification (){
  const [tasks, setTasks] = useState([]);
  const [typeNames, setTypeNames] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(null);
  const router = useRouter();

  const fetchTasks = async (authorEmployeeId) => {
    try {
      const response = await getTasksByAuthorId(authorEmployeeId);
      const taskList = response?.task || [];
      const pendingTasks = taskList.filter(task => task.status !== "Completed");
      setTasks(pendingTasks);
      const uniqueTypeIds = [...new Set(pendingTasks.map((task) => task.types))];
      const typeNameMap = {};

      await Promise.all(
        uniqueTypeIds.map(async (id) => {
          if (!id) return;
          try {
            const typeData = await getTypeById(id);
            if (typeData?.Type?.name) {
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
      <h2 className="task-notification-title" style={{ marginTop: "-7px" }}>
        Task Notifications
      </h2>

      <div className="task-scroll-container">
        <div className="task-list">
          {[...tasks].reverse().map((task) => (
            <div key={task._id} className="task-card">
              {task.file && (
                <img src={task.file} alt="Task visual" className="task-image" />
              )}
              <div className="task-content">
                <h3>{task.title}</h3>
                <div className="task-line-info">
                  <span><strong>📌 Type:</strong> {typeNames[task.types] || "Loading..."}</span>
                  <span><strong>📋 Status:</strong> {task.status}</span>
                  <span><strong>📅 Created On:</strong> {new Date(task.createDate).toLocaleDateString()}</span>
                  {task.link && (
                    <span>
                      <strong>🔗 Reference:</strong>{" "}
                      <a
                        href={task.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="task-link"
                      >
                        View Link
                      </a>
                    </span>
                  )}
                  <button
                    className="work-task-link-button"
                    onClick={() => router.push(`/posts/AddNewPost?task=${task._id}`)}
                  >
                    Work Task
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
