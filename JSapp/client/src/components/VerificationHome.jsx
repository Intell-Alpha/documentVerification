import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../../firebase/config';
import { doc, getDocs, collection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './verificationHome.css';

const VerificationHome = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const appCollectionPath = `users/${auth.currentUser.uid}/applications`;
      const appSnapshot = await getDocs(collection(firestore, appCollectionPath));
      let apps = [];
      appSnapshot.forEach(doc => apps.push({ id: doc.id, ...doc.data() }));
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const createNewApplication = async () => {
    setLoading(true);
    try {
      // Get authorized categories
      const path = `users/${auth.currentUser.uid}/authorization`;
      const snapshot = await getDoc(doc(firestore, path, 'credentials'));
      const catAccess = snapshot.data()['categoryAccess'];

      // Create new application
      const newApp = {
        userID: '', // User ID to be input during verification
        categories: catAccess.reduce((acc, cat) => {
          acc[cat] = {
            files: {},  // Initialize as an empty object for filename: filelink format
            score: null,
            summary: null
          };
          return acc;
        }, {})
      };

      const appCollectionPath = `users/${auth.currentUser.uid}/applications`;
      await addDoc(collection(firestore, appCollectionPath), newApp);  // Firebase generates unique ID
      fetchApplications(); // Refresh the list after creation
    } catch (error) {
      console.error('Error creating new application:', error);
    }
    setLoading(false);
  };

  const deleteApplication = async (appID) => {
    setLoading(true);
    try {
      const appDocPath = `users/${auth.currentUser.uid}/applications/${appID}`;
      const appDoc = await getDoc(doc(firestore, appDocPath));
      const appData = appDoc.data();

      // Delete files from storage
      for (const category in appData.categories) {
        const categoryFiles = appData.categories[category].files;
        for (const filename in categoryFiles) {
          const fileRef = ref(storage, categoryFiles[filename]); // The file link
          await deleteObject(fileRef); // Delete file from storage
        }
      }

      // Delete application from Firestore
      await deleteDoc(doc(firestore, appDocPath));
      fetchApplications(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting application:', error);
    }
    setLoading(false);
  };

  const openApplication = (appID) => {
    // const path = '/VerifyingApplication/'+appID;
    navigate('/VerifyingApplication',  { state: appID });
    // alert(appID+ " navigated...")
  };

  return (
    <div className="verification-home">
      <h1>Verification Dashboard</h1>
      <button className="new-app-btn" onClick={createNewApplication} disabled={loading}>
        {loading ? 'Creating...' : 'Create New Application'}
      </button>
      
      {applications.length > 0 ? (
        <ul className="application-list">
          {applications.map(app => (
            <li key={app.id} className="application-item">
              <span>{app.id}</span> {/* Firebase-generated application ID */}
              <button className="open-app-btn" onClick={() => openApplication(app.id)}>Open</button>
              <button className="delete-app-btn" onClick={() => deleteApplication(app.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found.</p>
      )}
    </div>
  );
};

export default VerificationHome;
