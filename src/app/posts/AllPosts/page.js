"use client";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/app/services/Api";
import "../../Styles/AllPosts.css"; 

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await getAllPosts();
    const allPosts = response.newsList || [];
    console.log("All Posts:", allPosts);
      const publishedPosts = allPosts.filter(post => post.status === "Published");
      setPosts(publishedPosts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="posts-container">
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post-card">
            <img src={post.file} alt={post.title} className="post-image" />
            <div className="post-title">{post.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
