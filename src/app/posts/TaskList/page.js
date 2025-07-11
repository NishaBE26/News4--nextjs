"use client";
import React, { useEffect, useState } from "react";
import {
    getAllTasks,
    updateTaskById,
    deleteTaskById,
    getEmployeeById,
} from "@/app/services/Api";
import Image from 'next/image';
import "../../Styles/TaskList.css";

export default function TaskList (){
    const [tasks, setTasks] = useState([]);
    const [employeeNames, setEmployeeNames] = useState({});
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState({});

    const fetchTasks = async () => {
        const data = await getAllTasks();
        if (data.taskList) {
            setTasks(data.taskList);

            const uniqueIds = new Set();
            data.taskList.forEach((task) => {
                uniqueIds.add(task.assignedBy);
                uniqueIds.add(task.author);
            });

            const nameMap = {};
            await Promise.all(
                Array.from(uniqueIds).map(async (id) => {
                    const emp = await getEmployeeById(id);
                    nameMap[id] = emp?.name || "Unknown";
                })
            );

            setEmployeeNames(nameMap);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleEdit = (task) => {
        setEditingTaskId(task._id);
        setEditedTask({
            title: task.title,
            file: task.file || "",
            link: task.link || "",
            author: employeeNames[task.author] || "",
        });
    };

    const handleCancel = () => {
        setEditingTaskId(null);
        setEditedTask({});
    };

    const handleChange = (field, value) => {
        setEditedTask((prev) => ({ ...prev, [field]: value }));
    };

    const handleUpdate = async (taskId) => {
        const authorId = Object.entries(employeeNames).find(
            ([, name]) => name === editedTask.author
        )?.[0];

        if (!authorId) {
            alert("Invalid author name");
            return;
        }

        const updateData = {
            title: editedTask.title,
            file: editedTask.file,
            link: editedTask.link,
            author: authorId,
        };

        const result = await updateTaskById(taskId, updateData);
        if (result.success) {
            setEditingTaskId(null);
            setEditedTask({});
            fetchTasks();
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this task?")) {
            await deleteTaskById(id);
            setTasks(tasks.filter((task) => task._id !== id));
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        const result = await updateTaskById(taskId, { status: newStatus });
        if (result.success) fetchTasks();
    };

    return (
        <div className="task-table-container">
            <h1 className="allposts">All Tasks</h1>
            {tasks.length === 0 ? (
                <p>No tasks found.</p>
            ) : (
                <table className="task-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>File</th>
                            <th>Link</th>
                            <th>Assigned By</th>
                            <th>Author Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => {
                            const isEditing = editingTaskId === task._id;

                            return (
                                <tr key={task._id}>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedTask.title}
                                                onChange={(e) => handleChange("title", e.target.value)}
                                            />
                                        ) : (
                                            task.title
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedTask.file}
                                                onChange={(e) => handleChange("file", e.target.value)}
                                                placeholder="Enter image URL"
                                            />
                                        ) : (
                                            task.file &&
                                            /\.(jpeg|jpg|gif|png|svg|webp)$/i.test(task.file) && (
                                                <Image
                                                    src={task.file}
                                                    alt="Task"
                                                    className="task-image"
                                                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                />
                                            )
                                        )}
                                    </td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedTask.link}
                                                onChange={(e) => handleChange("link", e.target.value)}
                                                placeholder="Enter link URL"
                                            />
                                        ) : task.link && (
                                            <a href={task.link} target="_blank" rel="noopener noreferrer">Link</a>
                                        )
                                        }
                                    </td>
                                    <td>{employeeNames[task.assignedBy] || "Loading..."}</td>
                                    <td>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedTask.author}
                                                onChange={(e) => handleChange("author", e.target.value)}
                                                placeholder="Enter author name"
                                            />
                                        ) : (
                                            employeeNames[task.author] || "Loading..."
                                        )}
                                    </td>
                                    <td>{task.status}</td>
                                    <td style={{ display: "flex", gap: "10px" }}>
                                        {isEditing ? (
                                            <>
                                                <button onClick={() => handleUpdate(task._id)} className="btn btn-update">
                                                    Update
                                                </button>
                                                <button onClick={handleCancel} className="btn btn-cancel">
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(task)} className="btn btn-edit">
                                                    Edit
                                                </button>
                                                {task.status === "Assigned" && (
                                                    <button
                                                        onClick={() => handleStatusChange(task._id, "Completed")}
                                                        className="btn btn-complete"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                {task.status === "Completed" && (
                                                    <button
                                                        onClick={() => handleStatusChange(task._id, "Assigned")}
                                                        className="btn btn-reassign"
                                                    >
                                                        Reassign
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(task._id)} className="btn btn-delete">
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

