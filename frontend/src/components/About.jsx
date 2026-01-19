import React from 'react'

function About() {
  const stats = [
    { label: "Students", value: "200+", icon: "👨‍🎓", color: "text-blue-600" },
    { label: "Faculty", value: "20+", icon: "👨‍🏫", color: "text-emerald-600" },
    { label: "Programs", value: "5", icon: "📚", color: "text-purple-600" },
    { label: "Years", value: "25+", icon: "🏛️", color: "text-amber-600" },
  ]

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content Side */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 bg-govt-primary/10 text-govt-primary px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-bold uppercase tracking-wider">About Our Institution</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8 leading-tight">
              Decades of <span className="text-govt-primary">Academic Excellence</span> & Innovation
            </h2>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Muslim Associate College stands as a beacon of quality education, fostering an environment where students can excel academically and grow personally.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-govt-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-govt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h4>
                  <p className="text-gray-600">To provide accessible, high-quality education that empowers students to achieve their academic and personal goals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-govt-secondary/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-govt-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h4>
                  <p className="text-gray-600">To be a leading global institution producing graduates who contribute meaningfully to society with integrity.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Viz Side */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10 grid grid-cols-2 gap-6">
              {stats.map((stat, idx) => (
                <div key={idx} className={`bg-govt-gray-light p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${idx % 2 === 1 ? 'mt-8' : ''}`}>
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className={`text-4xl font-display font-black ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-gray-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-govt-primary/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About

