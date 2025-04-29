// Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-wrapper">
      <div className="footer-content-area">
        <motion.div
          className="footer-logo-area"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Chit-Chat</h2>
          <p>Redefining communication</p>
        </motion.div>

        <div className="footer-link-area">
          {[
            {
              title: 'Product',
              links: [
                { name: 'Features', url: '#' },
                { name: 'Pricing', url: '#' },
                { name: 'FAQ', url: '#' },
              ],
            },
            {
              title: 'Company',
              links: [
                { name: 'About', url: '#' },
                { name: 'Blog', url: '#' },
                { name: 'Careers', url: '#' },
              ],
            },
            {
              title: 'Legal',
              links: [
                { name: 'Privacy', url: '#' },
                { name: 'Terms', url: '#' },
                { name: 'Security', url: '#' },
              ],
            },
          ].map((column, columnIndex) => (
            <motion.div
              key={columnIndex}
              className="footer-column-area"
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
        className="footer-bottom-area"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <p>© {new Date().getFullYear()} Chit-Chat. All rights reserved.</p>
        <p>Powered by Supabase</p>
      </motion.div>
    </footer>
  );
};

export default Footer;
