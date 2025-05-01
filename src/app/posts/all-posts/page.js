"use client";
import React from "react";
import "../../Styles/all-posts.css";
import Sidebar from "../../components/Sidebar";
const AllPostsPage = () => {
    return (
        <div className="container">
            <Sidebar />
            <div>
                <h1 className="allpost">All Posts Page</h1>
            </div>
        </div>
    );
}
export default AllPostsPage;