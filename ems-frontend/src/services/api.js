import axios from 'axios';

const API_URL = "http://localhost:8090/ems";
export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
        const userObj = JSON.parse(userStr);
        if(userObj.token) config.headers.Authorization = `Bearer ${userObj.token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("currentUser");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const loginUser = (data) => api.post("/auth/login", data);
export const applyAttendance = (uid, data) => api.post(`/user/apply/attendence?userId=${uid}`, data);
export const submitFeedback = (uid, data) => api.post(`/user/submit/feedback?userId=${uid}`, data);
export const submitInfoRequest = (uid, data) => api.post(`/user/submit/info-request?userId=${uid}`, data);
export const getMyAttendance = (uid) => api.get(`/user/applied/attendence?userId=${uid}`);
export const checkAppliedDates = (userId, startDate, endDate) => api.get(`/user/applied/check?userId=${userId}&startDate=${startDate}&endDate=${endDate}`);
export const updateMyProfile = (uid, data) => api.put(`/user/update/profile?userId=${uid}`, data);

export const getEmployees = () => api.get("/manager/employees");
export const createEmployee = (data) => api.post("/manager/employee/create", data);
export const updateEmployee = (id, data) => api.put(`/manager/employee/update/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/manager/employee/delete/${id}`);
export const getPendingAttendance = () => api.get("/manager/attendance/pending");
export const updateAttendanceStatus = (id, status, comment) => api.put(`/manager/attendance/status/${id}?status=${status}&comment=${encodeURIComponent(comment || "")}`);

export const getManagers = () => api.get("/admin/managers");
export const createManager = (data) => api.post("/admin/manager/create", data);
export const updateManager = (id, data) => api.put(`/admin/manager/update/${id}`, data);
export const deleteManager = (id) => api.delete(`/admin/manager/delete/${id}`);
export const getAllFeedbacks = () => api.get("/admin/feedbacks");
export const getAllInfoRequests = () => api.get("/admin/info-requests");
export const resolveInfoRequest = (id) => api.put(`/admin/info-request/resolve/${id}`);