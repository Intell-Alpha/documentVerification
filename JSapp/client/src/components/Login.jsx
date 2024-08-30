import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ type }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if ((type === 'issuing' && id === 'issuingId' && password === 'issuingPass') ||
        (type === 'verifying' && id === 'verifyingId' && password === 'verifyingPass')) {
      navigate(`/${type}`);
    } else {
      alert('Invalid ID or Password');
    }
  };

  return (
    <div style={styles.loginContainer}>
      <h2>{type.charAt(0).toUpperCase() + type.slice(1)} Authority Login</h2>
      <input
        type="text"
        placeholder="Enter ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>Login</button>
    </div>
  );
};

const styles = {
  loginContainer: {
    textAlign: 'center',
    padding: '20px',
  },
  input: {
    display: 'block',
    margin: '10px auto',
    padding: '10px',
    width: '80%',
    maxWidth: '300px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;


