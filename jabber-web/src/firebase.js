import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB-3B54e--xm-PHcltxq8STvE95kCFY3Bw",
  authDomain: "jabber-67e52.firebaseapp.com",
  projectId: "jabber-67e52",
  storageBucket: "jabber-67e52.appspot.com",
  messagingSenderId: "645982836598",
  appId: "1:645982836598:web:f08ba0a2d009f235b10c57"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider()

export {auth, provider}
export default db;
