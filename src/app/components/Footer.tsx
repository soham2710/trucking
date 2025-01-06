// components/Footer.tsx
'use client';
import React from 'react';
import { Truck, Mail } from 'lucide-react';
import { mixpanelTracker } from '@/lib/mixpanel';
import Link from 'next/link';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  const links = [
    { title: "Home", href: "/" },
    { title: "About", href: "/#about" }, 
    { title: "Gallery", href: "/#gallery" },
    { title: "FAQ", href: "/faq" },
    { title: "Glossary", href: "/glossary" }
  ];

  const handleClick = (title: string) => {
    mixpanelTracker.trackButtonClick(`footer_${title.toLowerCase()}`);
  };

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Truck className="w-8 h-8 mr-2" />
            <span className="text-2xl font-bold">Instant Shipping Calulators</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-white transition duration-300"
                onClick={() => handleClick(link.title)}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center mt-4 md:mt-0">
            <Mail className="w-5 h-5 mr-2 text-blue-500" />
            <a 
              href="mailto:info@instantshippingcalculator.com" 
              className="text-gray-400 hover:text-white"
              onClick={() => handleClick('email')}
            >
              info@instantshippingcalculator.com
            </a>
          </div>
        </div>

        <div className="text-center text-gray-400 mt-6">
          © {year} Instant Shipping Calculators. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;