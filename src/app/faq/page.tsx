// app/faq/page.tsx
'use client';
import React from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';

const FaqPage = () => {
  const faqCategories = {
    business: [
      {
        question: "I'm in business, and my needs are more specialized. Why should I use FreightCenter?",
        answer: `FreightCenter is a 3rd-Party Logistics provider that manages less-than-truckload (LTL) freight shipping, truckload (TL) freight shipping, international shipping, trade show shipments, and specialty shipping. We integrate our proprietary technology solutions with service delivered by your dedicated account managers to provide an unsurpassed level of service at the lowest available price.`
      }
    ],
    shipping: [
      {
        question: "What are estimated transit times?",
        answer: "Transit times depend on location, destination, service options, mode of transportation, weather, and carrier chosen at the booking time. Transit times are provided by carriers and are estimated, not guaranteed."
      },
      {
        question: "What is LTL shipping?",
        answer: "Freight shipping is the easiest way to move large and bulky items quickly and efficiently while keeping shipping costs low. LTL (Less-Than-Truckload) shipping handles freight shipments ranging from 100 lbs to 20,000 lbs."
      }
    ],
    costs: [
      {
        question: "How do I determine my shipping cost?",
        answer: "The quote process is simple and fast at FreightCenter and is available 24/7. You only need the shipment's origin, destination, weight, dimensions, and contact information to determine your shipping cost."
      },
      {
        question: "What is a freight class, and how does it affect my shipping cost?",
        answer: "Freight class is an essential factor in determining the total cost charged by the carrier for shipping your item(s). According to the National Motor Freight Transportation Association, Inc., 18 freight classes, ranging numerically from 50 to 500, classify a commodity based on density, stowability, handling, and liability."
      }
    ],
    billing: [
      {
        question: "Why did I receive a billing adjustment?",
        answer: "A billing adjustment represents a portion of unpaid freight shipping costs as reported by the carrier. Most billing adjustments result from incorrect weight being communicated by the shipper."
      },
      {
        question: "What are my payment options?",
        answer: "FreightCenter accepts all major credit cards for freight shipments booked online or over the phone with a Freight Agent. Arrangements for other payment options, such as domestic, international, or business checks, are accepted case by case."
      }
    ]
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          
          {Object.entries(faqCategories).map(([category, questions], index) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 capitalize">{category} Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {questions.map((faq, i) => (
                  <AccordionItem key={i} value={`${category}-${i}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Have questions we haven't answered here? Call us at 800.716.7608
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FaqPage;