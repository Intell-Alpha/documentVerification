import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Function to handle login button click
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to the Home Page</h1>
      <p>This is the landing page of the application.</p>
      <button onClick={handleLoginClick} style={styles.loginButton}>
        Log In
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
  },
};

export default Home;
