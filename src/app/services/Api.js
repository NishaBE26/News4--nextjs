const BACKEND_URL = "http://192.168.1.7:5000/api";

const request = async (endpoint, method = "GET", body) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, options);

    console.log(`API Response Status: ${response.status} ${response.statusText}`);

    let data = {};
    if (response.status !== 204) { // Status 204 means no content
        data = await response.json();
        console.log("Response Data:", data);
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || "API Error");
    }
    return data;
};
// ====== CATEGORY APIs ======
export const createCategory = (payload) =>
    request("/category/create-category", "POST", payload);

export const getAllCategories = () =>
    request("/category/get-all-category");

export const getCategoryById = (id) =>
    request(`/category/get-category/${id}`);

export const updateCategoryById = (id, payload) =>
    request(`/category/update-category/${id}`, "PUT", payload);

export const deleteCategoryById = (id) =>
    request(`/category/delete-category/${id}`, "DELETE");

//========= Tag APIs =========//
export const createTag = (payload) =>
    request("/tags/create-tags", "POST", payload);

export const getAllTags = () =>
    request("/tags/get-all-tags");

export const getTagById = (id) =>
    request(`/tags/get-tags/${id}`);

export const updateTagById = (id, payload) =>
    request(`/tags/update-tags/${id}`, "PUT", payload);

export const deleteTagById = (id) =>
    request(`/tags/delete-tags/${id}`, "DELETE");
//========= Post APIs =========//
export const createPost = (payload) =>
    request("/news/create-post", "POST", payload);
export const getAllPosts = () =>
    request("/news/get-all-post");
export const getPostById = (id) =>
    request(`/news/get-post/${id}`);
export const updatePostById = (id, payload) =>
    request(`/news/update-post/${id}`, "PUT", payload);
export const deletePostById = (id) =>
    request(`/news/delete-post/${id}`, "DELETE");