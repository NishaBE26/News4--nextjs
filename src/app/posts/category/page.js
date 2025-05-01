// app/category/page.js

'use client';
import React, { useEffect, useState } from 'react';
import "../../Styles/category.css";
import Sidebar from "../../components/Sidebar";
const CategoryPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://192.168.1.100:5000/api/category/get-all-category');
      console.log("response", response);
      const data = await response.json();
      setCategories(data);
      console.log(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div>
        <h1 className="category">Category Page</h1>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default CategoryPage;
