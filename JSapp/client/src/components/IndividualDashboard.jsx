import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import bgImage from '../assets/bg4.jpg'; // Ensure this path is correct
import { AiFillEdit, AiFillFile } from 'react-icons/ai';


const IndividualDashboard = () => {
  const [documents, setDocuments] = useState([]); // Store fetched documents
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(''); // Track errors
  const [filteredDocuments, setFilteredDocuments] = useState([]); // Store filtered documents for search
  const [searchValue, setSearchValue] = useState(''); // Search input

  useEffect(() => {
    if (auth.currentUser) {
      getUserDocuments();
    } else {
      setError('User is not authenticated.');
    }
  }, []);

  const getUserDocuments = async () => {
    setLoading(true);
    setError('');
    setDocuments([]); // Reset documents

    try {
      const path = `users/${auth.currentUser.uid}/documents`;
      const querySnapshot = await getDocs(collection(firestore, path));

      const docsData = querySnapshot.docs.map((doc) => {
        return { category: doc.id, ...doc.data() }; // Add category as the document ID
      });

      if (docsData.length === 0) {
        setError('No documents found for this User ID');
      } else {
        setDocuments(docsData); // Store the documents
        setFilteredDocuments(docsData); // Initially, filtered documents are the same as fetched documents
      }

    } catch (error) {
      console.error("Error fetching documents:", error);
      setError('Error fetching documents.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search input and filter documents in real-time
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === '') {
      setFilteredDocuments(documents); // If search is empty, show all documents
    } else {
      // Filter documents based on the search query
      const filtered = documents.filter((doc) => {
        return (
          doc.category.toLowerCase().includes(value.toLowerCase()) || 
          Object.keys(doc).some((key) =>
            key.toLowerCase().includes(value.toLowerCase())
          )
        );
      });

      setFilteredDocuments(filtered);
    }
  };

  return (
    <div style={styles.fullPage}>
      <img src="/logo_pravah.png" alt="Pravah Logo" style={styles.logo} />

      <div style={styles.container}>
        <h2 style={styles.header}>Individual Dashboard</h2>

        {/* Input for Search with Icon */}
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Search for Document"
            value={searchValue}
            onChange={handleSearchInput} // Search while typing
            style={styles.input}
          />
          <i
            className="fas fa-search"
            style={styles.searchIcon}
            onClick={handleSearchInput} // Still keeping the click functionality (optional)
          />
        </div>

        {/* Error Display */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Display Documents */}
        {filteredDocuments.length > 0 && (
          <div style={styles.documentsContainer}>
            <h3 style={styles.documentsTitle}>Documents</h3>
            {filteredDocuments.map((doc, index) => (
              <div key={index} style={styles.documentCard}>
                <h4 style={styles.documentCategory}>{doc.category}</h4>
                <ul style={styles.documentLinks}>
                  
                  {Object.entries(doc)
                    .filter(([key]) => key !== 'category') // Skip the 'category' key
                    .map(([key, value], idx) => (
                      <li key={idx} style={styles.documentLinkItem}>
                        <AiFillFile size={15} color='grey' />
                        <a href={value} target="_blank" rel="noopener noreferrer" style={styles.documentLink}>
                          {' '}{key}
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
    minHeight: '100vh',
    width: '100vw',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '180px',
    height: 'auto',
  },
  container: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '20px',
    maxWidth: '800px',
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
    marginTop: '10px',
  },
  header: {
    fontFamily: 'Arial, sans-serif',
    fontSize: '24px',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    marginTop:'20px',
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  },
  input: {
    padding: '10px',
    width: '100%',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    borderRadius: '20px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  searchIcon: {
    position: 'absolute',
    right: '15px',
    fontSize: '18px',
    color: '#007bff',
    cursor: 'pointer',
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
    fontFamily: 'Arial, sans-serif',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  documentCard: {
    marginBottom: '20px',
    border: '1px solid #ddd',
    padding: '15px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  documentCategory: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '20px'
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
  },
};

export default IndividualDashboard;
