// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_Axl8MFrBPxBll24myrRKCeWZ7V0T_HA",
  authDomain: "documentverification-b99ee.firebaseapp.com",
  projectId: "documentverification-b99ee",
  storageBucket: "documentverification-b99ee.appspot.com",
  messagingSenderId: "509945279130",
  appId: "1:509945279130:web:1b0a87d9cfd9bcd0a2e523",
  measurementId: "G-K8LBYM3EJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);


export default app