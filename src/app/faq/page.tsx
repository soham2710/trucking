'use client';
import React from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";

export default function FaqPage() {
  const faqs = [
    {
      question: "What are your shipping options?",
      answer: "We offer LTL (Less-Than-Truckload) and FTL (Full Truckload) shipping services across all states. LTL is ideal for smaller shipments that don't require a full truck, while FTL provides dedicated truck capacity for larger shipments."
    },
    {
      question: "How do I get a shipping quote?",
      answer: "Simply use our online calculator to get instant quotes. You'll need basic information like origin, destination, and shipment details such as weight and dimensions. Our system will provide competitive rates from reliable carriers instantly."
    },
    {
      question: "What information do I need for shipping?",
      answer: "To process your shipment, we'll need: pickup/delivery locations with ZIP codes, package dimensions and weight, any special requirements (liftgate, residential delivery, etc.), and preferred pickup date. Having accurate information ensures the most precise quote."
    },
    {
      question: "How long does shipping take?",
      answer: "Transit times vary based on distance and service type. Standard transit times range from 1-5 business days depending on the route. LTL shipments typically take longer than FTL. We provide estimated delivery dates when you book your shipment."
    },
    {
      question: "Do you offer tracking services?",
      answer: "Yes, we provide real-time tracking for all shipments. Once your shipment is booked, you'll receive tracking information that allows you to monitor your freight's progress throughout its journey."
    },
    {
      question: "What if I need additional services?",
      answer: "We offer various additional services including liftgate service, residential pickup/delivery, inside delivery, notification before delivery, and more. These can be added during the quote process."
    }
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
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
        </div>
      </main>
      <Footer />
    </>
  );
}