import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import IssuingDashboard from './components/IssuingDashboard';
import IndividualDashboard from './components/IndividualDashboard';
// import other components


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/IssuingDashboard" element={<IssuingDashboard />} />
        <Route path="/IssuingDashboard" element={<IssuingDashboard />} />
        <Route path="/IndividualDashboard" element={<IndividualDashboard />} />

        {/* Define other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
