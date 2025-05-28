"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPosts } from "../../services/Api";
import "../../Styles/AuthorPostStatus.css";

const AuthorPostStatus = ({ currentUser }) => {
  const [authorPosts, setAuthorPosts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      setAuthorPosts([]);
      return;
    }

    const fetchPosts = async () => {
      const response = await getAllPosts();
      const filteredPosts = response.newsList.filter(
        (post) =>
          post.authorName === currentUser.employeeId &&
          post.status !== "Pending" &&
          post.status !== "Published" &&
          post.status !== "Resubmitted"
      );
      setAuthorPosts(filteredPosts);
    };

    fetchPosts();
  }, [currentUser]);

  const handleEditClick = (postId) => {
    router.push(`/posts/AddNewPost?id=${postId}&resubmitted=true`);
  };

  return (
    <div className="correction-container">
      <div className="fixed-messages">
        <h2>⚠️ Correction Needed</h2>
      </div>
      <div className="correction-scroll-area">
        {authorPosts.length === 0 ? (
          <p className="no-corrections">No corrections needed at the moment.</p>
        ) : (
          authorPosts.map((post) => (
            <div key={post._id} className="correction-box">
              <p><strong>Title:</strong> {post.title || "(Untitled Post)"}</p>
              <div className="status-row">
                <span><strong>Status:</strong> <span className="correction-status">{post.status}</span></span>
                <button
                  className="edit-resubmit-button"
                  onClick={() => handleEditClick(post._id)}
                >
                  Change Post
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function Page(props) {
  const currentUser = props.currentUser || null;
  return <AuthorPostStatus currentUser={currentUser} />;
}
