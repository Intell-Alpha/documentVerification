// src/pages/Homepage.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Homepage.css'; // Homepage specific styles

const Homepage = () => (
  <div className="homepage">
    <Navbar />
    <div className="hero-section">
      <h1>PRAVAH</h1>
      <p>(Platform for Reliable Authentication and Verification of Accredited Holdings)</p>
    </div>
    <Footer />
  </div>
);

export default Homepage;
