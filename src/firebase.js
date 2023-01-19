import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "zummitsocial.firebaseapp.com",
  projectId: "zummitsocial",
  storageBucket: "zummitsocial.appspot.com",
  messagingSenderId: "784113212467",
  appId: "1:784113212467:web:8c78ddefa3828be02d9746"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage  = getStorage();
export const db = getFirestore();


