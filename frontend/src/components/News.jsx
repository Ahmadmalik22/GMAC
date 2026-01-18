import React from 'react'
import { Link } from 'react-router-dom'

function News() {
  const newsItems = [
    {
      title: "Admission Open for Academic Year 2024-25",
      date: "March 15, 2024",
      excerpt: "Applications are now open for undergraduate and postgraduate programs. Apply online before the deadline.",
      category: "Admissions",
      color: "blue"
    },
    {
      title: "College Achieves 95% Placement Rate",
      date: "March 10, 2024",
      excerpt: "Our graduates continue to excel in their careers with top companies recruiting from our campus.",
      category: "Achievements",
      color: "green"
    },
    {
      title: "New Research Center Inaugurated",
      date: "March 5, 2024",
      excerpt: "State-of-the-art research facility opened to promote innovation and scientific discovery.",
      category: "Infrastructure",
      color: "purple"
    },
    {
      title: "Annual Cultural Festival 2024",
      date: "February 28, 2024",
      excerpt: "Join us for our annual cultural celebration featuring performances, exhibitions, and competitions.",
      category: "Events",
      color: "orange"
    }
  ]

  const getColorClasses = (color) => {
    const colormap = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      green: "bg-emerald-50 text-emerald-600 border-emerald-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100"
    }
    return colormap[color] || colormap.blue
  }

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Latest Announcements</h2>
            <div className="w-20 h-1.5 bg-govt-primary rounded-full"></div>
          </div>
          <Link
            to="/news"
            className="inline-flex items-center text-govt-primary font-bold hover:text-govt-dark transition-colors group"
          >
            <span className="mr-2">View All News</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="group bg-govt-gray-light rounded-2xl p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 border border-transparent hover:border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getColorClasses(item.color)}`}>
                  {item.category}
                </span>
                <span className="text-gray-400 text-sm font-medium flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.date}
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-govt-primary transition-colors duration-300">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                {item.excerpt}
              </p>

              <Link
                to="/news"
                className="inline-flex items-center text-gray-900 font-bold hover:text-govt-primary transition-colors group/btn"
              >
                Read Full Story
                <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default News

