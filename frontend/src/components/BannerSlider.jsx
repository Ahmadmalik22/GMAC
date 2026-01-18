import React from 'react'
import Slider from 'react-slick'
import { Link } from 'react-router-dom'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: true,
  }

  const slides = [
    {
      id: 1,
      title: "Welcome to Muslim Associate College",
      subtitle: "Excellence in Education, Character, and Service",
      description: "A premier government institution dedicated to providing quality education",
      image: "/images/clg-1.jpeg", // Placeholder - you can add your image here
      buttonText: "Explore Programs",
      buttonLink: "/programs",
    },
    {
      id: 2,
      title: "Admissions Open 2024-25",
      subtitle: "Shape Your Future with Us",
      description: "Join our diverse community of learners and achieve your academic goals",
      image: "/images/clg-2.jpeg", // Placeholder - you can add your image here
      buttonText: "Apply Now",
      buttonLink: "/contact",
    },
    {
      id: 3,
      title: "Excellence in Research & Innovation",
      subtitle: "Building Tomorrow's Leaders",
      description: "State-of-the-art facilities and experienced faculty to guide your journey",
      image: "/images/clg-1.jpeg", // Placeholder - you can add your image here
      buttonText: "Learn More",
      buttonLink: "/about",
    },
  ]

  return (
    <div className="relative">
      <Slider {...settings} className="banner-slider">
        {slides.map((slide) => (
          <div key={slide.id} className="relative">
            <div 
              className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-govt-primary via-govt-secondary to-govt-dark overflow-hidden"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-govt-dark/70 via-govt-primary/60 to-govt-dark/70"></div>
              
              {/* Placeholder if image not available */}
              {!slide.image && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-govt-primary via-govt-secondary to-govt-dark animate-pulse-slow">
                  <div className="text-center text-white opacity-40 animate-fade-in">
                    <svg className="w-32 h-32 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">Banner Image Placeholder</p>
                    <p className="text-sm">Add your image at: {slide.image}</p>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-3xl animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight animate-fade-in-up animate-delay-200">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-medium animate-fade-in-up animate-delay-300">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg md:text-xl text-white/80 mb-8 animate-fade-in-up animate-delay-400">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.buttonLink}
                      className="inline-block bg-white text-govt-primary px-8 py-4 rounded-xl font-display font-bold text-lg hover:bg-govt-gray-light transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 animate-fade-in-up animate-delay-500"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Custom styles for slider */}
      <style>{`
        .banner-slider .slick-dots {
          bottom: 30px;
        }
        .banner-slider .slick-dots li button:before {
          color: white;
          font-size: 12px;
          opacity: 0.5;
        }
        .banner-slider .slick-dots li.slick-active button:before {
          color: white;
          opacity: 1;
        }
        .banner-slider .slick-prev,
        .banner-slider .slick-next {
          z-index: 10;
          width: 50px;
          height: 50px;
        }
        .banner-slider .slick-prev {
          left: 20px;
        }
        .banner-slider .slick-next {
          right: 20px;
        }
        .banner-slider .slick-prev:before,
        .banner-slider .slick-next:before {
          font-size: 40px;
          color: white;
          opacity: 0.8;
        }
        .banner-slider .slick-prev:hover:before,
        .banner-slider .slick-next:hover:before {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}

export default BannerSlider

