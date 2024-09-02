import React, { useState,useEffect} from 'react';
import app from '../../firebase/config';
import { firestore, auth } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';


const IssuingDashboard = () => {
  const [documentType, setDocumentType] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [file, setFile] = useState(null);


  // This is the empty function you asked me to create.
  useEffect(() => {
    console.log("Issuing Dashboard has been loaded or reloaded.");
    // You can add any logic you want to execute here by replacing my
  }, []); // Empty dependency array means this runs only once on mount
  
  async function fetchDB(){
    console.log("fetchDB called");
    console.log(auth.currentUser['uid']);
    let newData = null;
    await getDocs(collection(firestore, "/defaultAuth/defaultDoc/authorization"))
      .then((querySnapshot) => {
        newData = querySnapshot.docs[0].data()['type'];
        console.log(newData);
      });
    if(newData === 'issuing'){
      alert('This is an issuing authority');

    }
  }

  async function handleUpload(params) {
    if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      alert('Document uploaded!');
      fetchDB();
    } else {
      alert('Please upload a file in PDF, JPG, or PNG format.');
    }
  }

  return (
    <div style={styles.container}>
      <h2>Issuing Authority Dashboard</h2>

      <label htmlFor="individualId">Database ID</label>

      <label htmlFor="">Database ID</label>
      <input
        type="text"
        placeholder="Individual's Database ID"
        value={individualId}
        onChange={(e) => setIndividualId(e.target.value)}
        style={styles.input}
      />
      <label htmlFor="">Type</label>

      <input
        type="text"
        placeholder="Type of Document"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={styles.input}
      />

      <label htmlFor="documentType">Type</label>
      <select
        id="documentType"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={styles.input}
      >
        <option value="" disabled>Select Document Type</option>
        <option value="identity">Identity</option>
        <option value="education">Education</option>
        <option value="finance">Finance</option>
        <option value="assets">Assets</option>
        <option value="miscellaneous">Miscellaneous</option>
      </select>

      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png"
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
