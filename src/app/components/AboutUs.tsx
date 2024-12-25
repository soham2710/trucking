// components/AboutUs.tsx
'use client';
import React from 'react';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    {
      number: "15+",
      label: "Years Experience",
      icon: <Shield className="w-8 h-8 text-blue-600" />
    },
    {
      number: "500+",
      label: "Trucks in Fleet",
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />
    },
    {
      number: "98%",
      label: "On-Time Delivery",
      icon: <Award className="w-8 h-8 text-blue-600" />
    },
    {
      number: "10,000+",
      label: "Happy Clients",
      icon: <Users className="w-8 h-8 text-blue-600" />
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Leading the Way in Transportation Excellence</h2>
            <p className="text-gray-600 mb-8">
              Since 2009, we've been revolutionizing the trucking industry with our 
              commitment to reliability, innovation, and customer satisfaction. Our 
              state-of-the-art fleet and dedicated team ensure your cargo reaches 
              its destination safely and on time.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Industry Certifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>DOT Certified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>FMCSA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>SmartWay Partner</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>ISO 9001:2015</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Modern fleet with GPS tracking and temperature control</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Professional and certified drivers</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Comprehensive cargo insurance coverage</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>24/7 customer support and shipment tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="relative">
              <img 
                src="/about.jpg" 
                alt="Our modern fleet" 
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                <p className="font-bold text-blue-600">Modern Fleet</p>
                <p className="text-sm text-gray-600">500+ Vehicles</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {stat.icon}
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;