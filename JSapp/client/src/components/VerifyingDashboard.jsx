import React, { useState, useEffect } from 'react';
import app from '../../firebase/config';
import { firestore, auth, storage } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { updateMetadata, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { redirect, useNavigate } from 'react-router-dom';
import './verifying.css';

const VerifyingDashboard = () => {
  // const {spawn} = require('child_process');
  const [userID, setUserID] = useState('');
  const [userVerified, setUserVerified] = useState(false);

  const [catAccess, setCatAccess] = useState([]);

  const navigate = useNavigate();
    // This is the empty function you asked me to create.
    useEffect(() => {
      console.log("Verifying Dashboard has been loaded or reloaded.");
      getCategoryAccess();

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
  
    const getCategoryDocuments = async (category) => {
      let verificationList = [];
      const path = 'users/' + userID + '/documents';
      
      console.log(path);
      console.log(category);
    
      try {
        const snapshot = await getDoc(doc(firestore, path, category));
        if (snapshot.exists()) {
          verificationList = Object.values(snapshot.data());
        } else {
          console.log("No document found!");
        }
      } catch (error) {
        console.log("Error fetching documents: ", error);
      }
    
      return verificationList;
    };

  const handleVerify = () => {
    // Handle verification logic here
    alert('Document verified successfully!');
  };

  const getVerificationScore = () => {

  }

  const uploadCurrentFiles = async (files) => {
    // Upload current files to Firebase Storage
    let urlList = []
    const path = auth.currentUser['uid'] + 'application-documents'
    const storageRef = ref(storage, path);
      try {
        // Use Promise.all to handle multiple asynchronous uploads
        await Promise.all(files.map(async (element) => {
          const fileRef = ref(storage, `${path}/${element.name}`); // Add file name for uniqueness
          const snapshot = await uploadBytesResumable(fileRef, element);
          console.log('Upload is ' + snapshot.state);
          const uri = await getDownloadURL(fileRef);
          // console.log(uri);
          urlList.push(uri);
        }));
      } catch (error) {
        console.log(error);
        alert('Upload failed! Please try again.');
      }
    
    console.log(urlList)
    return urlList;
  }
  
  const validateDocuments = async (list1, list2, list3) => {
    try {
        const response = await fetch('http://localhost:5000/validate-documents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ list1, list2, list3 }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Validation Result:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
};
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
  
  
    const handleVerify = async (category) => {
      if (files.length === 0) {
        alert("Please upload files before verifying.");
        return;
      }

      const applicationList = await uploadCurrentFiles(files);
      const cateogryList = [category]
      const verificationList = await getCategoryDocuments(category)

      console.log("application list: "+applicationList.length)
      console.log("categoryList : "+cateogryList)
      console.log("verification List: "+verificationList.length )

      // const result = verifyDocuments(category, files);
      // setVerificationResult(result);
      const result = await validateDocuments(cateogryList, applicationList, verificationList);
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
        <button className="verify-btn" onClick={() => handleVerify(category)}>Verify</button>
  
        {/* Summary and Score */}
        {verificationResult && (
          <div className="verification-result">
            <p><strong>Summary:</strong> {verificationResult[1]}</p>
            <p><strong>Score:</strong> {verificationResult[0]}</p>
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
