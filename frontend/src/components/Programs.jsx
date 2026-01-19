import React from 'react'
import { Link } from 'react-router-dom'

function Programs() {
  const programs = [
    {
      title: "FSC Medical",
      description: "Comprehensive medical education focusing on Biology, Chemistry, and Physics to prepare for medical careers.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "from-rose-500 to-pink-600"
    },
    {
      title: "FSC Pre Engineering",
      description: "Advanced scientific program emphasizing Mathematics, Physics, and Chemistry for future engineers.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "FA",
      description: "Foundational humanities education including subjects like History, Political Science, and English.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "FA IT",
      description: "A blend of traditional humanities with essential Information Technology skills for the modern era.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-teal-500 to-emerald-600"
    },
    {
      title: "ICS",
      description: "Focused program in Computer Science, Mathematics, and Physics to build a strong tech foundation.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: "from-purple-500 to-violet-600"
    }
  ]

  return (
    <section id="programs" className="py-24 bg-govt-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">Our Academic Programs</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-govt-primary to-govt-secondary mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Empowering students with knowledge and skills through our diverse range of world-class educational programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-govt-primary/20 relative overflow-hidden"
            >
              {/* Card Background Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-5 -mr-16 -mt-16 rounded-full transition-opacity duration-500`}></div>

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center text-white mb-8 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                {program.icon}
              </div>

              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-govt-primary transition-colors duration-300">
                {program.title}
              </h3>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {program.description}
              </p>

              <Link
                to="/programs"
                className="inline-flex items-center text-govt-primary font-bold group/link"
              >
                Learn More
                <svg className="w-5 h-5 ml-2 transform group-hover/link:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center space-x-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-display font-bold text-lg hover:bg-govt-primary transition-all duration-300 shadow-xl hover:shadow-govt-primary/20"
          >
            <span>Explore All Programs</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Programs

