"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPosts, getEmployeeById } from "../../services/Api";
import "../../Styles/AuthorPostStatus.css";

export default function AdminPostStatus ({ currentUser }){
    const [resubmittedPosts, setResubmittedPosts] = useState([]);
    const [employeeNames, setEmployeeNames] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (!currentUser || currentUser.designation !== "admin") {
            setResubmittedPosts([]);
            return;
        }

        const fetchPostsAndEmployees = async () => {
            const response = await getAllPosts();
            if (response?.newsList) {
                const filteredPosts = response.newsList.filter(
                    (post) => post.status === "Resubmitted"
                );
                setResubmittedPosts(filteredPosts);

                const uniqueAuthorIds = [...new Set(filteredPosts.map(post => post.authorName))];
                const namesMap = {};

                await Promise.all(uniqueAuthorIds.map(async (id) => {
                    try {
                        const empData = await getEmployeeById(id);
                        if (empData && empData.name) {
                            namesMap[id] = empData.name;
                        } else {
                            namesMap[id] = "Unknown";
                        }
                    } catch (error) {
                        namesMap[id] = "Unknown";
                    }
                }));

                setEmployeeNames(namesMap);
            }
        };

        fetchPostsAndEmployees();
    }, [currentUser]);

    const handleReviewClick = (postId) => {
        router.push(`/news/${postId}`);
    };

    if (!currentUser || currentUser.designation !== "admin") {
        return <p>You do not have permission to view this page.</p>;
    }

    return (
        <div className="resubmitted-container">
            <h2 style={{ marginTop: "-8px" }}>📢 Posts Resubmitted by Authors</h2>
            {resubmittedPosts.length === 0 ? (
                <p>No resubmitted posts at the moment.</p>
            ) : (
                resubmittedPosts.map((post) => (
                    <div key={post._id} className="resubmitted-box">
                        <p><strong>Title:</strong> {post.title || "(Untitled Post)"}</p>
                        <div className="author-row">
                            <p className="author-name">
                                <strong>Author:</strong> {employeeNames[post.authorName] || "Loading..."}
                            </p>
                            <button
                                className="review-post-button"
                                onClick={() => handleReviewClick(post._id)}
                            >
                                Review Post
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

