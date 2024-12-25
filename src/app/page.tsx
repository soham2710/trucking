// app/page.tsx
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Carousel from './components/Carousel';
import Newsletter from './components/Newsletter';

import Footer from './components/Footer';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen flex flex-col">
        {/* Main content */}
        <div className="flex-grow">
          {/* Hero Section with Lead Form */}
          <section id="home">
            <Hero />
          </section>

          {/* About Us Section */}
          <section id="about">
            <AboutUs />
          </section>

          {/* Services Section */}
          <section id="services">
            <Services />
          </section>

          {/* Carousel/Gallery Section */}
          <section id="gallery">
            <Carousel />
          </section>        
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}