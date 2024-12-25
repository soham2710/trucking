'use client';
import React from 'react';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import FreightCalculator from './components/FreightCalculator';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          {/* Hero Section */}
          <section id="home" className="relative">
            <Hero />
          </section>

          {/* Quote Calculator Section */}
          <section id="quote" className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Freight Quote</h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Get instant, competitive rates for your shipping needs. Whether you&#39;re shipping LTL or need a full truckload, 
                  we&#39;ve got you covered with reliable carriers nationwide.
                </p>
              </div>
              <FreightCalculator />
            </div>
          </section>

          {/* About Us Section */}
          <section id="about">
            <AboutUs />
          </section>

          {/* Services Section */}
          <section id="services">
            <Services />
          </section>

          {/* Carousel/Gallery Section */}
          <section id="gallery">
            <Carousel />
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
}
