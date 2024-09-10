import React, { useState, useEffect } from 'react';
import app from '../../firebase/config';
import { firestore, auth, storage } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { updateMetadata, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { redirect, useNavigate } from 'react-router-dom';
import './verifying.css';

const VerifyingDashboard = () => {
  const [userID, setUserID] = useState('');
  const [userVerified, setUserVerified] = useState(false);

  const [catAccess, setCatAccess] = useState(['education', 'work', 'identity']);

  const navigate = useNavigate();
    // This is the empty function you asked me to create.
    useEffect(() => {
      console.log("Verifying Dashboard has been loaded or reloaded.");
      // getCategoryAccess();

      // You can add any logic you want to execute here by replacing my
    }, []); // Empty dependency array means this runs only once on mount
    
  
    async function getCategoryAccess(){
      // console.log("fetchDB called");
      try {
  
        console.log(auth.currentUser['uid']);
        const path = 'users/'+auth.currentUser['uid']+'/authorization'
        const snapshot = await getDoc(doc(firestore, path, 'credentials'))
        const catAcc = snapshot.data()['categoryAccess']
        const isValid = snapshot.data()['dashboardAccess']==='Verifying'
        setCatAccess(catAcc)
        if(!isValid){
          alert('You do not have access to this dashboard');
          navigate('/')
        }
      } catch (error) {
        // alert("please login again");
        navigate('/')
      }
    }
  

  const handleVerify = () => {
    // Handle verification logic here
    alert('Document verified successfully!');
  };

  const getVerificationScore = () => {

  }

  const verifyDocuments = (category, files) => {
    // Mock verification process (replace with actual function)
    return {
      summary: `Verified ${files.length} files in ${category}`,
      score: Math.floor(Math.random() * 100) // Random score (replace with real logic)
    };
  };
  
  const CategorySection = ({ category }) => {
    const [files, setFiles] = useState([]);
    const [verificationResult, setVerificationResult] = useState(null);
  
    const handleFileUpload = (event) => {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    };
    const handleDeleteFile = (fileName) => {
      setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    };
  
  
    const handleVerify = () => {
      if (files.length === 0) {
        alert("Please upload files before verifying.");
        return;
      }
      const result = verifyDocuments(category, files);
      setVerificationResult(result);
    };
  
    return (
      <div className="category-section">
        <h2 className="category-title">{category}</h2>
  
        {/* File Upload */}
        <input
          className="file-input"
          type="file"
          multiple
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileUpload}
        />
        
        {/* Uploaded Files */}
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                {file.name}
                <button className="delete-btn" onClick={() => handleDeleteFile(file.name)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
  
        {/* Verify Button */}
        <button className="verify-btn" onClick={handleVerify}>Verify</button>
  
        {/* Summary and Score */}
        {verificationResult && (
          <div className="verification-result">
            <p><strong>Summary:</strong> {verificationResult.summary}</p>
            <p><strong>Score:</strong> {verificationResult.score}</p>
          </div>
        )}
      </div>
    );  
  };
  
  
  const handleUserVerify = async() => {
    console.log('pressed user verify')
    try {
      console.log(userID)
      const colRef = doc(firestore, 'users', userID)
      const snapshot = await getDoc(colRef)
      if(snapshot.exists()){
        setUserVerified(true)
      }
      else{
        setUserVerified(false)
      }

      

    } catch (error) {
      // console.log(error)
      setUserVerified(false)
    }
  }

  return (
    <div className="App">

      <h1 className="dashboard-heading">Verifying Dashboard</h1>
      <div className="user-verification-section">
        <input
          type="text"
          placeholder="Enter UserID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          className="user-id-input"
        />
        <button onClick={handleUserVerify} className="verify-user-btn">
          Verify User
        </button>
        {userVerified !== null && (
          <p className="user-verification-result">
            {userVerified ? 'User exists!' : 'User does not exist!'}
          </p>
        )}

      </div>

      {catAccess.map((category, index) => (
        <CategorySection key={index} category={category} />
      ))}
      
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
