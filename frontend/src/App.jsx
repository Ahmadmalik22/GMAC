import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ProgramsPage from './pages/ProgramsPage'
import NewsPage from './pages/NewsPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import TeacherDashboard from './pages/TeacherDashboard'
import MarkAttendance from './pages/MarkAttendance'
import AdminDashboard from './pages/AdminDashboard'
import RegisterTeacher from './pages/RegisterTeacher'
import AddStudent from './pages/AddStudent'
import ViewAttendance from './pages/ViewAttendance'
import EditStudentInfo from './pages/EditStudentInfo'
import StudentStats from './pages/StudentStats'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-govt-gray-light flex items-center justify-center">
        <div className="flex items-center space-x-2 text-govt-primary">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-govt-gray-light flex items-center justify-center">
        <div className="flex items-center space-x-2 text-govt-primary">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Loading...</span>
        </div>
      </div>
    )
  }

  // Redirect authenticated users to their dashboard
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />
    }
  }

  return children
}

// App Initializer Component
const AppInitializer = () => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-govt-gray-light flex items-center justify-center">
        <div className="flex items-center space-x-2 text-govt-primary">
          <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg font-medium">Initializing GMAC Attendance System...</span>
        </div>
      </div>
    )
  }

  return null // This component doesn't render anything, just handles initialization
}

// Redirect Handler for invalid routes
const RedirectHandler = () => {
  const { isAuthenticated, user } = useAuth()

  // Redirect authenticated users to their dashboard, others to home
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />
    }
  }

  return <Navigate to="/" replace />
}

function App() {
  return (
    <AuthProvider>
      <AppInitializer />
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="contact" element={<ContactPage />} />
          </Route>

          {/* Login Route (redirects authenticated users) */}
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />

          {/* Teacher Routes (protected) */}
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />
          <Route path="/teacher/mark-attendance" element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <MarkAttendance />
            </ProtectedRoute>
          } />

          {/* Admin Routes (protected) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/register-teacher" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RegisterTeacher />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-student" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddStudent />
            </ProtectedRoute>
          } />
          <Route path="/admin/view-attendance" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewAttendance />
            </ProtectedRoute>
          } />
          <Route path="/admin/edit-student-info" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <EditStudentInfo />
            </ProtectedRoute>
          } />
          <Route path="/admin/student-stats" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <StudentStats />
            </ProtectedRoute>
          } />

          {/* Catch all route - smart redirect based on auth status */}
          <Route path="*" element={<RedirectHandler />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </AuthProvider>
  )
}

export default App

