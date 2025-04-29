import React, { useState } from "react";
import "./Contact.css";
import { FaUser, FaEnvelope } from "react-icons/fa";

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

    // Gather form data
    const formData = {
      name,
      email,
      message,
      access_key: import.meta.env.VITE_API_KEY, // Access API key from Vite env variable
    };

    try {
      // Make API request to Web3Forms
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
          <img 
            src="/Contact-img.gif"
            alt="Paper Plane" 
            className="plane-icon" 
            style={{ width: "400px", height: "500px", maxHeight: "310px", objectFit: "cover" }}
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
            <div className="success-box">
              ✅ Submitted successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
