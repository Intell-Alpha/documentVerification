import React, { useState } from 'react';

const IssuingDashboard = () => {
  const [documentType, setDocumentType] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    // Handle document upload logic here
    alert('Document uploaded successfully!');
  };

  const handleIndividualSearch = () => {
    // Handle individual database ID search logic here
    alert(`Searching database for ID: ${individualId}`);
  };

  return (
    <div style={styles.container}>
      <h2>Issuing Authority Dashboard</h2>
      <input
        type="text"
        placeholder="Type of Document"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Individual's Database ID"
        value={individualId}
        onChange={(e) => setIndividualId(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleIndividualSearch} style={styles.button}>
        Find Individual
      </button>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={styles.input}
      />
      <button onClick={handleUpload} style={styles.button}>
        Upload Document
      </button>
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
    marginTop: '10px',
  },
};

export default IssuingDashboard;
