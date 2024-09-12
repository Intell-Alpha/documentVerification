import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login'; // Your existing Login component
import IssuingDashboard from './components/IssuingDashboard';
import VerifyingDashboard from './components/VerifyingDashboard';
import IndividualDashboard from './components/IndividualDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Set Home as the initial route */}
        <Route path="/" element={<Home />} />

        {/* Route for Login page */}
        <Route path="/login" element={<Login />} />

        {/* Existing dashboard routes */}
        <Route path="/IssuingDashboard" element={<IssuingDashboard />} />
        <Route path="/VerifyingDashboard" element={<VerifyingDashboard />} />
        <Route path="/IndividualDashboard" element={<IndividualDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
