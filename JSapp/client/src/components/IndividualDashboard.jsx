import React, { useState } from 'react';

const IndividualDashboard = () => {
  const [name, setName] = useState('');

  const handleSearch = () => {
    // Handle search logic here
    alert(`Searching documents for ${name}...`);
  };

  return (
    <div style={styles.container}>
      <h2>Individual Dashboard</h2>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>Find Document</button>
    </div>
  );
};

const styles = {
  container: {
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

export default IndividualDashboard;
