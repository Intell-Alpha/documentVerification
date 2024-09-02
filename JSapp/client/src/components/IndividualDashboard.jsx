import React, { useState } from 'react';
import { auth, firestore } from '../../firebase/config';
import { collection, setDoc, doc, updateDoc, deleteField, getDocs} from 'firebase/firestore';

const IndividualDashboard = () => {
  const [name, setName] = useState('');
  
  const handleSearch = async () => {
    // Handle search logic here
    alert(`Searching documents for ${name}...`);
    const path = 'users/'+auth.currentUser['uid']+'/documents'
    await updateDoc(doc(firestore, path, 'identity'), {
      doc5: deleteField()
    })

    await getDocs(collection(firestore, path))
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        // const obj = doc.data()
        console.log(JSON.stringify(doc.data(), null, 2));
      })
    })

  };

  return (
    <div style={styles.container}>
      <h2>Individual Dashboard</h2>
      <input
        type="text"
        placeholder="Enter Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>Find Document</button>
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

export default IndividualDashboard;
