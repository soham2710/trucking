'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image'; // Import Image component from next/image

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/api/placeholder/1200/600",
      title: "Modern Fleet Solutions",
      description: "State-of-the-art trucks equipped with the latest technology",
      stats: "500+ Vehicles | 98% On-Time Delivery"
    },
    {
      image: "/api/placeholder/1200/600",
      title: "Nationwide Coverage",
      description: "Serving all 50 states with reliable shipping solutions",
      stats: "24/7 Service | Coast-to-Coast Delivery"
    },
    {
      image: "/api/placeholder/1200/600",
      title: "Professional Team",
      description: "Experienced drivers and logistics experts at your service",
      stats: "Certified Drivers | Safety First"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative bg-gray-900">
      <div className="relative h-96 md:h-[600px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            {/* Replaced <img> with <Image /> from next/image */}
            <Image
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              layout="fill" // Ensures the image covers the container
              objectFit="cover" // Ensures proper image fit
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center max-w-3xl px-4">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl mb-6">{slide.description}</p>
                <p className="text-lg text-blue-300">{slide.stats}</p>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white scale-110' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Carousel;
