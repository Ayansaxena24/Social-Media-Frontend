// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVKuYYsaztl3go9ZvJ9VY87K6pYA5qu-E",
  authDomain: "social-media-app-62abc.firebaseapp.com",
  projectId: "social-media-app-62abc",
  storageBucket: "social-media-app-62abc.firebasestorage.app",
  messagingSenderId: "835671668389",
  appId: "1:835671668389:web:f4df5e6fe575ed783b3f4c",
  measurementId: "G-4DNC7T1X6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

export { auth};