import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations
import './ContactSection.css';

const ContactSection: React.FC = () => {
  return (
    <section className="contact-section">
      {/* Animated Content */}
      <motion.div
        className="contact-content"
        initial={{ opacity: 0, x: -100 }} // Start from left with opacity 0
        whileInView={{ opacity: 1, x: 0 }} // Animate to full opacity and normal position
        transition={{ duration: 2 }}  // Slow down the animation duration
        viewport={{ once: true }} // Trigger animation only once when in view
      >
        <h2 className="contact-heading">
          Get in Touch
        </h2>
        <p className="contact-description">
          We’d love to hear from you. <br /> Reach out to us for any inquiries or support.
        </p>
        <Link to="/contact" className="contact-btn">
          Contact Us
        </Link>
      </motion.div>

      {/* Animated Image */}
      <motion.div
        className="contact-image"
        initial={{ opacity: 0, x: 100 }} // Start from right with opacity 0
        whileInView={{ opacity: 1, x: 0 }} // Animate to full opacity and normal position
        transition={{ duration: 2 }}  // Slow down the animation duration
        viewport={{ once: true }} // Trigger animation only once when in view
      >
        <img src="Contact-Homeimg.gif" alt="Contact Us"  onContextMenu={(e) => e.preventDefault()} 
  draggable="false"/>
      </motion.div>
    </section>
  );
};

export default ContactSection;
