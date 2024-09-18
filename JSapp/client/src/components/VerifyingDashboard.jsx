import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useNavigate, useLocation } from 'react-router-dom';
import './verifying.css';
// import { setUserId } from 'firebase/analytics';

const VerifyingDashboard = () => {
  const [userID, setUserID] = useState('');
  const [userVerified, setUserVerified] = useState(null); // Use null to indicate no initial state
  const [catAccess, setCatAccess] = useState([]);
  const [appID, setAppID] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const [appIDData, setAppIdData] = useState();
  const [catWiseInfo, setCatWiseInfo] = useState({});
  const [IsUserValidating, setIsUserValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let accumulateInfo= {}
  useEffect(() => {
    console.log("Verifying Dashboard has been loaded or reloaded.");
    getCategoryAccess();
  }, []);
  useEffect(() => {
    console.log("fetch app id details called")
    fetchAppIdDetails()

  }, [appID]);

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
      const appid = location.state
      setAppID(appid);
    } catch (error) {
      navigate('/');
    }
  }

  const fetchAppIdDetails = async() => {
    const path = `users/${auth.currentUser.uid}/applications/${appID}`;
    try {
      const snapshot = await getDoc(doc(firestore, path));
      const appIdDetails = snapshot.data();
      console.log(appIdDetails)
      setUserID(appIdDetails.userID)
      setAppIdData(appIdDetails);
    } catch (error) {
      console.log(error);
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
    // let urlList = [];
    let obj = {


    }
    const path = auth.currentUser.uid + '/application-documents';
    try {
      await Promise.all(files.map(async (element) => {
        const fileRef = ref(storage, `${path}/${element.name}`);
        const snapshot = await uploadBytesResumable(fileRef, element);
        const uri = await getDownloadURL(fileRef);
        // urlList.push(uri);
        obj[element.name] = uri
      }));
    } catch (error) {
      console.log(error);
      alert('Upload failed! Please try again.');
    }
    return obj;
  };

  const validateDocuments = async (list1, list2, list3) => {
    try {
      const response = await fetch('http://localhost:5000/api/validate-documents', {
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
      setISVerifying(false);
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
    const [PreUploadedFiles, setPreuploadedFiles] = useState();
    const [isVerifying, setISVerifying] = useState(false);
    

    useEffect(() => {
      console.log('category use effect called!')
      if (appIDData && appIDData.categories && appIDData.categories[category]) {
        const categoryData = appIDData.categories[category];
        if (categoryData) {
          const { score, summary, files } = categoryData;
          // console.log(files)
          setVerificationResult([score, summary]);
          setPreuploadedFiles(files ? Object.entries(files).map(([name, link]) => ({ name, link })) : []);
        }
      }
    }, []);
    
    const handleDeletePreuploadedFile = (filename) => {
      const newFiles = PreUploadedFiles.filter((file) => file.name !== filename);
      setPreuploadedFiles(newFiles);
    }
    const handleFileUpload = (event) => {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
      console.log(files)
    };

    const handleDeleteFile = (fileName) => {
      setFiles((prevFiles) => prevFiles.filter(file => file.name !== fileName));
    };

    const handleVerify = async (category) => {
      // if (files.length === 0) {
      //   alert("Please upload files before verifying.");
      //   return;
      // }
      setISVerifying(true);
      let fileMap = {}
      try {
        fileMap = PreUploadedFiles.reduce((acc, file) => {
        acc[file.name] = file.link;
        return acc;
      }, {});

    }catch{
      console.log('error')
    }
      console.log(fileMap)
      const applicationList = await uploadCurrentFiles(files);
      const mergedFiles = Object.assign({}, fileMap, applicationList)
      console.log(mergedFiles)
      const finalApplicationLinks = Object.values(mergedFiles)
      console.log(finalApplicationLinks)
      const categoryList = [category];
      const verificationList = await getCategoryDocuments(category);
      console.log(applicationList)
      console.log(categoryList)
      console.log(verificationList.length)
      if(verificationList.length <= 0){
        alert("No documents found for this category");
        setVerificationResult([0, "No documents were found in this category"])
        setISVerifying(false);
        return;
      }
      if(finalApplicationLinks.length <= 0){
        alert("No files were uploaded");
        setISVerifying(false);
        return;
      }
      const result = await validateDocuments(categoryList, finalApplicationLinks, verificationList);
      // console.log(result)
      setVerificationResult(result);

      accumulateInfo = {
        ...accumulateInfo,
        categories: {
          ...accumulateInfo.categories,
          [category]: {
            files: mergedFiles,
            score: result[0],
            summary: result[1]
          }
        }
      }      
      setISVerifying(false);

    };

    return (
      <div className="category-section">
        <h2 className="category-title">{category}</h2>

    <div className="file-list-container">
      {/* Pre-uploaded Files */}
      <div className="file-section">
        <h3>Pre-uploaded Files:</h3>
        {PreUploadedFiles && PreUploadedFiles.length > 0 ? (
          <ul className="file-list">
            {PreUploadedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <a href={file.link} target="_blank" rel="noopener noreferrer">{file.name}</a>
                <button className="delete-btn" onClick={() => handleDeletePreuploadedFile(file.name)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-files">No pre-uploaded files available.</p>
        )}
      </div>

      {/* Uploaded Files and File Upload */}
      <div className="file-section">
        <h3>Uploaded Files:</h3>
        <input
          className="file-input"
          type="file"
          multiple
          accept=".pdf, .jpg, .jpeg, .png"
          onChange={handleFileUpload}
        />
        {files && files.length > 0 ? (
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                {file.name}
                <button className="delete-btn" onClick={() => handleDeleteFile(file.name)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-files">No files uploaded yet.</p>
        )}
      </div>
    </div>

        
      <button className="verify-btn" onClick={() => handleVerify(category)}>
        {isVerifying? 'verifying...':'verify'}
      </button>

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
    setIsUserValidating(true);
    try {
      const path = 'users/'+userID+'/authorization'
      const colRef = doc(firestore, path, 'credentials');
      const snapshot = await getDoc(colRef);
      console.log(snapshot.data())
      console.log(snapshot.data())
      setUserVerified(snapshot.exists());
    } catch (error) {
      setUserVerified(false);
    }
    setIsUserValidating(false);
  };

  const handleSave = async() => {
    
    // setIsSaving(true)
    
    // let finalObj = Object.assign({}, appIDData, accumulateInfo)
    
    const combinedObject = {
      ...appIDData,
      ...accumulateInfo,
      categories: {
        ...appIDData.categories,
        ...accumulateInfo.categories, // Spread both `categories`, with `object2` taking precedence
      }
    };
    
    // Now go through each category and merge them dynamically
    Object.keys(combinedObject.categories).forEach(key => {
      combinedObject.categories[key] = {
        ...appIDData.categories?.[key], // Use object1's category if it exists
        ...accumulateInfo.categories?.[key], // Overwrite with object2's category if it exists
      };
    });

    combinedObject['userID'] = userID;
    
    console.log(combinedObject);

    // console.log(appIDData)

    const path = `users/${auth.currentUser.uid}/applications/${appID}`;
    try {
      await setDoc(doc(firestore, path),  combinedObject).then((snapshot) => {
        navigate('/VerifyingHome')
      });
    } catch (error){
      console.log(error);
    }
    // setIsSaving(false)
    // await fetchAppIdDetails()
    // console.log(accumulateInfo)
    // alert("saved application")
    
  }

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
          <button onClick={handleUserVerify} disabled={IsUserValidating} className={userVerified === null ? 'verify-user-btn' : userVerified ? 'verify-user-btn-succ' : 'verify-user-btn-fail'}>
          <p>
            {IsUserValidating
              ? 'Validating...'
              : userVerified === null
              ? 'Validate user'
              : userVerified
              ? 'Valid user'
              : 'Invalid user'}
          </p>
          </button>
          {/* {userVerified !== null && (
            <p className={`user-verification-result ${userVerified ? 'verification-success' : 'verification-failure'}`}>
              <span className={`icon ${userVerified ? 'success-icon' : 'failure-icon'}`}></span>
              {userVerified ? 'User exists!' : 'User does not exist!'}
            </p>
          )} */}
      </div>

      {catAccess.map((category, index) => (
        <CategorySection key={index} category={category} />
      ))}

      <button className="save-btn" onClick={() => handleSave()}>
        save and exit
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
  },
};

export default VerifyingDashboard;

