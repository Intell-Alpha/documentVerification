import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './verifying.css';

const VerifyingDashboard = () => {
  const [userID, setUserID] = useState('');
  const [userVerified, setUserVerified] = useState(null); // Use null to indicate no initial state
  const [catAccess, setCatAccess] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Verifying Dashboard has been loaded or reloaded.");
    getCategoryAccess();
  }, []);

  async function getCategoryAccess() {
    try {
      const path = 'users/' + auth.currentUser.uid + '/authorization';
      const snapshot = await getDoc(doc(firestore, path, 'credentials'));
      const catAcc = snapshot.data()['categoryAccess'];
      const isValid = snapshot.data()['dashboardAccess'] === 'Verifying';
      setCatAccess(catAcc);
      if (!isValid) {
        alert('You do not have access to this dashboard');
        navigate('/');
      }
    } catch (error) {
      navigate('/');
    }
  }

  const getCategoryDocuments = async (category) => {
    let verificationList = [];
    const path = 'users/' + userID + '/documents';
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

  const uploadCurrentFiles = async (files) => {
    let urlList = [];
    const path = auth.currentUser.uid + '/application-documents';
    try {
      await Promise.all(files.map(async (element) => {
        const fileRef = ref(storage, `${path}/${element.name}`);
        const snapshot = await uploadBytesResumable(fileRef, element);
        const uri = await getDownloadURL(fileRef);
        urlList.push(uri);
      }));
    } catch (error) {
      console.log(error);
      alert('Upload failed! Please try again.');
    }
    return urlList;
  };

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
      return result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const verifyDocuments = (category, files) => {
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
      const categoryList = [category];
      const verificationList = await getCategoryDocuments(category);
      console.log(applicationList.length)
      console.log(categoryList)
      console.log(verificationList.length)
      if(verificationList.length <= 0){
        alert("No documents found for this category");
        setVerificationResult([0, "No documents were found in this category"])
        return;
      }
      const result = await validateDocuments(categoryList, applicationList, verificationList);
      setVerificationResult(result);
    };

    return (
      <div className="category-section">
        <h2 className="category-title">{category}</h2>

        <input
          className="file-input"
          type="file"
          multiple
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileUpload}
        />

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

        <button className="verify-btn" onClick={() => handleVerify(category)}>Verify</button>

        {verificationResult && (
          <div className="verification-result">
            <p><strong>Summary:</strong> {verificationResult[1]}</p>
            <p><strong>Score:</strong> {verificationResult[0]}</p>
          </div>
        )}
      </div>
    );
  };

  const handleUserVerify = async () => {
    try {
      const path = 'users/'+userID+'/authorization'
      const colRef = doc(firestore, path, 'credentials');
      const snapshot = await getDoc(colRef);
      console.log(snapshot.data())
      setUserVerified(snapshot.exists());
    } catch (error) {
      setUserVerified(false);
    }
  };

  return (
    <div className="dashboard-container">
      <img src="/logo_pravah.png" alt="Pravah Logo" className="logo" /> {/* Add logo */}
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
            <p className={`user-verification-result ${userVerified ? 'verification-success' : 'verification-failure'}`}>
              <span className={`icon ${userVerified ? 'success-icon' : 'failure-icon'}`}></span>
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

