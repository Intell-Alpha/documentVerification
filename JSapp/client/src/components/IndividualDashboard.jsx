import React, { useState } from 'react';
import { firestore } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import bgImage from '../assets/bg4.jpg'; // Ensure this path is correct

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
    <div style={styles.fullPage}>

      <img src="/logo_pravah.png" alt="Pravah Logo" style={styles.logo} /> {/* Use relative path for public folder */}

      <div style={styles.container}>
        <h2 style={styles.header}>Individual Dashboard</h2>

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
            <h3 style={styles.documentsTitle}>Documents</h3>
            {documents.map((doc, index) => (
              <div key={index} style={styles.documentCard}>
                <h4 style={styles.documentCategory}>{doc.category}</h4> {/* Document category (ID) as heading */}
                {/* Render links for document URLs */}
                <ul style={styles.documentLinks}>
                  {Object.entries(doc)
                    .filter(([key, value]) => key !== 'category') // Skip the 'category' key
                    .map(([key, value], idx) => (
                      <li key={idx} style={styles.documentLinkItem}>
                        <a href={value} target="_blank" rel="noopener noreferrer" style={styles.documentLink}>
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
    </div>
  );
};

const styles = {
  fullPage: {
    minHeight: '100vh', // Ensures the div takes up at least the full viewport height
    width: '100vw', // Ensures the div takes up the full viewport width
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire page
    backgroundPosition: 'center', // Centers the image
    backgroundRepeat: 'no-repeat', // Prevents image repetition

    position: 'relative', // Ensure the logo is positioned relative to this container
  },
  logo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '180px', // Adjust size as needed
    height: 'auto', // Maintain aspect ratio
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px', // Add padding to avoid content being clipped
    boxSizing: 'border-box', // Includes padding and border in element's total width and height

  },
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent background for readability

    borderRadius: '20px', // Rounded corners
    maxWidth: '800px', // Adjust as needed
    width: '100%', // Responsive width
    boxSizing: 'border-box', // Includes padding and border in element's total width and height
    margin: '0 auto', // Center horizontally
    marginTop: '10px', // Move container down from the top
    borderRadius: '8px', // Rounded corners
    maxWidth: '800px', // Adjust as needed
    width: '100%', // Responsive width
    boxSizing: 'border-box', // Includes padding and border in element's total width and height

  },
  header: {
    margin: '0 0 20px 0', // Add margin to separate header from content
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
  },
  input: {
    display: 'block',
    margin: '15px auto', // Increased margin for better spacing
    padding: '10px',
    width: '100%',
    maxWidth: '400px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',

    borderRadius: '20px',

  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '20px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    borderRadius: '20px',

  },
  error: {
    color: 'red',
    marginTop: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  },
  documentsContainer: {
    marginTop: '20px',
    textAlign: 'left',
    padding: '10px',
  },
  documentsTitle: {
    margin: '0 0 20px 0', // Add margin to separate title from documents
    fontFamily: 'Arial, sans-serif',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  documentCard: {
    marginBottom: '20px',
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  documentCategory: {
    marginBottom: '10px',
    fontSize: '18px',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  },
  documentLinks: {
    listStyleType: 'none',
    padding: '0',
  },
  documentLinkItem: {
    marginBottom: '10px',
  },
  documentLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
  },
};

export default IndividualDashboard;