import React from 'react'

function NewsPage() {
  const allNews = [
    {
      title: "Admission Open for Academic Year 2026-27",
      date: "January 15, 2026",
      excerpt: "Applications are now open for FSC Medical, FSC Pre Engineering, FA, FA IT, and ICS programs. Final date for submission is March 31.",
      category: "Admissions",
      color: "blue"
    },
    {
      title: "Board Exam Schedule Released",
      date: "January 10, 2026",
      excerpt: "The Board of Intermediate Education has released the tentative schedule for annual examinations starting from May 2026.",
      category: "Academic",
      color: "purple"
    },
    {
      title: "New Computer Lab for ICS & FA IT",
      date: "January 5, 2026",
      excerpt: "A state-of-the-art computer laboratory with latest high-end machines has been inaugurated to support our IT students.",
      category: "Infrastructure",
      color: "indigo"
    },
    {
      title: "College Achieves Top Merit Positions",
      date: "December 20, 2025",
      excerpt: "We are proud to announce that several of our students have secured top merit positions in the regional board competitions.",
      category: "Achievements",
      color: "emerald"
    },
    {
      title: "Annual Sports Week Starts Next Monday",
      date: "December 15, 2025",
      excerpt: "Preparation for the annual sports week is in full swing. Students are encouraged to participate in cricket, football, and athletics.",
      category: "Campus Life",
      color: "orange"
    },
    {
      title: "Workshop on Career Counseling",
      date: "December 10, 2025",
      excerpt: "Special sessions for 12th year students to help them choose the best career paths and universities after intermediate.",
      category: "Counseling",
      color: "rose"
    }
  ]

  const getColorClasses = (color) => {
    const colormap = {
      blue: "border-blue-200 text-blue-700 bg-blue-50",
      emerald: "border-emerald-200 text-emerald-700 bg-emerald-50",
      purple: "border-purple-200 text-purple-700 bg-purple-50",
      orange: "border-orange-200 text-orange-700 bg-orange-50",
      rose: "border-rose-200 text-rose-700 bg-rose-50",
      indigo: "border-indigo-200 text-indigo-700 bg-indigo-50"
    }
    return colormap[color] || colormap.blue
  }

  return (
    <div className="bg-govt-gray-light min-h-screen">
      {/* Simple Header */}
      <section className="bg-gray-900 py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">News & Updates</h1>
          <div className="w-20 h-1.5 bg-govt-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Stay informed about the latest happenings, announcements, and events at our college.
          </p>
        </div>
      </section>

      {/* News List */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getColorClasses(item.color)}`}>
                    {item.category}
                  </span>
                  <span className="text-gray-400 text-xs font-bold">{item.date}</span>
                </div>

                <h3 className="text-xl font-display font-bold text-gray-900 mb-4 leading-tight">
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
    </div>
  )
}

export default NewsPage
