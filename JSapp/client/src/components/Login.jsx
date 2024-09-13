import React, { useState } from 'react';
import { auth, firestore } from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg4.jpg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false); // State for loading during login
  const [isSigningUp, setIsSigningUp] = useState(false); // State for loading during sign up
  const [aadharNumber, setAadharNumber] = useState(''); // State for Aadhar number input
  const [showAadharInput, setShowAadharInput] = useState(false); // State to show Aadhar input
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

    if (showAadharInput) {
      // Handle sign-up with Aadhar number
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
    } else {
      // Show Aadhar number input
      setShowAadharInput(true);
    }

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
    <div style={styles.fullPage}>
      <div style={styles.container}>

        <img src="/logo_pravah.png" alt="Pravah Logo" style={styles.logo} />
        <h2 style={styles.header}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {showAadharInput && (
            <input
              type="number"
              placeholder="Aadhar Number"
              value={aadharNumber}
              onChange={(e) => setAadharNumber(e.target.value)}
              style={styles.input}
            />
          )}

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

            {isSigningUp ? 'Loading...' : (showAadharInput ? 'Confirm Sign Up' : 'Sign Up')}

          </button>
          <button onClick={handleAuthorization} style={styles.sideButton}>
            Authorization
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  fullPage: {

    height: '100vh',
    width: '100vw',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    textAlign: 'center',

    padding: '80px 100px', // Increased padding for larger container
    maxWidth: '500px', // Increased maxWidth for container
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly more opaque for readability
    borderRadius: '25px', // Slightly larger border radius
  },
  logo: {
    width: '200px', // Increased logo size
    marginBottom: '20px',
  },
  header: {
    margin: '0',
    fontSize: '2.5rem', // Increased header font size
    marginBottom: '20px',

  },
  form: {
    display: 'flex',
    flexDirection: 'column',

  },
  input: {

    margin: '15px 0',
    padding: '12px',

    width: '100%',
    boxSizing: 'border-box',
    borderRadius: '15px',
  },
  submitButton: {
    padding: '12px 24px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
    borderRadius: '15px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
  },
  sideButton: {
    padding: '12px 24px',

    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '48%',

    
    borderRadius: '12px',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hover styles
  submitButtonHover: {
    backgroundColor: '#0056b3',
  },
  sideButtonHover: {
    backgroundColor: '#5a6268',
  },
};

// Apply hover effects using CSS
const stylesHover = {
  submitButton: {
    ...styles.submitButton,
    ':hover': {
      backgroundColor: '#0056b3',
    },
  },
  sideButton: {
    ...styles.sideButton,
    ':hover': {
      backgroundColor: '#5a6268',
    },
  },
};

export default Login;

