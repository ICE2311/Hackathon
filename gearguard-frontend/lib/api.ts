import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  register: (data: any) => api.post("/auth/register", data),
  getUsers: () => api.get("/users"),
};

// Equipment API
export const equipmentAPI = {
  getAll: (params?: any) => api.get("/equipment", { params }),
  getOne: (id: string) => api.get(`/equipment/${id}`),
  create: (data: any) => api.post("/equipment", data),
  update: (id: string, data: any) => api.patch(`/equipment/${id}`, data),
  delete: (id: string) => api.delete(`/equipment/${id}`),
};

// Maintenance Team API
export const maintenanceTeamAPI = {
  getAll: () => api.get("/maintenance-teams"),
  getOne: (id: string) => api.get(`/maintenance-teams/${id}`),
  create: (data: any) => api.post("/maintenance-teams", data),
  update: (id: string, data: any) =>
    api.patch(`/maintenance-teams/${id}`, data),
  delete: (id: string) => api.delete(`/maintenance-teams/${id}`),
  addMember: (teamId: string, userId: string) =>
    api.post(`/maintenance-teams/${teamId}/members`, { userId }),
  removeMember: (teamId: string, userId: string) =>
    api.delete(`/maintenance-teams/${teamId}/members/${userId}`),
};

// Maintenance Request API
export const maintenanceRequestAPI = {
  getAll: (params?: any) => api.get("/maintenance-requests", { params }),
  getOne: (id: string) => api.get(`/maintenance-requests/${id}`),
  create: (data: any) => api.post("/maintenance-requests", data),
  update: (id: string, data: any) =>
    api.patch(`/maintenance-requests/${id}`, data),
  assignTechnician: (id: string, data: { technicianId: string }) =>
    api.patch(`/maintenance-requests/${id}/assign`, data),
  updateStage: (id: string, data: any) =>
    api.patch(`/maintenance-requests/${id}/stage`, data),
  delete: (id: string) => api.delete(`/maintenance-requests/${id}`),
  getKanban: () => api.get("/maintenance-requests/kanban"),
  getCalendar: (start: string, end: string) =>
    api.get("/maintenance-requests/calendar", { params: { start, end } }),
  getMetrics: (month?: number, year?: number) =>
    api.get("/maintenance-requests/metrics", { params: { month, year } }),
};
