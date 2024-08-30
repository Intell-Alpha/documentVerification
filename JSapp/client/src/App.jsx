import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import IssuingDashboard from './components/IssuingDashboard';
import VerifyingDashboard from './components/VerifyingDashboard';
import IndividualDashboard from './components/IndividualDashboard';
import Login from './components/Login';

const App = () => {
  return (
    <Router>
      <div style={styles.container}>
        <h1>Automated Document Verification Model</h1>
        <div style={styles.nav}>
          <Link to="/issuing-dashboard" style={styles.link}>Issuing Authority Dashboard</Link>
          <Link to="/verifying-dashboard" style={styles.link}>Verifying Authority Dashboard</Link>
          <Link to="/individual-dashboard" style={styles.link}>Individual Dashboard</Link>
        </div>
        <Routes>
          <Route path="/issuing-dashboard" element={<Login type="issuing" />} />
          <Route path="/verifying-dashboard" element={<Login type="verifying" />} />
          <Route path="/issuing" element={<IssuingDashboard />} />
          <Route path="/verifying" element={<VerifyingDashboard />} />
          <Route path="/individual-dashboard" element={<IndividualDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  link: {
    margin: '0 15px',
    textDecoration: 'none',
    color: '#007bff',
  },
};

export default App;
