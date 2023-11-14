// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getFirestore} from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvpR5MJUpgdMpZU_MQU86-BzzCQhcLrzs",
  authDomain: "nextjs-todo-21614.firebaseapp.com",
  projectId: "nextjs-todo-21614",
  storageBucket: "nextjs-todo-21614.appspot.com",
  messagingSenderId: "233237616799",
  appId: "1:233237616799:web:2a6afd4f441dd633902aaa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};