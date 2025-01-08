'use client';

import React from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/components/ui/accordion';

const faqCategories = {
  business: [
    {
      question: "Why should I use FreightCenter for business needs?",
      answer: `FreightCenter is a 3rd-Party Logistics provider offering specialized services like LTL freight shipping, truckload freight shipping, and international shipping. Our dedicated account managers and proprietary technology ensure cost-effective and efficient logistics solutions.`,
    },
  ],
  shipping: [
    {
      question: "What are estimated transit times?",
      answer: "Transit times depend on the service options, transportation mode, weather, and carrier selected. They are estimates provided by carriers and are not guaranteed.",
    },
    {
      question: "What is LTL shipping?",
      answer: "LTL (Less-Than-Truckload) shipping is ideal for freight shipments between 100 lbs and 20,000 lbs, balancing speed and cost efficiency.",
    },
  ],
  costs: [
    {
      question: "How do I determine my shipping cost?",
      answer: "You need the origin, destination, weight, dimensions, and contact information. FreightCenter's quote tool makes this process simple and fast, available 24/7.",
    },
    {
      question: "What is a freight class, and how does it affect my cost?",
      answer: "Freight class determines the shipping cost based on density, stowability, handling, and liability. It ranges from 50 to 500.",
    },
  ],
  billing: [
    {
      question: "Why did I receive a billing adjustment?",
      answer: "Billing adjustments are usually due to incorrect weight information provided at the time of booking.",
    },
    {
      question: "What are my payment options?",
      answer: "FreightCenter accepts all major credit cards and checks for domestic, international, or business shipments, subject to approval.",
    },
  ],
};

const FaqPage = () => {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h1>
          {Object.entries(faqCategories).map(([category, questions]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize">
                {category} Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {questions.map((faq, i) => (
                  <AccordionItem key={`${category}-${i}`} value={`${category}-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FaqPage;