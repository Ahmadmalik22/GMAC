import React from 'react'
import News from '../components/News'

function NewsPage() {
  // Purely static dummy data for the News Page
  const allNews = [
    {
      title: "Admission Open for Academic Year 2024-25",
      date: "March 15, 2024",
      excerpt: "Applications are now open for all undergraduate and postgraduate programs. Join our community of excellence.",
      category: "Admissions",
      color: "blue"
    },
    {
      title: "College Achieves 95% Placement Rate",
      date: "March 10, 2024",
      excerpt: "Our graduating class of 2024 has secured placements in top multinational corporations and government sectors.",
      category: "Achievements",
      color: "emerald"
    },
    {
      title: "New state-of-the-art Science Lab",
      date: "March 5, 2024",
      excerpt: "We have inaugurated a new research facility equipped with the latest scientific instruments for our STEM students.",
      category: "Infrastructure",
      color: "purple"
    },
    {
      title: "Annual Sports Week 2024 Announced",
      date: "March 1, 2024",
      excerpt: "Get ready for the most awaited event of the year. Registrations for various indoor and outdoor sports are now open.",
      category: "Campus Life",
      color: "orange"
    },
    {
      title: "Financial Aid and Scholarships 2024",
      date: "February 25, 2024",
      excerpt: "New merit-based and need-based scholarship programs are now available for eligible students. Apply by March 31.",
      category: "Financial Aid",
      color: "rose"
    },
    {
      title: "Workshop on Artificial Intelligence",
      date: "February 20, 2024",
      excerpt: "A three-day intensive workshop on AI and Machine Learning hosted by industry experts from leading tech firms.",
      category: "Academic",
      color: "indigo"
    },
    {
      title: "Inter-College Debate Competition",
      date: "February 15, 2024",
      excerpt: "Our debate team secured the first position in the regional inter-college competition held at City Hall.",
      category: "Achievements",
      color: "emerald"
    },
    {
      title: "Parent-Teacher Meeting Schedule",
      date: "February 10, 2024",
      excerpt: "The first PTM for the current semester is scheduled for next Saturday. All parents are encouraged to attend.",
      category: "Information",
      color: "blue"
    },
    {
      title: "New Digital Library Access",
      date: "February 5, 2024",
      excerpt: "Students can now access over 50,000+ e-books and journals through our new institutional digital portal.",
      category: "Resource",
      color: "purple"
    }
  ]

  const getColorClasses = (color) => {
    const colormap = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      rose: "bg-rose-50 text-rose-600 border-rose-100",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
    }
    return colormap[color] || colormap.blue
  }

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="relative py-32 bg-govt-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070')] bg-cover bg-center opacity-10 grayscale"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">Press & News</h1>
          <p className="text-xl text-teal-50 max-w-2xl mx-auto font-medium opacity-90 animate-fade-in-up animate-delay-200">
            Latest updates and stories from the heart of Muslim Associate College.
          </p>
        </div>
      </section>

      {/* Featured Component View */}
      <div className="relative -mt-16 z-20">
        <News />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Filtering Tabs Mockup */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {['All Posts', 'Admissions', 'Academic', 'Campus', 'Achievements'].map((tab, idx) => (
            <button
              key={idx}
              className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${idx === 0 ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getColorClasses(item.color)}`}>
                  {item.category}
                </span>
                <span className="text-gray-400 text-xs font-bold">{item.date}</span>
              </div>

              <h3 className="text-xl font-display font-bold text-gray-900 mb-4 group-hover:text-govt-primary transition-colors">
                {item.title}
              </h3>

              <p className="text-gray-600 mb-8 leading-relaxed flex-grow line-clamp-3">
                {item.excerpt}
              </p>

              <button
                className="inline-flex items-center text-gray-900 font-black text-sm uppercase tracking-widest group/btn"
              >
                Read Article
                <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-32 bg-gray-50 rounded-[3rem] p-12 md:p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-10">
            <svg className="w-10 h-10 text-govt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-10 text-lg">
            Get the latest academic news and campus updates delivered straight to your inbox.
          </p>
          <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-grow px-8 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-govt-primary/20 transition-all font-medium"
            />
            <button className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-govt-primary transition-all duration-300 shadow-xl shadow-gray-900/10">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewsPage

