import axios from 'axios';
import toast from 'react-hot-toast';

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'https://gmac-two.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An error occurred';

    // Don't show toast for authentication errors (handled by AuthContext)
    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Student API calls
export const studentAPI = {
  // Get all students
  getStudents: (params = {}) => api.get('/students', { params }),

  // Get single student
  getStudent: (id) => api.get(`/students/${id}`),

  // Create student
  createStudent: (studentData) => api.post('/students', studentData),

  // Update student
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),

  // Delete student
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

// Class API removed
// export const classAPI = { ... };

// Attendance API calls
export const attendanceAPI = {
  // Mark attendance
  markAttendance: (attendanceData) => api.post('/attendance/mark', attendanceData),

  // Get attendance for a class on specific date
  getClassAttendance: (classId, date) => api.get(`/attendance/class/${classId}/date/${date}`),

  // Get student attendance summary
  getStudentAttendance: (studentId, startDate, endDate) =>
    api.get(`/attendance/student/${studentId}`, {
      params: { startDate, endDate }
    }),

  // Get class attendance report
  getClassAttendanceReport: (classId, startDate, endDate) =>
    api.get(`/attendance/class/${classId}/report`, {
      params: { startDate, endDate }
    }),

  // Update attendance record
  updateAttendance: (id, updateData) => api.put(`/attendance/${id}`, updateData),

  // Get attendance statistics
  getAttendanceStats: (params = {}) => api.get('/attendance/stats', { params }),
};

// Admin API calls
export const adminAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Register teacher
  registerTeacher: (teacherData) => api.post('/admin/register-teacher', teacherData),

  // Get all attendance records
  getAllAttendance: (params = {}) => api.get('/attendance/records', { params }),

  // Get student statistics
  getStudentStats: (params = {}) => api.get('/admin/student-stats', { params }),
};

// Teacher API calls
export const teacherAPI = {
  // Get dashboard data
  getDashboard: () => api.get('/teacher/dashboard'),

  // Get teacher's classes
  getMyClasses: () => api.get('/teacher/classes'),

  // Get students in a class
  getClassStudents: (classId) => api.get(`/teacher/classes/${classId}/students`),

  // Get attendance reports
  getAttendanceReports: (params = {}) => api.get('/teacher/attendance-reports', { params }),
};

export default api;