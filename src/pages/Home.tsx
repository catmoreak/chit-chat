import React from 'react';
import HeroSection from '../components/HeroSection';
import CardSection from '../components/CardSection';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <CardSection/>
    </div>
  );
};

export default Home;
