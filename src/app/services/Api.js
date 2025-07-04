const BACKEND_URL = "http://192.168.1.9:5000/api";

const request = async (endpoint, method = "GET", body = null, headers = {}) => {
  const isFormData = body instanceof FormData;

  const options = {
    method,
    headers: isFormData ? headers : { "Content-Type": "application/json", ...headers },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  };

  const response = await fetch(`${BACKEND_URL}${endpoint}`, options);

  const contentType = response.headers.get("content-type");
  if (response.status === 204) return null;

  return contentType?.includes("application/json")
    ? response.json()
    : response.text();
};

// ========== Auth APIs ==========
export const login = (payload) => request("/auth/login", "POST", payload);
export const register = (payload) => request("/auth/register", "POST", payload);
export const verifyToken = (token) => request("/auth/verify", "POST", null, {
  Authorization: `Bearer ${token}`,
});
export const logout = () => request("/auth/logout", "POST");

// ========== Category APIs ==========
export const createCategory = (payload) => request("/category/create-category", "POST", payload);
export const getAllCategories = () => request("/category/get-all-category");
export const getCategoryById = (id) => request(`/category/get-category/${id}`);
export const updateCategoryById = (id, payload) => request(`/category/update-category/${id}`, "PUT", payload);
export const deleteCategoryById = (id) => request(`/category/delete-category/${id}`, "DELETE");

// ========== Tag APIs ==========
export const createTag = (payload) => request("/tags/create-tags", "POST", payload);
export const getAllTags = () => request("/tags/get-all-tags");
export const getTagById = (id) => request(`/tags/get-tags/${id}`);
export const updateTagById = (id, payload) => request(`/tags/update-tags/${id}`, "PUT", payload);
export const deleteTagById = (id) => request(`/tags/delete-tags/${id}`, "DELETE");

// ========== Post APIs ==========
export const createPost = (payload) => request("/news/create-post", "POST", payload);
export const getAllPosts = () => request("/news/get-all-post");
export const getPostById = (id) => request(`/news/get-post/${id}`);
export const updatePostById = (id, payload) => request(`/news/update-post/${id}`, "PUT", payload);
export const deletePostById = (id) => request(`/news/delete-post/${id}`, "DELETE");
export const getPostsByCategoryId = (categoryId) => request(`/news/get-category-news/${categoryId}`);

// ========== Employee APIs ==========
export const createEmployee = (payload) => request("/employee/employee-register", "POST", payload);
export const getAllEmployees = () => request("/employee");
export const getEmployeeById = (id) => request(`/employee/get-employee/${id}`);
export const updateEmployeeById = (id, payload) => request(`/employee/update-employee/${id}`, "PUT", payload);
export const deleteEmployeeById = (id) => request(`/employee/delete-employee/${id}`, "DELETE");

// ========== Task APIs ==========
export const createTask = (payload) => request("/task/create-task", "POST", payload);
export const getAllTasks = () => request("/task/get-all-task");
export const getTaskById = (id) => request(`/task/get-task/${id}`);
export const getTasksByAuthorId = (authorId) => request(`/task/get-author-task/${authorId}`);
export const updateTaskById = (id, payload) => request(`/task/update-task/${id}`, "PUT", payload);
export const deleteTaskById = (id) => request(`/task/delete-task/${id}`, "DELETE");

// ========== Type APIs ==========
export const createType = (payload) => request("/type/create-types", "POST", payload);
export const getAllTypes = () => request("/type/get-all-types");
export const getTypeById = (id) => request(`/type/get-types/${id}`);
export const updateTypeById = (id, payload) => request(`/type/update-types/${id}`, "PUT", payload);
export const deleteTypeById = (id) => request(`/type/delete-types/${id}`, "DELETE");

// ========== Status APIs ==========
export const createStatus = (payload) => request("/status/create-status", "POST", payload);
export const getAllStatus = () => request("/status/get-all-status");
export const getStatusById = (id) => request(`/status/get-status/${id}`);
export const updateStatusById = (id, payload) => request(`/status/update-status/${id}`, "PUT", payload);
export const deleteStatusById = (id) => request(`/status/delete-status/${id}`, "DELETE");
