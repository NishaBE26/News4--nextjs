"use client";

import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/posts.css"; // Import the styles

const Posts = () => {
  // Sample data for the posts, news, and notifications
  const posts = [
    { id: 1, title: "Post 1", content: "Content of the post 1." },
    { id: 2, title: "Post 2", content: "Content of the post 2." },
    { id: 3, title: "Post 3", content: "Content of the post 3." },
  ];

  const currentNews = [
    { id: 1, title: "Breaking News 1", content: "This is the content of breaking news 1." },
    { id: 2, title: "Breaking News 2", content: "This is the content of breaking news 2." },
    { id: 3, title: "Breaking News 3", content: "This is the content of breaking news 3." },
    { id: 4, title: "Breaking News 4", content: "This is the content of breaking news 4." },
  ];

  const nextCorrectedPost = { title: "Post 2", issue: "Needs spelling correction" };

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <h1>Posts</h1>
        <p>This is the Posts page using the App Router in Next.js.</p>

        {/* Current News Section */}
        <section className="news-section">
          {currentNews.map(news => (
            <div key={news.id} className="news-item">
              <h3>{news.title}</h3>
              <p>{news.content}</p>
            </div>
          ))}
        </section>

        {/* Next Corrected Post */}
        <section className="next-corrected-post">
          <h3>Next Post to be Corrected:</h3>
          <p>
            <strong>{nextCorrectedPost.title}</strong> - {nextCorrectedPost.issue}
          </p>
        </section>

        {/* Notifications */}
        <section className="notification">
          <p>There are pending corrections for your posts. Please review them.</p>
        </section>
      </main>
    </div>
  );
};

export default Posts;
