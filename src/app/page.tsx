'use client';
import React, { useEffect } from 'react';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import FreightCalculator from './components/FreightCalculator';
import { mixpanelTracker } from '@/lib/mixpanel';

export default function Home() {
 useEffect(() => {
   mixpanelTracker.init();

   const observeSections = () => {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
         if (entry.isIntersecting) {
           mixpanelTracker.trackPageView({
             path: `section_${entry.target.id}`,
             referrer: document.referrer
           });
         }
       });
     });

     ['quote', 'about', 'gallery'].forEach(id => {
       const element = document.getElementById(id);
       if (element) observer.observe(element);
     });

     return () => observer.disconnect();
   };

   observeSections();
 }, []);

 return (
   <>
     <Navigation />
     <div className="min-h-screen flex flex-col">
       <div className="flex-grow">
         <section id="home" className="relative" onClick={() => mixpanelTracker.trackButtonClick('view_hero')}>
           <Hero />
         </section>

         <section id="quote" className="bg-gray-50 py-16" onClick={() => mixpanelTracker.trackButtonClick('view_quote')}>
           <div className="container mx-auto px-4">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Your Freight Quote</h2>
               <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                 Get instant, competitive rates for your shipping needs. Whether you&#39;re shipping LTL or need a full truckload, 
                 we&#39;ve got you covered with reliable carriers nationwide.
               </p>
             </div>
             <FreightCalculator />
           </div>
         </section>

         <section id="about" onClick={() => mixpanelTracker.trackButtonClick('view_about')}>
           <AboutUs />
         </section>

         <section id="gallery" onClick={() => mixpanelTracker.trackButtonClick('view_gallery')}>
           <Carousel />
         </section>
       </div>

       <Footer />
     </div>
   </>
 );
}