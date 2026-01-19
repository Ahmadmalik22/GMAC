import React from 'react'
import { Link } from 'react-router-dom'
import Programs from '../components/Programs'

function ProgramsPage() {
  const detailedPrograms = [
    {
      title: "FSC Medical",
      duration: "2 Years",
      description: "A premier pre-medical program designed for students aiming for careers in medicine, dentistry, and allied health sciences. Our labs and faculty provide the best environment for biological and chemical studies.",
      courses: ["Biology", "Chemistry", "Physics", "English", "Urdu", "Islamic Studies", "Pakistan Studies"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "rose"
    },
    {
      title: "FSC Pre Engineering",
      duration: "2 Years",
      description: "Rigorous scientific training with an emphasis on mathematical analysis and physical principles, preparing students for top engineering universities and technical fields.",
      courses: ["Mathematics", "Physics", "Chemistry", "English", "Urdu", "Islamic Studies", "Pakistan Studies"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "blue"
    },
    {
      title: "FA",
      duration: "2 Years",
      description: "A versatile program in humanities and social sciences, focusing on critical thinking, literature, and political systems to build a strong foundation for future studies in law and arts.",
      courses: ["English Literature", "Political Science", "History", "Civics", "Urdu", "Islamic Studies"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      color: "amber"
    },
    {
      title: "FA IT",
      duration: "2 Years",
      description: "An innovative blend of traditional humanities and modern information technology, providing students with both soft skills and technical proficiency for the digital age.",
      courses: ["Computer Science", "Economics", "English", "Urdu", "Islamic Studies", "Pakistan Studies"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: "teal"
    },
    {
      title: "ICS",
      duration: "2 Years",
      description: "Focused curriculum on computer science and informatics, designed for students aiming to enter the software industry, data science, or computer engineering fields.",
      courses: ["Computer Science", "Mathematics", "Physics", "English", "Urdu", "Islamic Studies"],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      color: "purple"
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Header */}
      <section className="relative py-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/clg-1.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 animate-fade-in-up">Academic Horizon</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-medium animate-fade-in-up animate-delay-200">
            A diverse range of world-class programs designed to shape the leaders of tomorrow.
          </p>
        </div>
      </section>

      {/* Main Programs Component (Summarized View) */}
      <Programs />

      {/* Detailed View Section */}
      <section className="py-24 bg-govt-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">Detailed Curricula</h2>
            <div className="w-20 h-1.5 bg-govt-secondary mx-auto rounded-full mb-8"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {detailedPrograms.map((program, index) => (
              <div
                key={index}
                className="group bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-${program.color}-50 flex items-center justify-center text-${program.color}-600`}>
                    {program.icon}
                  </div>
                  <span className="bg-gray-900 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                    {program.duration}
                  </span>
                </div>

                <h3 className="text-2xl font-display font-bold text-gray-900 mb-4 group-hover:text-govt-primary transition-colors">
                  {program.title}
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed flex-grow">
                  {program.description}
                </p>

                <div>
                  <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Core Modules:</h4>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {program.courses.map((course, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-50 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-100"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center text-govt-primary font-black group/link"
                >
                  Apply for this program
                  <svg className="w-5 h-5 ml-2 transform group-hover/link:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Call to Action */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-govt-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-govt-primary/40">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-govt-secondary/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">Ready to Start Your Journey?</h2>
            <p className="text-xl text-teal-50 mb-12 max-w-2xl mx-auto opacity-90">
              Join thousands of students who are carving their paths to success at Muslim Associate College. Admissions for 2024-25 are closing soon.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-govt-primary px-10 py-5 rounded-2xl font-display font-bold text-lg hover:bg-govt-gray-light transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProgramsPage

