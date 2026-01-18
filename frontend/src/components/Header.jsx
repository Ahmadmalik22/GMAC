import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, loading } = useAuth()

  const isActive = (path) => {
    return location.pathname === path
  }

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/programs', label: 'Programs' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' }
  ]

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-govt-gray-medium animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 group animate-fade-in-left">
            <div className="bg-gradient-to-br from-govt-primary to-govt-secondary text-white p-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-govt-primary group-hover:text-govt-secondary transition-colors">Muslim Associate College</h1>
              <p className="text-sm text-accent-600 font-medium">Government College</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 animate-fade-in-right">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-all duration-300 relative group ${
                  isActive(link.path)
                    ? 'text-govt-primary'
                    : 'text-accent-700 hover:text-govt-primary'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-govt-primary to-govt-secondary animate-scale-in"></span>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-govt-primary to-govt-secondary group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}

            {/* Authentication Section */}
            {loading ? (
              <div className="flex items-center space-x-2 text-gray-500">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm">Loading...</span>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-govt-primary font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs bg-govt-primary/10 text-govt-primary px-2 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>

                {/* Dashboard Button */}
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard'}
                  className="bg-gradient-to-r from-govt-primary to-govt-secondary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl"
                >
                  {user.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
                </Link>

                <button
                  onClick={async () => {
                    await logout()
                    navigate('/')
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-govt-primary to-govt-secondary text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 shadow-md hover:scale-105 hover:shadow-xl"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in-down">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-medium py-2 px-2 rounded-lg transition-all duration-300 animate-fade-in-left ${
                    isActive(link.path)
                      ? 'text-govt-primary font-bold bg-govt-primary/10'
                      : 'text-accent-700 hover:text-govt-primary hover:bg-govt-gray-light'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Authentication Section */}
              <div className="border-t border-gray-200 pt-2 mt-2">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2 text-gray-500 py-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-govt-primary font-medium bg-govt-primary/5 p-2 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div>
                        <div className="text-sm font-semibold">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-xs text-govt-primary/70 capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Dashboard Button */}
                    <Link
                      to={user.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard'}
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full bg-gradient-to-r from-govt-primary to-govt-secondary text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center block shadow-md"
                    >
                      {user.role === 'admin' ? 'Admin Dashboard' : 'Teacher Dashboard'}
                    </Link>

                    <button
                      onClick={async () => {
                        await logout()
                        navigate('/')
                        setIsMenuOpen(false)
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-govt-primary to-govt-secondary text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 text-center block shadow-md animate-fade-in-up"
                  >
                    Login
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header

