"use client";
import React from "react";
import "../../Styles/add-new-post.css";
import Sidebar from "../../components/Sidebar";
const AddNewPost = () => {
    return (
        <div >
            <Sidebar />
            <div>
                <h1 className="addnew">Add New Post</h1>
            </div>
        </div>
    );
}
export default AddNewPost;