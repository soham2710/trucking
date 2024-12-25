// app/glossary/page.tsx
'use client';
import React, { useState } from 'react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';
import { Input } from '@/app/components/ui/input';
import { Search } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
}

const GlossaryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const glossaryTerms: GlossaryTerm[] = [
    {
      term: "Accessorials",
      definition: "(Required and optional) enhance the shipping services you receive."
    },
    {
      term: "Air Waybill (AWB)",
      definition: "An air waybill is vital for shipping via air. The air waybill serves as a contract to outline the terms and conditions of the transport agreement between the shipper and the airline to ensure successful cargo handling during transit."
    },
    {
      term: "Bill of Lading (BOL)",
      definition: "A legal document issued by a carrier to a shipper, detailing the type, quantity, and destination of the goods being carried."
    },
    {
      term: "Carrier",
      definition: "A transportation company responsible for moving goods from one place to another."
    },
    {
      term: "Consignee",
      definition: "The person or company that is the final recipient of the shipment."
    },
    {
      term: "Freight Class",
      definition: "A classification system used to determine shipping costs based on factors such as weight, dimensions, density, and value."
    },
    {
      term: "Intermodal",
      definition: "Transportation involving multiple modes, such as rail and truck, without handling the freight itself when changing modes."
    },
    {
      term: "Less-Than-Truckload (LTL)",
      definition: "A shipping service for smaller loads that do not require a full truck."
    },
    {
      term: "Overage, Shortage, and Damage (OS&D)",
      definition: "A freight claim filed when goods are damaged, missing, or extra items are received."
    },
    {
      term: "Pallet",
      definition: "A flat, portable platform used to stack, store, and transport goods."
    },
    {
      term: "Proof of Delivery (POD)",
      definition: "Documentation confirming that a shipment was delivered successfully to the consignee."
    },
    {
      term: "Shipper",
      definition: "The person or company responsible for initiating a shipment."
    },
    {
      term: "Third-Party Logistics (3PL)",
      definition: "A company that provides outsourced logistics services, including warehousing, transportation, and distribution."
    },
    {
      term: "Truckload (TL)",
      definition: "A full truckload service dedicated to a single shipment, typically larger in size."
    },
    {
      term: "Waybill",
      definition: "A document issued by a carrier giving details and instructions about a shipment of goods."
    },
    {
      term: "Yellow Freight",
      definition: "They are now known as YRC. Yellow Freight is a subsidiary of YRC Worldwide and YRC Freight, Inc."
    }
  ];

  const filteredTerms = glossaryTerms.filter(term =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(letter);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const groupedTerms = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(term);
    return acc;
  }, {} as Record<string, GlossaryTerm[]>);

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-8">Freight Glossary</h1>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search glossary terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Alphabet Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => scrollToLetter(letter)}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-200"
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Glossary Content */}
          <div className="space-y-8">
            {alphabet.map(letter => {
              const terms = groupedTerms[letter];
              if (!terms || terms.length === 0) return null;

              return (
                <div key={letter} id={letter} className="scroll-mt-20">
                  <h2 className="text-2xl font-bold mb-4">{letter}</h2>
                  <div className="space-y-4">
                    {terms.map((term, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <h3 className="font-semibold text-lg text-blue-600">{term.term}</h3>
                        <p className="text-gray-600 mt-1">{term.definition}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default GlossaryPage;