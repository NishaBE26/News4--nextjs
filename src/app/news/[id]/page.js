"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPostById, getEmployeeById } from "../../services/Api";

export default function NewsDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        const postData = await getPostById(id);
        setPost(postData?.news || null);

        if (postData?.news?.publishedBy) {
          const employeeData = await getEmployeeById(postData.news.publishedBy);
          setEmployee(employeeData);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    fetchData();
  }, [id]);

  if (!post) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading news post...</p>;
  }

  return (
    <div
      style={{
        Width: "90%",
        margin: "50px auto auto 120px", 
        padding: "20px",
        backgroundColor: "whitesmoke",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)" 
      }}
    >
      <h1>{post.title}</h1>

      {post.file ? (
        <img
          src={post.file}
          alt={post.title}
          style={{
            maxWidth: "100%",
            borderRadius: "8px",
            marginBottom: "15px"
          }}
        />
      ) : (
        <p>No image available</p>
      )}

      <p>
        <strong>Created At:</strong>{" "}
        {(() => {
          const date = new Date(post.createdAt);
          let hours = date.getHours();
          let minutes = String(date.getMinutes()).padStart(2, "0");
          const ampm = hours >= 12 ? "pm" : "am";
          hours = hours % 12 || 12;
          return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()} ${hours}.${minutes}${ampm}`;
        })()}
      </p>

      <div style={{ whiteSpace: "pre-wrap", marginTop: "20px", fontSize: "16px" }}>
        <strong>NewsContent:</strong>{post.newsContent || "No content available."}
      </div>

      <p style={{ marginTop: "40px", fontStyle: "italic" }}>
        <strong>By: {employee?.name || "Unknown Author"}</strong>
      </p>
    </div>
  );
}
