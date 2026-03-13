import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>&copy; {currentYear} QR Code Generator</p>
      <div className={styles.socialLinks}>
        <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>
        <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" title="Twitter">Twitter</a>
        <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;