import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [hoverActive, setHoverActive] = useState(false);

  // Pre-generate extra falling stars (only once)
  const extraStars = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const randomLeft = Math.random() * 100;
      const randomDuration = Math.random() * 1 + 1;
      const randomDelay = Math.random() * 0.5;
      const randomTranslateX = Math.random() * 200 - 100; // from -100vw to +100vw
      return (
        <div
          key={i}
          className="star"
          style={{
            left: `${randomLeft}%`,
            animationDuration: `${randomDuration}s`,
            animationDelay: `${randomDelay}s`,
            willChange: 'transform',
            '--endX': `${randomTranslateX}vw`
          } as React.CSSProperties}
        />
      );
    });
  }, []);

  return (
    <div
      className="notfound-container"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-gradient)',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
        paddingTop: '80px'
      }}
    >
      <div className="falling-stars">
        {Array.from({ length: 100 }).map((_, i) => {
          const randomLeft = Math.random() * 100;
          const randomDuration = Math.random() * 3 + 2;
          const randomDelay = Math.random() * 2;
          const randomTranslateX = Math.random() * 200 - 100; // from -100vw to +100vw
          return (
            <div
              key={i}
              className="star"
              style={{
                left: `${randomLeft}%`,
                animationDuration: `${randomDuration}s`,
                animationDelay: `${randomDelay}s`,
                willChange: 'transform',
                '--endX': `${randomTranslateX}vw`
              } as React.CSSProperties}
            />
          );
        })}
      </div>

      {hoverActive && (
        <div className="extra-falling-stars">
          {extraStars}
        </div>
      )}

      <motion.div 
        className="notfound-image" 
        style={{ marginBottom: '2rem', zIndex: 1 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.img
          src="/404.png"
          alt="Astronaut in Space"
          onContextMenu={(e) => e.preventDefault()}
          draggable="false"
          initial={{ y: 0 }}
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: '90%', maxWidth: '500px', height: 'auto' }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ marginBottom: '1.5rem', fontSize: '1.2rem', zIndex: 1 }}
      >
        Looks like you are lost in space
      </motion.p>
      <motion.button
        onClick={() => navigate(-1)}
        onHoverStart={() => setHoverActive(true)}
        onHoverEnd={() => setHoverActive(false)}
        whileHover={{
          scale: 1.15,
          backgroundColor: 'var(--primary-dark)',
          transition: { duration: 0.3 }
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          zIndex: 1
        }}
      >
        Go Back
      </motion.button>
    </div>
  );
};

export default NotFound;