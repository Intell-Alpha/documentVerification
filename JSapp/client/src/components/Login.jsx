import React, { useState } from 'react';
import app from '../../firebase/config'
import { auth, firestore } from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State for loading during login
  const [isSigningUp, setIsSigningUp] = useState(false); // State for loading during sign up
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  const handleLogin = async () => { 
    setIsLoggingIn(true); // Start loading for login
    await signInWithEmailAndPassword(auth, login, password) 
      .then(async (response) => {
        alert("Login success!");
        let newData = null;
        const path = 'users/'+response.user.uid+'/authorization';
        const docSnap = await getDoc(doc(firestore, path, 'credentials'));

        if(docSnap.exists()){
          newData = docSnap.data()['dashboardAccess'];
        } else {
          alert('Sorry! You do not have any access');
        }

        if(newData === 'General'){
          navigate('/IndividualDashboard');
        } else if(newData === 'Issuing'){
          navigate('/IssuingDashboard');
        } else if(newData === 'Verifying'){
          navigate('/VerifyingDashboard');
        } else {
          alert('You are not authorized to access this page');
        }
      })
      .catch((error) => {
        alert(`Login failed: ${error.message}`);
      })
      .finally(() => setIsLoggingIn(false)); // Stop loading after login completes
  };

  const handleSignUp = async () => {
    setIsSigningUp(true); // Start loading for sign up
    await createUserWithEmailAndPassword(auth, login, password)
      .then(async (response) => {
        alert("Created new user");
        const path = "users/"+response.user.uid+"/authorization";
        await setDoc(doc(firestore, path, 'credentials'), {
          email: login,
          uid: response.user.uid,
          dashboardAccess: "General"
        });

        const docPath = "users/"+response.user.uid+"/documents";
        const categories = ['Identity', 'Education', 'Work', 'Finance', 'Miscellaneous'];
        for (let index = 0; index < categories.length; index++) {
          await setDoc(doc(firestore, docPath, categories[index]), {});
        }

        navigate('/IndividualDashboard');
      })
      .catch((error) => {
        alert("Error in creating new user");
      })
      .finally(() => setIsSigningUp(false)); // Stop loading after sign up completes
  };

  const handleAuthorization = () => {
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
        <button
          type="submit"
          style={styles.submitButton}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Loading...' : 'Submit'}
        </button>
      </form>
      <div style={styles.buttonContainer}>
        <button
          onClick={handleSignUp}
          style={styles.sideButton}
          disabled={isSigningUp}
        >
          {isSigningUp ? 'Loading...' : 'Sign Up'}
        </button>
        <button onClick={handleAuthorization} style={styles.sideButton}>
          Authorization
        </button>
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
