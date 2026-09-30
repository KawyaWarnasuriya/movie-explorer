import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBfPGZVJSI5IJnEAV8oSOAJrvvL6b3wow4",
    authDomain: "movie-explorer-cfc85.firebaseapp.com",
    projectId: "movie-explorer-cfc85",
    storageBucket: "movie-explorer-cfc85.appspot.com",
    messagingSenderId: "411570529987",
    appId: "1:411570529987:web:bd3c8b0b8f01db3ca9e476"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
