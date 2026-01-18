import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI } from '../services/api'
import toast from 'react-hot-toast'

function AdminDashboard() {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const adminOptions = [
    {
      id: 'register-teacher',
      title: 'Register Teacher',
      description: 'Add new teachers to the system',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      id: 'add-student',
      title: 'Add Student',
      description: 'Register new students in the system',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'view-attendance',
      title: 'View Attendance',
      description: 'View and edit all attendance records',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 'edit-student-info',
      title: 'Student Hub',
      description: 'Manage profiles, subjects, and enrollment status',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    },
    {
      id: 'student-stats',
      title: 'Student Statistics',
      description: 'View attendance reports and analytics',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'from-teal-600 to-teal-700'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      description: 'Configure system preferences and settings',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-600',
      hoverColor: 'from-indigo-600 to-indigo-700'
    }
  ]

  return (
    <div className="min-h-screen bg-govt-gray-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg inline-block mb-6">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1 className="text-4xl font-display font-bold text-govt-primary mb-4 animate-fade-in-down">
            Admin Dashboard
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-govt-primary to-govt-secondary mx-auto mb-4 animate-scale-in"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage teachers, students, and view comprehensive system analytics and reports.
          </p>
        </div>

        {/* Statistics Overview */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading statistics...</span>
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.overview.totalStudents}</div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.overview.totalTeachers}</div>
              <div className="text-gray-600">Total Teachers</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.overview.totalClasses}</div>
              <div className="text-gray-600">Total Classes</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.overview.totalAttendanceRecords}</div>
              <div className="text-gray-600">Attendance Records</div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminOptions.map((option, index) => {
            if (option.id === 'system-settings') {
              return (
                <div
                  key={option.id}
                  onClick={() => setShowComingSoon(true)}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border-t-4 border-transparent hover:border-gray-400 cursor-pointer`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br ${option.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {option.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors duration-300">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                      Coming Soon
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gray-400 transition-colors duration-300`}></div>
                </div>
              );
            } else {
              return (
                <Link
                  key={option.id}
                  to={`/admin/${option.id}`}
                  className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up border-t-4 border-transparent hover:border-govt-primary`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-xl bg-gradient-to-br ${option.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {option.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-display font-bold text-gray-900 mb-3 group-hover:text-govt-primary transition-colors duration-300">
                      {option.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                      {option.description}
                    </p>

                    {/* Arrow */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-6 h-6 text-govt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-govt-primary transition-colors duration-300`}></div>
                </Link>
              );
            }
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-govt-primary to-govt-secondary text-white font-semibold rounded-xl hover:from-govt-secondary hover:to-govt-primary transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-4 rounded-full inline-block mb-6">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-gray-600 mb-6">
              This feature is currently under development. We're working hard to bring you the best admin experience possible.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="px-6 py-3 bg-gradient-to-r from-govt-primary to-govt-secondary text-white font-semibold rounded-xl hover:from-govt-secondary hover:to-govt-primary transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
