"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostsByCategoryId } from "@/app/services/Api";
import "../../Styles/AllPosts.css"; 

export default function CategoryPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPostsByCategoryId(id);
      const publishedPosts = response.newsList?.filter(post => post.status === "Published");
      setPosts(publishedPosts);
    };
    if (id) fetchData();
  }, [id]);

  return (
    <div className="posts-container">
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Category News</h1>
      <div className="posts-grid">
        {posts.map((post) => (
          <div className="post-card" key={post._id}>
            <img src={post.file} alt={post.title} className="post-image" />
            <div className="post-title">{post.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
