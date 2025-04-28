import React, { useEffect, useRef, useState } from 'react';
import './CardSection.css';
import { FaPaperPlane, FaUsers, FaImage, FaCogs } from 'react-icons/fa';

const CardSection: React.FC = () => {
  const cards = [
    {
      title: "Instant messaging",
      icon: <FaPaperPlane />,
      description: "Experience real-time messaging with instant send and receive features."
    },
    {
      title: "Create group chats",
      icon: <FaUsers />,
      description: "Group Chats for effective Collaborations."
    },
    {
      title: "Seamless File Transfer",
      icon: <FaImage />,
      description: "Send media files easily with our seamless sharing functionality."
    },
    {
      title: "Intuitive interface",
      icon: <FaCogs />,
      description: "A clean, intuitive interface that makes your chatting experience enjoyable."
    }
  ];

  const [showCards, setShowCards] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setShowCards(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="card-section" ref={sectionRef}>
      {cards.map((card, index) => (
        <div
          className={`card ${showCards ? 'visible' : ''} ${index % 2 === 0 ? 'slide-up' : 'slide-down'}`}
          key={index}
        >
          <div className="card-icon">{card.icon}</div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CardSection;
