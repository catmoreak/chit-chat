import React from 'react';
import { motion } from 'framer-motion'; // Import motion from framer-motion
import './HeroSection.css';
import { Link } from 'react-router-dom';
const HeroSection: React.FC = () => {
  return (
    <div className="hero-wrapper">
      <div className="hero-section">
        {/* Left side for the image */}
        <div className="hero-image">
          <img src="hero-img1.gif" alt="Hero" onContextMenu={(e) => e.preventDefault()} 
  draggable="false"/>
        </div>

        {/* Right side for the text */}
        <div className="hero-section-content">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -50 }} // Start with opacity 0 and above the element
            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
            transition={{ duration: 1.5 }} // Duration of the animation
          >
            Welcome To Chit-Chat
          </motion.h1>

          {/* Animated Description */}
          <motion.p
            initial={{ opacity: 0, y: -30 }} // Start with opacity 0 and slightly above
            animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
            transition={{ duration: 1.5, delay: 0.5 }} // Added delay for description
          >
            Building secure, seamless connections — anytime, anywhere.
          </motion.p>

          {/* Buttons with animation */}
          <div className="hero-buttons">
          <Link to="/chat">
            <motion.button
              className="btn-primary"
              initial={{ opacity: 0, y: 30 }} // Start with opacity 0 and below the element
              animate={{ opacity: 1, y: 0 }} // Animate to full opacity and normal position
              transition={{ duration: 1.5, delay: 1 }} // Delay for button animation
            >
              Start Chatting
            </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
