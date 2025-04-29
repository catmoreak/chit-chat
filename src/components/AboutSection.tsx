import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  const fullText = "About Us";

  // Trigger typing when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isTypingStarted) {
          setIsTypingStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [isTypingStarted]);

  // Typing effect
  useEffect(() => {
    if (!isTypingStarted) return;

    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setIsTypingFinished(true);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isTypingStarted]);

  return (
    <section ref={sectionRef} className="about-section">
      <div className="about-content">
        <h2 className={`typing-animation ${isTypingFinished ? 'active-typing' : ''}`}>{text}</h2>
        <p className={`about-paragraph ${isTypingFinished ? 'fade-in-blur delay-1' : ''}`}>
          At Chit-Chat, we believe in the power of real connections. Our platform brings people together from around the world to chat, share, and build meaningful relationships — safely and instantly.
          <br />
          Learn more about our story, our mission, and the team that’s redefining how the world communicates.
        </p>
        <Link to="/about" className={`about-btn ${isTypingFinished ? 'fade-in-blur delay-2' : ''}`}>
          Learn More
        </Link>
      </div>
    </section>
  );
};

export default AboutSection;
