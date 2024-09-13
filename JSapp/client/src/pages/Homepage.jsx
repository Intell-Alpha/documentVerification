import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // State for loading

  // Function to handle login button click
  const handleLoginClick = () => {
    setIsLoading(true); // Set loading state to true
    setTimeout(() => {
      // Simulate an async operation like API call, then navigate
      navigate('/login');
    }, 2000); // Simulate a delay of 2 seconds
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the landing page of the application.</p>
      <button 
        onClick={handleLoginClick} 
        style={styles.loginButton} 
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? 'Loading...' : 'Log In'} {/* Show loading or button text */}
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  loginButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
    borderRadius: '5px',
    fontSize: '16px',
  },
};

export default Home;
