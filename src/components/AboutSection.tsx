import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const [text, setText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const fullText = "About Us";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setIsFinished(true);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="about-section">
      <div className="about-content">
        <h2 className={`typing-animation ${isFinished ? 'active-typing' : ''}`}>{text}</h2>
        <p>
          At Chit-Chat, we believe in the power of real connections. Our platform brings people together from around the world to chat, share, and build meaningful relationships — safely and instantly.
          <br />
          Learn more about our story, our mission, and the team that’s redefining how the world communicates.
        </p>
        <Link to="/about" className="about-btn">
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;
