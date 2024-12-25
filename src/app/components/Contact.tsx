// components/Contact.tsx
'use client';
import React from 'react';
import { Phone, Mail, MapPin, Clock, Truck } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-8 h-8 text-blue-600" />,
      title: "Call Us 24/7",
      details: [
        "Toll Free: 1-800-TRUCKING",
        "Direct: (555) 123-4567"
      ]
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Email Us",
      details: [
        "quotes@yourtrucking.com",
        "support@yourtrucking.com"
      ]
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Main Office",
      details: [
        "123 Logistics Way",
        "Transport City, TC 12345"
      ]
    }
  ];

  const features = [
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      text: "24/7 Dispatch Available"
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      text: "Real-Time Shipment Tracking"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl text-gray-600">
            Get in touch with our logistics experts for personalized shipping solutions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition duration-300"
            >
              <div className="inline-block p-3 bg-blue-50 rounded-full mb-4">
                {info.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600">{detail}</p>
              ))}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 lg:p-12">
              <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 rounded border focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 rounded border focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 rounded border focus:border-blue-500"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded 
                           transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
            <div className="bg-gray-900 p-8 lg:p-12 text-white">
              <h3 className="text-2xl font-bold mb-6">Quick Support</h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {feature.icon}
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <h4 className="font-bold mb-4">Business Hours</h4>
                <div className="space-y-2">
                  <p>Monday - Friday: 24 Hours</p>
                  <p>Saturday: 24 Hours</p>
                  <p>Sunday: 24 Hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;