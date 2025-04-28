import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'

const firebaseConfig = {
  apiKey: "AIzaSyAa_8w1leO584ByuE3-hAvVN2Xoidz-8HA",
  authDomain: "hellostores-860e8.firebaseapp.com",
  projectId: "hellostores-860e8",
  storageBucket: "hellostores-860e8.firebasestorage.app",
  messagingSenderId: "158530064456",
  appId: "1:158530064456:web:56dfcf5e59764251d8487d",
  measurementId: "G-X93PZ3YNQJ"
};


// Todo: replace the firebaseConfig with your own
const app = initializeApp(firebaseConfig);

const messaging = getMessaging();
const db = getFirestore(app);


export {db,
  messaging,  
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
  deleteDoc,
  where,
  writeBatch,}