import React from 'react'

function News() {
  const newsItems = [
    {
      title: "Admission Open for Academic Year 2026-27",
      date: "January 15, 2026",
      excerpt: "Applications are now open for FSC Medical, FSC Pre Engineering, FA, FA IT, and ICS programs. Apply before March 31.",
      category: "Admissions",
      color: "blue"
    },
    {
      title: "Board Exam Schedule Released",
      date: "January 10, 2026",
      excerpt: "The tentative schedule for annual examinations starting from May 2026 has been released for all programs.",
      category: "Academic",
      color: "purple"
    },
    {
      title: "New Computer Lab Inaugurated",
      date: "January 5, 2026",
      excerpt: "State-of-the-art computer laboratory with latest high-end machines has been opened for IT students.",
      category: "Infrastructure",
      color: "indigo"
    },
    {
      title: "College Achieves Top Merit Positions",
      date: "December 20, 2025",
      excerpt: "Several students have secured top merit positions in the regional board competitions recently.",
      category: "Achievements",
      color: "emerald"
    }
  ]

  const getColorClasses = (color) => {
    const colormap = {
      blue: "border-blue-200 text-blue-700 bg-blue-50",
      emerald: "border-emerald-200 text-emerald-700 bg-emerald-50",
      purple: "border-purple-200 text-purple-700 bg-purple-50",
      orange: "border-orange-200 text-orange-700 bg-orange-50",
      indigo: "border-indigo-200 text-indigo-700 bg-indigo-50"
    }
    return colormap[color] || colormap.blue
  }

  return (
    <section id="news" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 text-center">Latest Announcements</h2>
          <div className="w-20 h-1.5 bg-govt-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="bg-govt-gray-light rounded-2xl p-8 border border-transparent transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColorClasses(item.color)}`}>
                  {item.category}
                </span>
                <span className="text-gray-400 text-sm font-medium flex items-center font-display">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {item.date}
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                {item.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {item.excerpt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default News
