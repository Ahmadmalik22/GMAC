import React from 'react'

function AboutPage() {
  const values = [
    {
      title: "Academic Excellence",
      description: "We strive for the highest standards in education, research, and holistic development.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Moral Integrity",
      description: "Upholding strong ethical principles and honesty in all professional and personal interactions.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.14c1.744-2.772 2.753-6.054 2.753-9.571m0 0V5a2 2 0 012-2h2a2 2 0 012 2v6m0 0c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.14c1.744-2.772 2.753-6.054 2.753-9.571m0 0V5a2 2 0 01-2-2h-2a2 2 0 01-2 2v6" />
        </svg>
      )
    },
    {
      title: "Social Responsibility",
      description: "Fostering a sense of duty toward the community and the environment.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: "Innovation",
      description: "Encouraging creative thinking and new approaches to learning and problem-solving.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-govt-dark overflow-hidden">
        <div className="absolute inset-0 bg-[url('../public/images/clg-4.jpeg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Our Legacy</h1>
          <p className="text-xl text-teal-50 max-w-2xl mx-auto font-medium">
            Building futures and nurturing excellence at Muslim Associate College since 1999.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
          <div>
            <div className="inline-flex items-center space-x-2 bg-govt-primary/10 text-govt-primary px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-bold uppercase tracking-wider font-display">Our History</span>
            </div>
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-8">A Journey of Transformation</h2>
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                Founded with a vision to redefine educational standards, Muslim Associate College has spent over two decades crafting an environment where academic rigor meets holistic development.
              </p>
              <p>
                From our humble beginnings with a single building to becoming one of the region's premier institutions, our focus has always been on the success of our students. We haven't just built a college; we've built a legacy of leaders.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12">
              <div className="border-l-4 border-govt-primary pl-6">
                <div className="text-3xl font-black text-gray-900">25+</div>
                <div className="text-gray-500 font-medium">Years of Experience</div>
              </div>
              <div className="border-l-4 border-govt-secondary pl-6">
                <div className="text-3xl font-black text-gray-900">15000+</div>
                <div className="text-gray-500 font-medium">Successful Alumni</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
              <img
                src='../public/images/clg-1.jpeg'
                alt="College Campus"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-govt-primary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-32">
          <div className="bg-govt-gray-light p-12 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-500">
            <div className="w-16 h-16 bg-govt-primary rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-govt-primary/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-display font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              To empower students with knowledge and skills that transcend the classroom, fostering critical thinking, moral integrity, and a lifelong passion for learning.
            </p>
          </div>

          <div className="bg-gray-900 p-12 rounded-3xl border border-gray-800 hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-900 mb-8 shadow-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-display font-bold text-white mb-6">Our Vision</h3>
            <p className="text-lg text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
              To be recognized globally as a center of educational excellence, producing ethical leaders who drive positive change in a rapidly evolving world.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Our Core Values</h2>
          <div className="w-20 h-1.5 bg-govt-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, idx) => (
            <div key={idx} className="p-8 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="text-govt-primary mb-6">{value.icon}</div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AboutPage

