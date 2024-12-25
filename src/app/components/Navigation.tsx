'use client';

import { useState } from 'react';
import { Truck, Menu, X } from 'lucide-react';
import Link from 'next/link';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mainNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Contact', href: '/#contact' }
  ];

  const resourceNavItems = [
    { label: 'FAQ', href: '/faq' },
    { label: 'Glossary', href: '/glossary' }
  ];

  // Function to handle smooth scroll for hash links
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.href;
    if (href.includes('#')) {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Truck className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">TruckCo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleClick}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
            {resourceNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/#quote"
              onClick={handleClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Get Quote
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {mainNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={handleClick}
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
            {resourceNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/#quote"
              onClick={handleClick}
              className="block mt-2 bg-blue-600 text-white px-4 py-2 rounded text-center"
            >
              Get Quote
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;