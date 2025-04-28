import React from 'react';
import HeroSection from '../components/HeroSection';
import CardSection from '../components/CardSection';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <CardSection/>
      <AboutSection/>
      <ContactSection/>
      <Footer/>
    </div>
  );
};

export default Home;
