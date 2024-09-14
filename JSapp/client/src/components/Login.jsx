import React, { useState } from 'react';
import { auth, firestore } from '../../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/bg4.jpg';

const Login = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [showAadharInput, setShowAadharInput] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSigningUp && !showAadharInput) {
      alert('Please press the Confirm Sign Up button.');
      return;
    }
    if (isSigningUp && showAadharInput) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const response = await signInWithEmailAndPassword(auth, login, password);
      alert("Login success!");
      const path = 'users/' + response.user.uid + '/authorization';
      const docSnap = await getDoc(doc(firestore, path, 'credentials'));

      if (docSnap.exists()) {
        const newData = docSnap.data()['dashboardAccess'];
        if (newData === 'General') {
          navigate('/IndividualDashboard');
        } else if (newData === 'Issuing') {
          navigate('/IssuingDashboard');
        } else if (newData === 'Verifying') {
          navigate('/VerifyingDashboard');
        } else {
          alert('You are not authorized to access this page');
        }
      } else {
        alert('Sorry! You do not have any access');
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      const aadharDocRef = doc(firestore, 'aadhar', 'aadharID');
      const aadharDoc = await getDoc(aadharDocRef);
      if (aadharDoc.exists()) {
        const aadharData = aadharDoc.data();
        const aadharEntry = Object.values(aadharData).find(([number]) => number === Number(aadharNumber));
        if (aadharEntry && !aadharEntry[1]) {
          // Aadhar number is valid and not used
          await createUserWithEmailAndPassword(auth, login, password)
            .then(async (response) => {
              alert("Created new user");
              const userPath = "users/" + response.user.uid + "/authorization";
              await setDoc(doc(firestore, userPath, 'credentials'), {
                email: login,
                uid: response.user.uid,
                dashboardAccess: "General"
              });

              const docPath = "users/" + response.user.uid + "/documents";
              const categories = ['Identity', 'Education', 'Work', 'Finance', 'Miscellaneous'];
              for (let index = 0; index < categories.length; index++) {
                await setDoc(doc(firestore, docPath, categories[index]), {});
              }

              // Update Aadhar document to mark the number as used
              await updateDoc(aadharDocRef, {
                [Object.keys(aadharData).find(key => aadharData[key][0] === Number(aadharNumber))]: [Number(aadharNumber), true]
              });

              navigate('/IndividualDashboard');
            })
            .catch((error) => {
              alert("Error in creating new user: " + error.message);
            });
        } else {
          alert("Invalid Aadhar number or already used.");
        }
      } else {
        alert("Aadhar data not found.");
      }
    } catch (error) {
      alert("Error validating Aadhar number: " + error.message);
    } finally {
      setIsSigningUp(false);
    }
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
            disabled={isLoggingIn || isSigningUp}
          >
            {isLoggingIn || isSigningUp ? 'Loading...' : 'Submit'}
          </button>
        </form>
        <div style={styles.buttonContainer}>
          <button
            onClick={() => {
              if (showAadharInput) {
                handleSignUp();
              } else {
                setShowAadharInput(true);
              }
            }}
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
    padding: '80px 100px',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '25px',
  },
  logo: {
    width: '200px',
    marginBottom: '20px',
  },
  header: {
    margin: '0',
    fontSize: '2.5rem',
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
};

export default Login;
