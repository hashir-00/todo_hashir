// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { collection, doc, documentId, getFirestore } from "firebase/firestore";
import { FIREBASE } from "../constants/firebase";
import { DATABASES } from "../constants/databases";

// Your web app's Firebase configuration
initializeApp({
  apiKey:FIREBASE.API_KEY ,
  authDomain: FIREBASE.AUTH_DOMAIN,
  projectId: FIREBASE.PROJECT_ID,
  storageBucket:FIREBASE.STORAGE_BUCKET ,
  messagingSenderId:FIREBASE.MESSAGING_SENDER_ID ,
  appId: FIREBASE.APP_ID,
});
// Initialize Firebase
const firestore = getFirestore();
const todosCollection = collection(firestore, DATABASES.TODO);

// create a pointer to our Document

export { firestore, todosCollection, };
