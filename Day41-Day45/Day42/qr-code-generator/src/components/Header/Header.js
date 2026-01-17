import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1>QR Code Generator</h1>
      <div className={styles.socialLinks}>
        <a href="https://github.com/your-profile" target="_blank" rel="noopener noreferrer" title="GitHub">GitHub</a>
        <a href="https://twitter.com/your-handle" target="_blank" rel="noopener noreferrer" title="Twitter">Twitter</a>
        <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" title="LinkedIn">LinkedIn</a>
      </div>
    </header>
  );
};

export default Header;