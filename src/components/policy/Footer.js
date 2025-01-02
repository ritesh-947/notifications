import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.linksContainer}>
          <a href="/about-us" style={styles.link}>
            About Us
          </a>
          <a href="/privacy-policy" style={styles.link}>
            Privacy Policy
          </a>
          <a href="/terms-and-conditions" style={styles.link}>
            Terms & Conditions
          </a>
          <a href="/contact-us" style={styles.link}>
            Contact Us
          </a>
          <a href="/faq" style={styles.link}>
            FAQ
          </a>
        </div>
        <div style={styles.copyright}>
          © {new Date().getFullYear()} Wanloft. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#007BFF', // Blue background color
    color: '#fff',
    padding: '20px 0',
    position: 'relative',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    marginBottom: '3rem', // Added margin-bottom for spacing
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  linksContainer: {
    marginBottom: '10px',
  },
  link: {
    margin: '0 15px',
    color: '#fff', // Adjusted for better contrast on blue background
    textDecoration: 'none',
    fontSize: '14px',
  },
  linkHover: {
    color: '#d9d9d9',
  },
  copyright: {
    fontSize: '12px',
    color: '#e6e6e6',
  },
};

export default Footer;