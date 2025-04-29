import React, { useState } from "react";
import "./Contact.css";
import { FaUser, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion"; // Import framer-motion

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const formData = {
      name,
      email,
      message,
      access_key: import.meta.env.VITE_API_KEY,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-card">
        <div className="contact-left">
          {/* Animate the image */}
          <motion.img
            src="/support.png"
            alt="Paper Plane"
            className="plane-icon"
            style={{
              width: "400px",
              height: "500px",
              maxHeight: "310px",
              objectFit: "cover",
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable="false"
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }} // Floating animation
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="contact-right">
          <h2>Contact us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Message..."
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            <button type="submit">Submit →</button>
          </form>

          {submitted && (
            <div className="success-box">✅ Submitted successfully!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;