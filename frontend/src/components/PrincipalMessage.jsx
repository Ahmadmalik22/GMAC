import React from 'react'

const PrincipalMessage = () => {
    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Abstract background shapes */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-govt-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-govt-secondary/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Overlapping Image Container */}
                    <div className="lg:w-1/2 relative">
                        <div className="relative z-20">
                            {/* Main Image */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                                <img
                                    src="../images/principal.png"
                                    alt="College Principal"
                                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                            </div>

                            {/* Overlapping Badge */}
                            <div className="absolute -bottom-6 -right-6 md:-right-12 bg-white p-6 rounded-2xl shadow-2xl z-30 animate-fade-in-up">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-govt-primary/10 p-3 rounded-xl">
                                        <svg className="w-8 h-8 text-govt-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900">25+ Yrs</div>
                                        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Leadership</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative colored boxes behind image */}
                        <div className="absolute -top-10 -left-10 w-full h-full bg-govt-primary/10 rounded-3xl -z-10 transform rotate-3"></div>
                        <div className="absolute -bottom-10 -right-10 w-full h-full bg-govt-secondary/10 rounded-3xl -z-10 transform -rotate-2"></div>
                    </div>

                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <div className="inline-block px-4 py-2 bg-govt-primary/10 rounded-full text-govt-primary font-bold text-sm tracking-widest uppercase mb-6">
                            Visionary Leadership
                        </div>

                        <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8 leading-tight">
                            A Message from <br />
                            <span className="text-govt-primary">Our Principal</span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-govt-primary pl-6">
                                "Education is not just about academic excellence, but about character building and serving society. At Muslim Associate College, we nurture minds to think critically and hearts to act with integrity."
                            </p>

                            <p className="text-lg text-gray-600 leading-relaxed">
                                As we move forward in this digital age, our commitment remains steadfast: to provide a holistic educational experience that prepares our students for the challenges of tomorrow while keeping them rooted in our shared values.
                            </p>
                        </div>

                        <div className="mt-12 flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full bg-govt-gray-medium flex items-center justify-center p-1 border-2 border-govt-primary">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display font-bold text-govt-primary text-2xl uppercase">
                                        AG
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-2xl font-display font-bold text-gray-900">Abdul Ghafoor</h4>
                                <p className="text-govt-primary font-bold uppercase tracking-widest text-xs">Principal, GMAC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PrincipalMessage
