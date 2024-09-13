// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/logo.png'; // Path to logo image
import './Navbar.css'; // CSS for Navbar styling

const Navbar = () => (
  <nav className="navbar">
    <img src="/assets/logo.png" alt="Logo" className="navbar-logo" />
    <ul className="navbar-links">
      <li><Link to="/about-us">About Us</Link></li>
      <li><Link to="/our-mission">Our Mission</Link></li>
      <li><Link to="/our-vision">Our Vision</Link></li>
      <li><Link to="/contact-us">Contact Us</Link></li>
    </ul>
  </nav>
);

export default Navbar;
