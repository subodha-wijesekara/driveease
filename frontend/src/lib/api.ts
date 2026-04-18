import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("driveease_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401 → clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("driveease_token");
      localStorage.removeItem("driveease_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// --- Auth ---
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
};

// --- Equipment ---
export const equipmentApi = {
  getCategories: () => api.get("/equipment/categories"),
  getItems: (page = 0, size = 12) =>
    api.get(`/equipment/items?page=${page}&size=${size}`),
  getItemsByCategory: (categoryId: number) =>
    api.get(`/equipment/items/by-category/${categoryId}`),
  getItem: (id: number) => api.get(`/equipment/items/${id}`),
  checkAvailability: (
    id: number,
    startDate: string,
    endDate: string,
    quantity: number
  ) =>
    api.get(
      `/equipment/items/${id}/availability?startDate=${startDate}&endDate=${endDate}&quantity=${quantity}`
    ),
  // Admin
  createCategory: (data: object) => api.post("/equipment/categories", data),
  updateCategory: (id: number, data: object) =>
    api.put(`/equipment/categories/${id}`, data),
  deleteCategory: (id: number) => api.delete(`/equipment/categories/${id}`),
  createItem: (data: object) => api.post("/equipment/items", data),
  updateItem: (id: number, data: object) =>
    api.put(`/equipment/items/${id}`, data),
  deleteItem: (id: number) => api.delete(`/equipment/items/${id}`),
};

// --- Bookings ---
export const bookingsApi = {
  create: (data: object) => api.post("/bookings", data),
  getMyBookings: (page = 0, status?: string) => 
    api.get(`/bookings/my?page=${page}&size=10${status ? `&status=${status}` : ""}`),
  getBooking: (id: number) => api.get(`/bookings/${id}`),
  cancelBooking: (id: number) => api.delete(`/bookings/${id}`),
  // Admin
  getAllBookings: (page = 0) => api.get(`/bookings?page=${page}&size=20`),
  updateStatus: (id: number, status: string, adminNotes?: string) =>
    api.patch(`/bookings/${id}/status`, { status, adminNotes }),
};

// --- User Profile ---
export const userApi = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (data: { fullName: string; email: string }) =>
    api.put("/users/me", data),
  changePassword: (data: { currentPassword: String; newPassword: string }) =>
    api.put("/users/me/password", data),
};
