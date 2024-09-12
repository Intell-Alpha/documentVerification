import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './verifying.css';

const VerifyingDashboard = () => {
  const [userID, setUserID] = useState('');
  const [userVerified, setUserVerified] = useState(false);
  const [catAccess, setCatAccess] = useState(['education', 'work', 'identity']);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Verifying Dashboard loaded.');
  }, []);

  const verifyDocuments = (category, files) => {
    // Mock verification process (replace with actual function)
    return {
      summary: `Verified ${files.length} files in ${category}`,
      score: Math.floor(Math.random() * 100), // Random score (replace with real logic)
    };
  };

  const CategorySection = ({ category }) => {
    const [files, setFiles] = useState([]);
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleFileUpload = (event) => {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    };

    const handleVerify = () => {
      if (files.length === 0) {
        alert('Please upload files before verifying.');
        return;
      }

      setLoading(true); // Start loading
      const result = verifyDocuments(category, files);
      setVerificationResult(result);
      setLoading(false); // Stop loading after verification
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
              </li>
            ))}
          </ul>
        )}
        <button className="verify-btn" onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        {verificationResult && (
          <div className="verification-result">
            <p><strong>Summary:</strong> {verificationResult.summary}</p>
            <p><strong>Score:</strong> {verificationResult.score}</p>
          </div>
        )}
      </div>
    );
  };

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
      </div>

      {catAccess.map((category, index) => (
        <CategorySection key={index} category={category} />
      ))}
    </div>
  );
};

export default VerifyingDashboard;
