const BACKEND_URL = "http://192.168.1.8:5000/api";

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
    let data = {};
    if (response.status !== 204) { // Status 204 means no content
        data = await response.json();
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || "API Error");
    }
    return data;
};
//==========login APIs ==========
export const login = (payload) =>
    request("/auth/login", "POST", payload);
export const register = (payload) =>
    request("/auth/register", "POST", payload);
export const verifyToken = (token) =>
    request("/auth/verify-token", "POST", { token });
export const logout = () =>
    request("/auth/logout", "POST");
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

export const getPostsByCategoryId = (categoryId) =>
    request(`/news/get-category-news/${categoryId}`);
//========= emplyoee APIs =========//   
export const createEmployee = (payload) =>
    request("/employee/create-employee", "POST", payload);
export const getAllEmployees = () =>
    request("/employee", "GET");
export const getEmployeeById = (id) =>
    request(`/employee/get-employee/${id}`, "GET");
export const updateEmployeeById = (id, payload) =>
    request(`/employee/update-employee/${id}`, "PUT", payload);
export const deleteEmployeeById = (id) =>
    request(`/employee/delete-employee/${id}`, "DELETE");
// =============== Task APIs ===========//
export const createTask = (payload) => 
    request("/api/task/create-task", "POST", payload);

export const getAllTasks = () => 
    request("/api/task/get-all-task", "GET");

export const getTaskById = (id) => 
    request(`/api/task/get-task/${id}`, "GET");

export const getTasksByAuthorId = (authorId) => 
    request(`/api/task/get-author-task/${authorId}`, "GET");

export const updateTaskById = (id, payload) => 
    request(`/api/task/update-task/${id}`, "PUT", payload);

export const deleteTaskById = (id) => 
    request(`/api/task/delete-task/${id}`, "DELETE");
// ============= Type register APIs ============= //
export const createType = (payload) => 
    request("/api/type/create-types", "POST", payload);

export const getAllTypes = () => 
    request("/api/type/get-all-types", "GET");

export const getTypeById = (id) => 
    request(`/api/type/get-types/${id}`, "GET");

export const updateTypeById = (id, payload) => 
    request(`/api/type/update-types/${id}`, "PUT", payload);

export const deleteTypeById = (id) => 
    request(`/api/type/delete-types/${id}`, "DELETE");
