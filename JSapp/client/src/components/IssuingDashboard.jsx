import React, { useState,useEffect} from 'react';
import app from '../../firebase/config';
import { firestore, auth, storage } from '../../firebase/config';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { updateMetadata, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { redirect, useNavigate } from 'react-router-dom';

const IssuingDashboard = () => {
  const [documentType, setDocumentType] = useState('');
  const [individualId, setIndividualId] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [catAcces, setCatAccess] = useState(['identity', 'work']);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // This is the empty function you asked me to create.
  useEffect(() => {
    console.log("Issuing Dashboard has been loaded or reloaded.");
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
      const isValid = snapshot.data()['dashboardAccess']==='Issuing'
      setCatAccess(catAcc)
      if(!isValid){
        alert('You do not have access to this dashboard');
        navigate('/')
      }
    } catch (error) {
      alert("please login again");
      navigate('/')
    }



  }

  async function handleUpload(params) {

    if (file && ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      // alert('Document uploaded!');
      const StoragePath = individualId+'/'+documentId
      const fireStorePath = 'users/'+individualId+'/documents'
      const docRef = doc(firestore, fireStorePath, documentType)
      const storageRef = ref(storage, StoragePath)
      let url = null
      try {
        await uploadBytesResumable(storageRef, file).then(async (snapshot) => {
          console.log('Upload is ' + snapshot.state);
          await getDownloadURL(storageRef).then((uri) => {
            console.log(uri);
            url = uri
          })

          await setDoc(docRef, {[documentId]: url}, {merge:true})
          console.log('File uploaded successfully');
          open(url)
        })
        
      } catch (error) {
        console.log(error)
        alert('upload failed! please try again')
        
      }


      
    } else {
      alert('Please upload a file in PDF, JPG, or PNG format.');
    }
  }

  return (
    <div style={styles.container}>
      <h2>Issuing Authority Dashboard</h2>

      {/* <label htmlFor="individualId">Database ID</label> */}

      <label htmlFor="">Database ID of user</label>
      <input
        type="text"
        placeholder="user id"
        value={individualId}
        onChange={(e) => setIndividualId(e.target.value)}
        style={styles.input}
      />
      <label htmlFor="">Document Title</label>

      <input
        type="text"
        placeholder="name of Document"
        value={documentId}
        onChange={(e) => setDocumentId(e.target.value)}
        style={styles.input}
      />

      <label htmlFor="documentType">Category</label>
      <select
        id="documentType"
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        style={styles.input}
      >
        <option value="" disabled>Select Document Type</option>
        {
          catAcces.map(cat => {
            return <option value={cat}>{cat}</option>
          })
        }
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
