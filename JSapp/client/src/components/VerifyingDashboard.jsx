import React, { useState } from 'react';

const VerifyingDashboard = () => {
  const [document, setDocument] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [verificationDocument, setVerificationDocument] = useState('');
  const [verificationDocumentId, setVerificationDocumentId] = useState('');

  const handleVerify = () => {
    // Handle verification logic here
    alert('Document verified successfully!');
  };

  return (
    <div style={styles.container}>
      <h2>Verifying Authority Dashboard</h2>
      <input
        type="text"
        placeholder="Document to be Verified"
        value={document}
        onChange={(e) => setDocument(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Document ID"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Document Used for Verification"
        value={verificationDocument}
        onChange={(e) => setVerificationDocument(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Verification Document ID"
        value={verificationDocumentId}
        onChange={(e) => setVerificationDocumentId(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleVerify} style={styles.button}>Verify Document</button>
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

export default VerifyingDashboard;
