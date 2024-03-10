import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, where, collection, getDocs, query, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
const db = getFirestore(app);

export const firebaseLogin = async (email, password) => {
  try {
    const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return cred.user;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const firebaseSignup = async (email, password) => {
  try {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    return cred.user;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const firebaseSignout = async () => {
  try {
    await signOut(firebaseAuth);
  } catch (e) {
    console.error(e);
  }
};

export const updateSpotifyURI = async (uri) => {
  try {
    const snapshot = await getDocs(query(collection(db, "users"), where("spotifyUri", "==", uri)));
    const docs = snapshot.docs;
    if (docs.length === 0) {
      await addDoc(collection(db, "users"), {
        spotifyUri: uri,
        uid: firebaseAuth.currentUser.uid
      });
    } else {
      const data = docs[0].data();
      if (data.uid !== firebaseAuth.currentUser.uid) {
        console.error("Spotify user already associated with moosh account.");
        return -1;
      }
    }
  } catch (e) {
    console.error(e);
  }
};