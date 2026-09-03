/**
 * EduManage API Client
 * Connects Next.js frontend to PHP Laravel backend
 * Base URL: NEXT_PUBLIC_API_URL (default: http://localhost:8000/api)
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// ─── Axios Instance ─────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true, // for Laravel Sanctum cookie auth
})

// ─── Request Interceptor: attach Bearer token ────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('edu_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor: handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('edu_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ─────────────────────────────────────────────────────────────────────────────
// AUTH  →  Laravel: routes/api.php  POST /api/auth/*
// ─────────────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: { token: string; email: string; password: string }) =>
    api.post('/auth/reset-password', data),
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD  →  Laravel: App\Http\Controllers\DashboardController
// ─────────────────────────────────────────────────────────────────────────────
export const dashboardApi = {
  getOverview: () => api.get('/dashboard/overview'),
  getRecentActivities: (limit = 10) => api.get(`/dashboard/activities?limit=${limit}`),
  getQuickStats: () => api.get('/dashboard/stats'),
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMISSION  →  Laravel: App\Http\Controllers\AdmissionController
// ─────────────────────────────────────────────────────────────────────────────
export interface AdmissionFilters {
  status?: string
  program?: string
  date_from?: string
  date_to?: string
  page?: number
  per_page?: number
}

export const admissionApi = {
  list: (filters: AdmissionFilters = {}) =>
    api.get('/admissions', { params: filters }),
  show: (id: string) => api.get(`/admissions/${id}`),
  create: (data: Record<string, unknown>) => api.post('/admissions', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/admissions/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/admissions/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/admissions/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// FEE MANAGEMENT  →  Laravel: App\Http\Controllers\FeeController
// ─────────────────────────────────────────────────────────────────────────────
export const feeApi = {
  getDashboard: () => api.get('/fees/dashboard'),
  listFeeTypes: (params?: Record<string, unknown>) => api.get('/fees/types', { params }),
  recordPayment: (data: Record<string, unknown>) => api.post('/fees/payments', data),
  getTransactions: (params?: Record<string, unknown>) => api.get('/fees/transactions', { params }),
  getStudentFees: (studentId: string) => api.get(`/fees/student/${studentId}`),
  generateInvoice: (paymentId: string) => api.get(`/fees/invoice/${paymentId}`),
  getOverdueList: () => api.get('/fees/overdue'),
}

// ─────────────────────────────────────────────────────────────────────────────
// ACADEMICS / COURSES  →  Laravel: App\Http\Controllers\AcademicsController
// ─────────────────────────────────────────────────────────────────────────────
export const academicsApi = {
  getClasses: () => api.get('/academics/classes'),
  getSections: (classId: string) => api.get(`/academics/classes/${classId}/sections`),
  getSubjects: (classId: string, sectionId?: string) =>
    api.get(`/academics/subjects`, { params: { class_id: classId, section_id: sectionId } }),
  createSubject: (data: Record<string, unknown>) => api.post('/academics/subjects', data),
  updateSubject: (id: string, data: Record<string, unknown>) =>
    api.put(`/academics/subjects/${id}`, data),
  deleteSubject: (id: string) => api.delete(`/academics/subjects/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// ATTENDANCE  →  Laravel: App\Http\Controllers\AttendanceController
// ─────────────────────────────────────────────────────────────────────────────
export const attendanceApi = {
  getStudents: (params: { class_id: string; section_id: string; subject_id?: string; date: string }) =>
    api.get('/attendance/students', { params }),
  saveAttendance: (data: {
    class_id: string
    section_id: string
    subject_id: string
    date: string
    attendance: Array<{ student_id: string; status: 'P' | 'A' | 'L' | 'H' }>
  }) => api.post('/attendance/save', data),
  getSummary: (params: { class_id: string; section_id: string; date: string }) =>
    api.get('/attendance/summary', { params }),
  getMonthly: (params: { class_id: string; section_id: string; month: string; year: string }) =>
    api.get('/attendance/monthly', { params }),
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMETABLE  →  Laravel: App\Http\Controllers\TimetableController
// ─────────────────────────────────────────────────────────────────────────────
export const timetableApi = {
  get: (params: { class_id: string; section_id: string }) =>
    api.get('/timetable', { params }),
  generate: (params: { class_id: string; section_id: string; term_id: string }) =>
    api.post('/timetable/generate', params),
  update: (id: string, data: Record<string, unknown>) => api.put(`/timetable/${id}`, data),
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF  →  Laravel: App\Http\Controllers\StaffController
// ─────────────────────────────────────────────────────────────────────────────
export const staffApi = {
  list: (params?: Record<string, unknown>) => api.get('/staff', { params }),
  show: (id: string) => api.get(`/staff/${id}`),
  create: (data: FormData) =>
    api.post('/staff', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.post(`/staff/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/staff/${id}`),
  getDepartments: () => api.get('/staff/departments'),
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENTS  →  Laravel: App\Http\Controllers\StudentController
// ─────────────────────────────────────────────────────────────────────────────
export const studentApi = {
  list: (params?: Record<string, unknown>) => api.get('/students', { params }),
  show: (id: string) => api.get(`/students/${id}`),
  create: (data: FormData) =>
    api.post('/students', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) =>
    api.post(`/students/${id}?_method=PUT`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/students/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// RESULTS / EXAMINATIONS  →  Laravel: App\Http\Controllers\ExaminationController
// ─────────────────────────────────────────────────────────────────────────────
export const examApi = {
  getExams: (params?: Record<string, unknown>) => api.get('/exams', { params }),
  loadStudentsForMarks: (params: {
    exam_type: string; class_id: string; section_id: string
  }) => api.get('/exams/marks/load', { params }),
  saveMarks: (data: Record<string, unknown>) => api.post('/exams/marks/save', data),
  publishResults: (examId: string) => api.patch(`/exams/${examId}/publish`),
  generateReportCard: (studentId: string, examId: string) =>
    api.get(`/exams/report-card`, { params: { student_id: studentId, exam_id: examId } }),
  getGradingScale: () => api.get('/exams/grading-scale'),
}

// ─────────────────────────────────────────────────────────────────────────────
// INVENTORY  →  Laravel: App\Http\Controllers\InventoryController
// ─────────────────────────────────────────────────────────────────────────────
export const inventoryApi = {
  list: (params?: Record<string, unknown>) => api.get('/inventory', { params }),
  show: (id: string) => api.get(`/inventory/${id}`),
  addStock: (data: Record<string, unknown>) => api.post('/inventory/stock/add', data),
  issueItem: (data: Record<string, unknown>) => api.post('/inventory/issue', data),
  getCategories: () => api.get('/inventory/categories'),
  getLowStockAlerts: () => api.get('/inventory/low-stock'),
}

// ─────────────────────────────────────────────────────────────────────────────
// MESSAGING  →  Laravel: App\Http\Controllers\MessagingController
// ─────────────────────────────────────────────────────────────────────────────
export const messagingApi = {
  getInbox: (params?: Record<string, unknown>) => api.get('/messages/inbox', { params }),
  getSent: (params?: Record<string, unknown>) => api.get('/messages/sent', { params }),
  getDrafts: () => api.get('/messages/drafts'),
  show: (id: string) => api.get(`/messages/${id}`),
  send: (data: Record<string, unknown>) => api.post('/messages/send', data),
  sendBulk: (data: Record<string, unknown>) => api.post('/messages/bulk', data),
  delete: (id: string) => api.delete(`/messages/${id}`),
  markRead: (id: string) => api.patch(`/messages/${id}/read`),
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS  →  Laravel: App\Http\Controllers\ReportController
// ─────────────────────────────────────────────────────────────────────────────
export const reportApi = {
  getAnalytics: () => api.get('/reports/analytics'),
  getEnrollmentTrends: (params?: Record<string, unknown>) => api.get('/reports/enrollment', { params }),
  getFeeCollection: (params?: Record<string, unknown>) => api.get('/reports/fee-collection', { params }),
  getTopPerformers: (params?: Record<string, unknown>) => api.get('/reports/top-performers', { params }),
  getAttendanceReport: (params?: Record<string, unknown>) => api.get('/reports/attendance', { params }),
  generate: (data: Record<string, unknown>) =>
    api.post('/reports/generate', data, { responseType: 'blob' }),
  exportData: (params?: Record<string, unknown>) =>
    api.get('/reports/export', { params, responseType: 'blob' }),
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS  →  Laravel: App\Http\Controllers\SettingsController
// ─────────────────────────────────────────────────────────────────────────────
export const settingsApi = {
  getClasses: () => api.get('/settings/classes'),
  addClass: (data: Record<string, unknown>) => api.post('/settings/classes', data),
  updateClass: (id: string, data: Record<string, unknown>) => api.put(`/settings/classes/${id}`, data),
  getTerms: () => api.get('/settings/terms'),
  addTerm: (data: Record<string, unknown>) => api.post('/settings/terms', data),
  updateTerm: (id: string, data: Record<string, unknown>) => api.put(`/settings/terms/${id}`, data),
  getNotices: () => api.get('/settings/notices'),
  postNotice: (data: Record<string, unknown>) => api.post('/settings/notices', data),
  deleteNotice: (id: string) => api.delete(`/settings/notices/${id}`),
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORT CARDS  →  Laravel: App\\Http\\Controllers\\ReportCardController
// ─────────────────────────────────────────────────────────────────────────────
export const reportCardApi = {
  // GET /api/report-card?exam_type=...&class=...&section=...&student_id=...
  getReportCard: (params: Record<string, unknown>) => api.get('/report-card', { params }),
  // POST /api/report-card/generate  → returns PDF blob
  generatePdf: (data: Record<string, unknown>) =>
    api.post('/report-card/generate', data, { responseType: 'blob' }),
  // POST /api/report-card/bulk-generate  → returns ZIP of PDFs
  bulkGenerate: (data: Record<string, unknown>) =>
    api.post('/report-card/bulk-generate', data, { responseType: 'blob' }),
}
