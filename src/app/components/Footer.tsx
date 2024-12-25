// components/Footer.tsx
'use client';
import React from 'react';
import { Truck, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    services: [
      { title: "LTL Shipping", href: "#" },
      { title: "FTL Transport", href: "#" },
      { title: "Specialized Cargo", href: "#" },
      { title: "Expedited Delivery", href: "#" }
    ],
    company: [
      { title: "About Us", href: "#about" },
      { title: "Contact", href: "#contact" },
      { title: "Careers", href: "#careers" },
      { title: "News", href: "#news" }
    ],
    resources: [
      { title: "Shipping Calculator", href: "#calculator" },
      { title: "Track Shipment", href: "#track" },
      { title: "Request Quote", href: "#quote" },
      { title: "Coverage Map", href: "#map" }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <Truck className="w-8 h-8 mr-2" />
              <span className="text-2xl font-bold">TruckCo</span>
            </div>
            <p className="text-gray-400 mb-6">
              Professional trucking and logistics solutions serving businesses nationwide 
              with reliable and efficient shipping services.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-blue-500" />
                <span>1-800-TRUCKING</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blue-500" />
                <span>info@truckco.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                <span>123 Logistics Way, TC 12345</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Services</h3>
            <ul className="space-y-4">
              {links.services.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              {links.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Resources</h3>
            <ul className="space-y-4">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition duration-300"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © {year} TruckCo. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div className="text-center mt-4">
            <a href="/privacy" className="text-gray-400 hover:text-white mr-4">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;