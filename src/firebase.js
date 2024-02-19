import firebase from 'firebase';

const FirebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBpvl4fs8DYv2xa1uwT039V_6Anva6mBh8",
  authDomain: "crud-post-app.firebaseapp.com",
  projectId: "crud-post-app",
  storageBucket: "crud-post-app.appspot.com",
  messagingSenderId: "503422705615",
  appId: "1:503422705615:web:6135e58433ab80fbfafcba",
  measurementId: "G-HH7TJ0F6F3"
});

const db = FirebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };