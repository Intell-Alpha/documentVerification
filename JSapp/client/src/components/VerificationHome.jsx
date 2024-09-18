import React, { useState, useEffect } from 'react';
import { firestore, auth, storage } from '../../firebase/config';
import { doc, getDocs, collection, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import './verificationHome.css';
import { AiOutlineSearch, AiFillDelete } from 'react-icons/ai'; // Import icons

const VerificationHome = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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
      const path = `users/${auth.currentUser.uid}/authorization`;
      const snapshot = await getDoc(doc(firestore, path, 'credentials'));
      const catAccess = snapshot.data()['categoryAccess'];

      const newApp = {};

      const appCollectionPath = `users/${auth.currentUser.uid}/applications`;
      await addDoc(collection(firestore, appCollectionPath), newApp);
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

      for (const category in appData.categories) {
        const categoryFiles = appData.categories[category].files;
        for (const filename in categoryFiles) {
          const fileRef = ref(storage, categoryFiles[filename]);
          await deleteObject(fileRef);
        }
      }

      await deleteDoc(doc(firestore, appDocPath));
      fetchApplications(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting application:', error);
    }
    setLoading(false);
  };

  const openApplication = (appID) => {
    navigate('/VerifyingApplication', { state: appID });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredApplications = applications.filter(app => {
    return (
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.userID && app.userID.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="verification-home">
      <img src='/logo_pravah.png' alt="Pravah Logo" className="pravah-logo" />
      <div className="header">
        <h1>Applications</h1>
        <button className="new-app-btn" onClick={createNewApplication} disabled={loading}>
          {loading ? 'Creating...' : 'Create New Application'}
        </button>
        <div className="search-bar">
          <AiOutlineSearch size={20} />
          <input
            type="text"
            placeholder="Search by Application ID or User ID"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredApplications.length > 0 ? (
        <ul className="application-list">
          {filteredApplications.map(app => (
            <li key={app.id} className="application-item">
              <div className="application-info">
                <span><strong>Application ID:</strong> {app.id}</span>
                <span className="spacer"></span> {/* Add spacing */}
                <span><strong>User ID:</strong> {app.userID ? app.userID : 'No user associated'}</span>
              </div>
              <div className="application-actions">
                <button className="open-app-btn" onClick={() => openApplication(app.id)}>Open</button>
                <AiFillDelete className="delete-icon" onClick={() => deleteApplication(app.id)} />
              </div>
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
