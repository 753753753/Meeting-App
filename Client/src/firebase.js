import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD1mKEFQT4MptssBWRcowMO7-MRZSskWaw",
  authDomain: "meeting-app-9ef9f.firebaseapp.com",
  projectId: "meeting-app-9ef9f",
  storageBucket: "meeting-app-9ef9f.firebasestorage.app",
  messagingSenderId: "152181598397",
  appId: "1:152181598397:web:3a2a01e19fc90cac992fd4",
  measurementId: "G-17CHEMKRJF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
