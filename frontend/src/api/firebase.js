import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, getDoc, doc } from "firebase/firestore";

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
    const userObject = {
      email: cred.user.email,
      spotifyUri: null,
      createdAt: new Date().toISOString()
    }

    const userRef = doc(db, "users", cred.user.uid);
    await setDoc(userRef, userObject);

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
    const userRef = doc(db, "users", firebaseAuth.currentUser.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      // If the user document exists, update the spotifyUri field
      await setDoc(userRef, { spotifyUri: uri }, { merge: true });
      return 0;
    } else {
      console.error("User document does not exist.");
      return -1;
    }
  } catch (e) {
    console.error(e);
  }
};

export const fetchUserData = async () => {
  const uid = firebaseAuth.currentUser.uid;

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No user data for uid: ', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};