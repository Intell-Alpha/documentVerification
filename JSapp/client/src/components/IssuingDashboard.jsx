import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
// import encryptFile from './encryption/Xsaalsa20'; // Import the function


import bgImage from '../assets/bg4.jpg'; // Make sure this path is correct


const IssuingDashboard = () => {
  const [documentType, setDocumentType] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [catAcces, setCatAccess] = useState(['identity', 'work']);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Issuing Dashboard has been loaded or reloaded.");
    getCategoryAccess();
  }, []);

  async function getCategoryAccess() {
    try {
      console.log(auth.currentUser['uid']);
      const path = 'users/' + auth.currentUser['uid'] + '/authorization';
      const snapshot = await getDoc(doc(firestore, path, 'credentials'));
      const catAcc = snapshot.data()['categoryAccess'];
      const isValid = snapshot.data()['dashboardAccess'] === 'Issuing';
      setCatAccess(catAcc);
      if (!isValid) {
        alert('You do not have access to this dashboard');
        navigate('/');
      }
    } catch (error) {
      alert("Please login again");

      navigate('/');
    }
  }

  async function handleUpload() {
    // encryptFile(file)
    if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      const StoragePath = individualId + '/' + documentId;
      const fireStorePath = 'users/' + individualId + '/documents';
      const docRef = doc(firestore, fireStorePath, documentType);
      const storageRef = ref(storage, StoragePath);
      let url = null;

      setLoading(true); // Start loading

      try {
        await uploadBytesResumable(storageRef, file).then(async (snapshot) => {
          console.log('Upload is ' + snapshot.state);
          await getDownloadURL(storageRef).then((uri) => {
            console.log(uri);
            url = uri;
          });

          await setDoc(docRef, { [documentId]: url }, { merge: true });
          console.log('File uploaded successfully');
          // open(url);
          setDocumentId();
          setFile();
          
        });
      } catch (error) {
        console.log(error);
        alert('Upload failed! Please try again');
      } finally {
        setLoading(false); // End loading
      }
    } else {
      alert('Please upload a file in PDF, JPG, or PNG format.');
    }
  }

  return (
    <div style={styles.fullPage}>
      <div style={styles.container}>

        <img src="/logo_pravah.png" alt="Pravah Logo" style={styles.logo} /> {/* Update Logo Image Path */}
        <h2 style={styles.heading}>Issuing Authority Dashboard</h2>
        

        <label style={styles.label} htmlFor="individualId">Database ID of user</label>
        <input
          id="individualId"
          type="text"
          placeholder="User ID"
          value={individualId}
          onChange={(e) => setIndividualId(e.target.value)}
          style={styles.input}
        />
        <label style={styles.label} htmlFor="documentId">Document Title</label>
        <input 
          id="documentId"
          type="text"
          placeholder="Name of Document"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label} htmlFor="documentType">Category</label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          style={styles.input}
        >
          <option value="" disabled>Select Document Type</option>
          {catAcces.map((cat) => (
            <option value={cat} key={cat}>{cat}</option>
          ))}
        </select>

        <input 
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />

        {/* Show loading spinner or message */}
        {loading ? (
          <p style={styles.loadingText}>Uploading... Please wait</p>
        ) : (
          <button onClick={handleUpload} style={styles.button}>
            Upload Document
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  fullPage: {
    height: '100vh', /* Ensures the div takes up the full viewport height */
    width: '100vw', /* Ensures the div takes up the full viewport width */
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover', // Ensures the image covers the entire page
    backgroundPosition: 'center', // Centers the image
    backgroundRepeat: 'no-repeat', // Prevents image repetition
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    textAlign: 'center',
    gap: '10px',

    padding: '50px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Add a background color to make the content more readable
    borderRadius: '20px', // Optional: Add rounded corners to the container
    maxWidth: '600px', // Adjust as needed
  },
  logo: {
    width: '150px', // Adjust width as needed
    marginBottom: '20px', // Space between logo and heading

  },
  input: {
    display: 'block',
    margin: '15px auto', // Increased margin for better spacing
    padding: '15px',
    width: '80%',
    borderRadius: '20px',

    maxWidth: '400px', // Increased max-width for better appearance
    fontFamily: 'Arial, sans-serif', // Use a professional font
  },
  heading: {
    fontSize: '30px',

    padding: '30px', // Space around the heading
    color: '#373232', // Primary color for headings
  },
  label: {
    fontSize: '20px',
    margin: '10px 0', // Space around the label
    color: '#333', // Adjust color if needed

  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '20px',

    marginTop: '20px', // Increased margin for better spacing
    fontFamily: 'Arial, sans-serif', // Use a professional font
  },
  loadingText: {
    fontFamily: 'Arial, sans-serif', // Use a professional font
    fontSize: '16px', // Adjust font size as needed
    color: '#333', // Adjust color if needed
  },
};

export default IssuingDashboard;
