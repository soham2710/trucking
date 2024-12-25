// components/Hero.tsx
'use client';
import React, { useState } from 'react';
import { Truck, Clock, Globe, ShieldCheck, DollarSign } from 'lucide-react';

const Hero = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Thank you for your inquiry. Our team will contact you shortly with competitive rates.');
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <section className="relative bg-gray-900 min-h-screen">
      <div className="absolute inset-0">
        <img 
          src="/hero-bg.jpg" 
          alt="Professional trucking fleet" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Professional Trucking & Logistics Solutions
            </h1>
            <p className="text-xl mb-8">
              Get instant quotes for nationwide shipping. Competitive rates for LTL, 
              FTL, and specialized transport services.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2" />
                <span>24/7 Dispatch</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                <span>50 States Coverage</span>
              </div>
              <div className="flex items-center">
                <ShieldCheck className="w-6 h-6 mr-2" />
                <span>Fully Insured</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                <span>Best Rate Guarantee</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Get Your Freight Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-2 rounded border focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full px-4 py-2 rounded border focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full px-4 py-2 rounded border focus:border-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div>
                <select
                  required
                  className="w-full px-4 py-2 rounded border focus:border-blue-500"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                >
                  <option value="">Select Service Type</option>
                  <option value="ltl">Less Than Truckload (LTL)</option>
                  <option value="ftl">Full Truckload (FTL)</option>
                  <option value="specialized">Specialized Transport</option>
                  <option value="expedited">Expedited Shipping</option>
                </select>
              </div>
              <div>
                <textarea
                  placeholder="Shipment Details (Weight, Dimensions, Special Requirements)"
                  rows={3}
                  className="w-full px-4 py-2 rounded border focus:border-blue-500"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded transition duration-300"
              >
                Request Quote
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;