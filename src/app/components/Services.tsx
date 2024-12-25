// components/Services.tsx
import React from 'react';
import { Truck, Package, Clock, Shield, Warehouse, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Package className="w-12 h-12 text-blue-600" />,
      title: "Less Than Truckload (LTL)",
      description: "Cost-effective shipping for partial loads. Rates from $2.50/mile with flexible pickup and delivery options.",
      rates: {
        base: "$250 base rate",
        perMile: "From $2.50/mile",
        minimum: "100 mile minimum"
      }
    },
    {
      icon: <Truck className="w-12 h-12 text-blue-600" />,
      title: "Full Truckload (FTL)",
      description: "Dedicated trucks for your shipments. Volume discounts and competitive rates for long-haul transport.",
      rates: {
        base: "$500 base rate",
        perMile: "From $3.00/mile",
        minimum: "250 mile minimum"
      }
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600" />,
      title: "Expedited Shipping",
      description: "Time-critical deliveries with guaranteed transit times. Priority handling and real-time tracking.",
      rates: {
        base: "$750 base rate",
        perMile: "From $3.75/mile",
        minimum: "No minimum distance"
      }
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: "Specialized Transport",
      description: "Custom solutions for oversized, heavy haul, and sensitive cargo requiring special handling.",
      rates: {
        base: "Custom pricing",
        perMile: "Based on requirements",
        minimum: "Contact for quote"
      }
    },
    {
      icon: <Warehouse className="w-12 h-12 text-blue-600" />,
      title: "Warehousing & Distribution",
      description: "Short and long-term storage solutions with cross-docking and distribution services.",
      rates: {
        base: "Monthly rates available",
        perMile: "Distribution rates vary",
        minimum: "30-day minimum"
      }
    },
    {
      icon: <Globe className="w-12 h-12 text-blue-600" />,
      title: "Nationwide Coverage",
      description: "Comprehensive shipping solutions across all 50 states with reliable transit times.",
      rates: {
        base: "Zone-based pricing",
        perMile: "Distance-based rates",
        minimum: "Varies by service"
      }
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Services & Rates</h2>
          <p className="text-xl text-gray-600">
            Competitive shipping solutions tailored to your needs
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Rate Information:</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>Base Rate: {service.rates.base}</li>
                  <li>Per Mile: {service.rates.perMile}</li>
                  <li>Minimum: {service.rates.minimum}</li>
                </ul>
              </div>
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
                Get Quote
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            * Rates may vary based on distance, weight, and specific requirements
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300">
            Download Rate Sheet
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;