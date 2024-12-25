// components/Hero.tsx
'use client';
import React from 'react';
import { Clock, Globe, ShieldCheck, DollarSign } from 'lucide-react';

const Hero = () => {
  const scrollToQuote = () => {
    const quoteSection = document.getElementById('quote');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-gray-900 min-h-[80vh]">
      <div className="absolute inset-0">
        <img
          src="/hero-bg.jpg"
          alt="Professional trucking fleet"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Professional Trucking & Logistics Solutions
          </h1>
          <p className="text-xl mb-8">
            Get instant quotes for nationwide shipping. Competitive rates for LTL, 
            FTL, and specialized transport services.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center justify-center">
              <Clock className="w-6 h-6 mr-2" />
              <span>24/7 Dispatch</span>
            </div>
            <div className="flex items-center justify-center">
              <Globe className="w-6 h-6 mr-2" />
              <span>50 States Coverage</span>
            </div>
            <div className="flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 mr-2" />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center justify-center">
              <DollarSign className="w-6 h-6 mr-2" />
              <span>Best Rate Guarantee</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={scrollToQuote}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Get Your Free Quote
            </button>
            <a
              href="#services"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition duration-300"
            >
              Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;