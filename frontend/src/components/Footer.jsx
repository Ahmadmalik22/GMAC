import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-br from-govt-dark via-govt-primary to-govt-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 animate-fade-in-up">
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4 group">
              <div className="bg-white text-govt-primary p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-display font-bold text-white group-hover:text-govt-secondary transition-colors">Muslim Associate College</h3>
            </Link>
            <p className="text-sm text-white/80">
              A premier government institution committed to excellence in education and character development.
            </p>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Home</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">About Us</Link></li>
              <li><Link to="/programs" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Programs</Link></li>
              <li><Link to="/news" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">News</Link></li>
              <li><Link to="/contact" className="text-white/80 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Admissions</a></li>
              <li><a href="#" className="hover:text-white transition">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition">Library</a></li>
              <li><a href="#" className="hover:text-white transition">Student Portal</a></li>
              <li><a href="#" className="hover:text-white transition">Alumni</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 College Street, City, State 12345</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@muslimassociatecollege.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm animate-fade-in">
          <p className="text-white/80">&copy; {new Date().getFullYear()} Muslim Associate College. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

