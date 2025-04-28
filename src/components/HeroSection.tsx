import React from 'react';
import './HeroSection.css'; // Import the CSS file

const HeroSection: React.FC = () => {
  return (
    <div className="hero-section">
      <div className="animated-background"></div> {/* Animated background */}

      {/* Left side for the image */}
      <div className="hero-image">
        <img src="hero-img1.gif" alt="Hero Image" />
      </div>

      {/* Right side for the text */}
      <div className="hero-content">
        <h1 style={{padding:"10px"}}>Welcome To Chit-Chat</h1>
        <p style={{padding:"15px"}}>Connect with friends and new people across the world in real-time, securely.</p>
        <div className="hero-buttons">
          <button className="btn-primary">Start Chatting</button>
          <button className="btn-secondary">Explore Features</button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
