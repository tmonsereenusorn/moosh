import { db, firebaseAuth } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Takes total recorded ofe ach action
const getActionCount = async (actionId = "prompt_submitted") => {
  try {
    console.log(actionId);
    const docSnap = await getDoc(doc(db, "kpis", actionId));
    console.log(docSnap.data().num_instances);
  } catch (e) {
    console.error("Could not get action count " + e);
  }
};

// const getActionOverTime = async (action_id, start = new , end = new Date()) => {

//   try {
//     const kpis
//   }

//   return res;
// };

const kpiFetching = {
  getActionCount,
};

export default kpiFetching;
