import React, { useState } from 'react';
import app from '../../../server/firebase/config';

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = () => {
    const auth = getAuth(app); 
    signInWithEmailAndPassword(auth, login, password)
      .then((response) => {
        alert("Login success!");
        console.log("User ID:", response.user.uid);
        navigate('/dashboard'); 
      })
      .catch((error) => {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        alert(`Login failed: ${error.message}`);
      });
  };
  

  const handleSignUp = () => {
    const auth = getAuth(app); 
    createUserWithEmailAndPassword(auth, login, password)
      .then((response) => {
        alert("Created new user");
        console.log(response.user.uid);
      })
      .catch((error) => {
        console.error(error);
        alert("Error in creating new user");
      });
  };

  const handleAuthorization = () => {
    alert('Redirecting to Authorization...');
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Submit</button>
      </form>
      <div style={styles.buttonContainer}>
        <button onClick={handleSignUp} style={styles.sideButton}>Sign Up</button>
        <button onClick={handleAuthorization} style={styles.sideButton}>Authorization</button>
      </div>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  sideButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '45%',
  },
};

export default Login;
