"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform,  useInView } from "framer-motion"
import { MessageSquare, Users, Shield, Zap, Github, Linkedin, Mail, Star, Globe, Award } from 'lucide-react'
import "./about.css"

export default function About() {
  // References for section animations

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)
  const teamRef = useRef(null)
  const ctaRef = useRef(null)
  
  // Check if sections are in view
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 })
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 })
  const teamInView = useInView(teamRef, { once: true, amount: 0.2 })
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.2 })

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3])
  
  // Animated background position
  const bgPos = useTransform(scrollYProgress, [0, 1], ['0% 0%', '100% 100%'])

  // Stats counter animation
  const [stats, setStats] = useState({ users: 0, messages: 0, countries: 0 })

  useEffect(() => {
    if (statsInView) {
      const interval = setInterval(() => {
        setStats((prev) => {
          const newUsers = Math.min(prev.users + 1000, 50000)
          const newMessages = Math.min(prev.messages + 5000, 250000)
          const newCountries = Math.min(prev.countries + 5, 120)

          if (newUsers === 50000 && newMessages === 250000 && newCountries === 120) {
            clearInterval(interval)
          }

          return { users: newUsers, messages: newMessages, countries: newCountries }
        })
      }, 30)

      return () => clearInterval(interval)
    }
  }, [statsInView])

  // Typing animation for hero text
  const [displayText, setDisplayText] = useState("")
  const fullText = "Redefining Real-Time Communication"
  
  useEffect(() => {
    if (heroInView) {
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayText(fullText.substring(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 100)
      
      return () => clearInterval(typingInterval)
    }
  }, [heroInView])

  return (
    <div className="about-page">
      {/* Animated background */}
      <motion.div 
        className="animated-bg"
        style={{ backgroundPosition: bgPos }}
      />
      
      {/* Floating particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section with parallax effect */}
      <motion.section 
        className="hero-section" 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            Chit-Chat
          </motion.h1>
          <h2 className="hero-subtitle">
            <span className="typing-text">{displayText}</span>
            <span className="cursor"></span>
          </h2>
          <motion.p 
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            A powerful, secure, and intuitive messaging platform built for modern conversations. Connect with anyone,
            anywhere, instantly.
          </motion.p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a href="#features" className="btn btn-primary">
              Explore Features
            </a>
            <a href="./chat" className="btn btn-secondary">
              Try Demo
            </a>
          </motion.div>
        </motion.div>

        <div className="hero-image">
          <div className="chat-bubbles">
            <motion.div 
              className="chat-bubble bubble-1"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              Hello there! 👋
            </motion.div>
            <motion.div 
              className="chat-bubble bubble-2"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
            >
              Welcome to Chit-Chat!
            </motion.div>
            <motion.div 
              className="chat-bubble bubble-1"
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              How's it going?
            </motion.div>
            <motion.div 
              className="chat-bubble bubble-2"
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={heroInView ? { opacity: 1, scale: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.9 }}
            >
              Loving this app! ❤️
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section with counter animation */}
      <section className="stats-section" ref={statsRef}>
        <div className="stats-container">
          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              background: "linear-gradient(135deg, rgba(42, 197, 235, 0.1), rgba(9, 16, 202, 0.1))" 
            }}
          >
            <Users className="stat-icon" />
            <h3 className="stat-number">{stats.users.toLocaleString()}</h3>
            <p className="stat-label">Active Users</p>
          </motion.div>

          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              background: "linear-gradient(135deg, rgba(42, 197, 235, 0.1), rgba(9, 16, 202, 0.1))" 
            }}
          >
            <MessageSquare className="stat-icon" />
            <h3 className="stat-number">{stats.messages.toLocaleString()}</h3>
            <p className="stat-label">Messages Sent</p>
          </motion.div>

          <motion.div
            className="stat-item"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
              background: "linear-gradient(135deg, rgba(42, 197, 235, 0.1), rgba(9, 16, 202, 0.1))" 
            }}
          >
            <Globe className="stat-icon" />
            <h3 className="stat-number">{stats.countries}</h3>
            <p className="stat-label">Countries</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section with staggered animations */}
      <section id="features" className="features-section" ref={featuresRef}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Powerful Features</h2>
          <p>Everything you need for seamless communication</p>
        </motion.div>

        <div className="features-grid">
          {[
            {
              icon: <Zap className="feature-icon" />,
              title: "Real-time Messaging",
              description: "Instant message delivery powered by Supabase Realtime. No delays, no waiting.",
              delay: 0.1
            },
            {
              icon: <Shield className="feature-icon" />,
              title: "End-to-End Encryption",
              description: "Your conversations are secure with advanced encryption protocols.",
              delay: 0.2
            },
            {
              icon: <Users className="feature-icon" />,
              title: "Group Conversations",
              description: "Create groups for team collaboration or friend circles with unlimited members.",
              delay: 0.3
            },
            {
              icon: <Star className="feature-icon" />,
              title: "Rich Media Sharing",
              description: "Share photos, videos, documents, and more with drag-and-drop simplicity.",
              delay: 0.4
            },
            {
              icon: <Globe className="feature-icon" />,
              title: "Cross-Platform",
              description: "Available on web, iOS, and Android. Your conversations sync everywhere.",
              delay: 0.5
            },
            {
              icon: <Award className="feature-icon" />,
              title: "Customizable Interface",
              description: "Personalize your chat experience with themes, layouts, and preferences.",
              delay: 0.6
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: feature.delay }}
              whileHover={{ 
                y: -15, 
                boxShadow: "0 20px 40px rgba(42, 197, 235, 0.2)",
                background: "linear-gradient(135deg, rgba(42, 197, 235, 0.1), rgba(9, 16, 202, 0.1))" 
              }}
            >
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <motion.div 
                className="feature-shine"
                animate={{ 
                  x: ["0%", "100%"],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  delay: index * 0.5,
                  repeatDelay: 5
                }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section with 3D card effect */}
      <section className="team-section" ref={teamRef}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          animate={teamInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2>Meet the Creator</h2>
          <p>The mind behind Chit-Chat</p>
        </motion.div>

        <motion.div
          className="creator-profile"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={teamInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ boxShadow: "0 30px 60px rgba(42, 197, 235, 0.3)" }}
        >
          <div className="creator-image">
            <motion.div 
              className="creator-avatar"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(42, 197, 235, 0.5)", 
                  "0 0 40px rgba(42, 197, 235, 0.8)", 
                  "0 0 20px rgba(42, 197, 235, 0.5)"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              SD
            </motion.div>
            <motion.div 
              className="creator-glow"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            />
          </div>

          <div className="creator-info">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              Sujnan D Devadiga
            </motion.h3>
            <motion.p 
              className="creator-title"
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Full Stack Developer & Founder
            </motion.p>
            <motion.p 
              className="creator-bio"
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              A sophomore at NMAM Institute of Technology with a passion for creating innovative solutions that connect
              people. Sujnan specializes in real-time applications and modern web technologies, with Chit-Chat being his
              flagship project.
            </motion.p>

            <motion.div 
              className="creator-skills"
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {["React", "Supabase", "TypeScript", "UI/UX", "Real-time Systems"].map((skill, index) => (
                <motion.span 
                  key={index} 
                  className="skill-tag"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: "rgba(42, 197, 235, 0.4)",
                    color: "#ffffff" 
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>

            <motion.div 
              className="creator-social"
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              {[
                { icon: <Github size={20} />, delay: 0 },
                { icon: <Linkedin size={20} />, delay: 0.1 },
                { icon: <Mail size={20} />, delay: 0.2 }
              ].map((item, index) => (
                <motion.a 
                  key={index} 
                  href="#" 
                  className="social-link"
                  whileHover={{ 
                    y: -8, 
                    backgroundColor: "rgba(42, 197, 235, 1)",
                    rotate: [0, -10, 10, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 1 + item.delay }}
                >
                  {item.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section with reveal animation */}
      <section className="cta-section" ref={ctaRef}>
        <motion.div 
          className="cta-content"
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to transform your conversations?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of users already enjoying Chit-Chat's seamless experience.
          </motion.p>
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.a 
              href="#" 
              className="btn btn-primary"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(42, 197, 235, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.a>
            <motion.a 
              href="#" 
              className="btn btn-outline"
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <motion.div 
            className="footer-logo"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3>Chit-Chat</h3>
            <p>Redefining communication</p>
          </motion.div>

          <div className="footer-links">
            {[
              {
                title: "Product",
                links: [
                  { name: "Features", url: "#" },
                  { name: "Pricing", url: "#" },
                  { name: "FAQ", url: "#" }
                ]
              },
              {
                title: "Company",
                links: [
                  { name: "About", url: "#" },
                  { name: "Blog", url: "#" },
                  { name: "Careers", url: "#" }
                ]
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy", url: "#" },
                  { name: "Terms", url: "#" },
                  { name: "Security", url: "#" }
                ]
              }
            ].map((column, columnIndex) => (
              <motion.div 
                key={columnIndex} 
                className="footer-column"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * columnIndex }}
                viewport={{ once: true }}
              >
                <h4>{column.title}</h4>
                <ul>
                  {column.links.map((link, linkIndex) => (
                    <motion.li 
                      key={linkIndex}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * linkIndex + 0.2 * columnIndex }}
                      viewport={{ once: true }}
                    >
                      <a href={link.url}>{link.name}</a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>© {new Date().getFullYear()} Chit-Chat. All rights reserved.</p>
          <p>Powered by Supabase</p>
        </motion.div>
      </footer>
    </div>
  )
}
