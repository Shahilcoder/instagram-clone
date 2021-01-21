import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCegWhabdh8DMTSGvZYlmHQZkV9S4vuzpY",
    authDomain: "instagram-clone-f2528.firebaseapp.com",
    projectId: "instagram-clone-f2528",
    storageBucket: "instagram-clone-f2528.appspot.com",
    messagingSenderId: "705543507211",
    appId: "1:705543507211:web:73a36c1e7bee0bce31660e",
    measurementId: "G-4GSHBKZBDS"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };