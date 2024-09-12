import React, { useState } from 'react';
import app from '../../firebase/config'
import { auth, firestore } from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, collection, doc, QuerySnapshot, getDocs, getDoc } from 'firebase/firestore';
import { redirect, useNavigate } from 'react-router-dom';
import IssuingDashboard from './IssuingDashboard';
const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 
  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // async function triggered when login button is clicked
  const handleLogin = async () => { 
    
    // signing in with the firebase with the provided credentials
    await signInWithEmailAndPassword(auth, login, password) 
      .then( async (response) => {
        alert("Login success!");

        // if login success, get the respective authority of with the uid and store it to NewData
        console.log("User ID:", response.user.uid);
        let newData = null
        const path = 'users/'+response.user.uid+'/authorization'
        const docSnap = await getDoc(doc(firestore, path, 'credentials')) 
        if(docSnap.exists()){
          newData = docSnap.data()['dashboardAccess']
          console.log(docSnap.data())
        }
        else{
          alert('sorry! you do not have any access')
        }


        // based on the dashboard access redirect the users to their dashboards
        if(newData === 'General'){
          navigate('/IndividualDashboard')
        }
        else if(newData === 'Issuing'){
          navigate('/IssuingDashboard');
        }
        else if(newData === 'Verifying'){
          navigate('/VerifyingDashboard');
        }
        else{
          alert('You are not authorized to access this page');
        }
        
      })

      // throw error if login not successful
      .catch((error) => {
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        alert(`Login failed: ${error.message}`);
      });
  };
  
  // asynch function called when user clicks signup (all permissions set to general dashboard)
  const handleSignUp = async () => {
    
    // creates a new user in the firebase with the given credentials
    await createUserWithEmailAndPassword(auth, login, password)
      .then( async (response) => {
        alert("Created new user");
        console.log(response.user.uid);

        // creates a new database instance on the uid and creates authorization collection
        const path = "users/"+response.user.uid+"/authorization"

        // adding desired credentials (except password) to credentials document (defaulting access type to general)
        await setDoc(doc(firestore, path, 'credentials'), {
          email: login,
          uid: response.user.uid,
          dashboardAccess: "General"
        })

        // creates a new collection called documents
        const docPath = "users/"+response.user.uid+"/documents"
        
        // creates one document for each category given in the list below 
        const categories = ['Identity', 'Education', 'Work', 'Finance', 'miscellaneous']
        for (let index = 0; index < categories.length; index++) {
          const element = categories[index];
          await setDoc(doc(firestore, docPath, element
          ), {})
        }

        // navigates to general dashboard
        navigate('/IndividualDashboard')
      })
      .catch((error) => {
        console.error(error);
        alert("Error in creating new user");
      });
  };

  // function called upon clicking authorization
  const handleAuthorization = () => {
    
    // redirects to a google form which is raised for access request
    open('https://forms.gle/JUv74AKGDVCambzx9');
    
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.submitButton}>Submit</button>
      </form>
      <div style={styles.buttonContainer}>
        <button onClick={handleSignUp} style={styles.sideButton}>Sign Up</button>
        <button onClick={handleAuthorization} style={styles.sideButton}>Authorization</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    maxWidth: '400px',
    margin: '0 auto',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  sideButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '45%',
  },
};

export default Login;