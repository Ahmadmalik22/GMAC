import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { teacherAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function TeacherDashboard() {
  const { user } = useAuth()
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await teacherAPI.getDashboard()
      if (response.data) {
        setDashboardData(response.data)
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const dashboardOptions = [
    {
      id: 'mark-attendance',
      title: 'Mark Attendance',
      description: 'Take student attendance for classes',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 'student-reports',
      title: 'Student Reports',
      description: 'View and analyze student performance',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 'assignments',
      title: 'Assignments',
      description: 'Create and manage assignments',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      id: 'grade-book',
      title: 'Grade Book',
      description: 'Enter and manage student grades',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    },
    {
      id: 'class-schedule',
      title: 'Class Schedule',
      description: 'View and manage class timings',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-teal-500 to-teal-600',
      hoverColor: 'from-teal-600 to-teal-700'
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Post class announcements',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
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
          <div className="bg-gradient-to-br from-govt-primary to-govt-secondary text-white p-4 rounded-xl shadow-lg inline-block mb-6">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h1 className="text-4xl font-display font-bold text-govt-primary mb-4 animate-fade-in-down">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-govt-primary to-govt-secondary mx-auto mb-4 animate-scale-in"></div>

          {/* Teacher Information */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Teacher Information</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {user?.qualification || 'Not specified'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h2a2 2 0 012 2v4m-6 8v6a2 2 0 002 2h2a2 2 0 002-2v-6m-6-4h6" />
                    </svg>
                    {user?.experience ? `${user.experience} years experience` : 'Experience not specified'}
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Subjects You Teach:</h4>
                <div className="flex flex-wrap gap-1 justify-start sm:justify-end">
                  {user?.subjects && user.subjects.length > 0 ? (
                    user.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-md"
                      >
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No subjects assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to your teaching portal. Choose an option below to manage your classes and students effectively.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-govt-primary"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Statistics */}
        {dashboardData && dashboardData.statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{dashboardData.statistics.totalClasses || 0}</div>
              <div className="text-gray-600">Total Classes</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{dashboardData.statistics.totalStudents || 0}</div>
              <div className="text-gray-600">Total Students</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{dashboardData.statistics.attendanceThisMonth?.present || 0}</div>
              <div className="text-gray-600">Present (This Month)</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{dashboardData.statistics.attendanceThisMonth?.percentage || 0}%</div>
              <div className="text-gray-600">Avg Attendance</div>
            </div>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dashboardOptions.map((option, index) => {
            if (option.id === 'mark-attendance') {
              return (
                <Link
                  key={option.id}
                  to={`/teacher/${option.id}`}
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
            } else {
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
              This feature is currently under development. We're working hard to bring you the best teaching experience possible.
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

export default TeacherDashboard
