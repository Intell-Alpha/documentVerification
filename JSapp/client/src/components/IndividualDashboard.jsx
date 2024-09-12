import React, { useState } from 'react';
import { firestore } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const IndividualDashboard = () => {
  const [userID, setUserID] = useState(''); // Input for User ID
  const [documents, setDocuments] = useState([]); // Store fetched documents
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track errors

  const handleSearch = async () => {
    if (!userID) {
      alert('Please enter a valid User ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setDocuments([]);

    try {
      const path = `users/${userID}/documents`;
      const querySnapshot = await getDocs(collection(firestore, path));
      
      const docsData = querySnapshot.docs.map((doc) => {
        return { category: doc.id, ...doc.data() }; // Add category as the document ID
      });

      if (docsData.length === 0) {
        setError('No documents found for this User ID');
      }

      setDocuments(docsData); // Set the documents to the state
    } catch (error) {
      console.error("Error fetching documents:", error);
      setError('Error fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Individual Dashboard</h2>

      {/* Input for User ID */}
      <input
        type="text"
        placeholder="Enter User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        style={styles.input}
      />

      {/* Find Documents Button */}
      <button onClick={handleSearch} style={styles.button} disabled={loading}>
        {loading ? 'Searching...' : 'Find Documents'}
      </button>

      {/* Error Display */}
      {error && <p style={styles.error}>{error}</p>}

      {/* Display Documents */}
      {documents.length > 0 && (
        <div style={styles.documentsContainer}>
          <h3>Documents</h3>
          {documents.map((doc, index) => (
            <div key={index} style={styles.document}>
              <h4>{doc.category}</h4> {/* Document category (ID) as heading */}
              {/* Render links for document URLs */}
              <ul>
                {Object.entries(doc)
                  .filter(([key, value]) => key !== 'category') // Skip the 'category' key
                  .map(([key, value], idx) => (
                    <li key={idx}>
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        {key}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
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
  error: {
    color: 'red',
    marginTop: '10px',
  },
  documentsContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
  document: {
    marginBottom: '20px',
    border: '1px solid #ddd',
    padding: '10px',
  },
};

export default IndividualDashboard;
