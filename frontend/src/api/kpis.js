import axios from "axios";
import { db, firebaseAuth } from "./firebase";
import Cookies from "js-cookie";
import {
  collection,
  getDocs,
  query,
  addDoc,
  doc,
  writeBatch,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

/* Utility functions for adding KPI tracking documents to firestore. Each KPI
 * document has the structure:
 * uid: string,
 * type: string,
 * timestamp: time,
 * data: Object
 */

// Increment the count of instance displayed on parent document.
const incrementCount = async (actionId) => {
  const docSnap = await getDoc(doc(db, "kpis", actionId));
  const curr = docSnap.data().num_instances;

  try {
    await updateDoc(doc(db, "kpis", actionId), {
      num_instances: curr + 1,
    });
    return true;
  } catch (error) {
    console.error("Failed to increment instances", error);
  }
};

// PROMPTING KPIS
// Number of keystrokes and length of the submitted prompt. Will need to find
// prompt by searching through uid and promptId.
const logPrompt = async (numKeystrokes, numTracks, promptLength, promptId) => {
  if (process.env.REACT_APP_MODE === "DEV") {
    console.log("Prompt not logged, in dev.");
    return;
  }

  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "prompt_submitted";

  try {
    const promptData = {
      uid: uid,
      timestamp: new Date().toISOString(),
      data: {
        numKeystrokes,
        numTracks: numTracks,
        promptLength: promptLength,
        promptId: promptId,
      },
    };

    const docRef = await setDoc(
      doc(db, "kpis", actionId, "instances", promptId),
      promptData
    );

    incrementCount(actionId);
    return docRef;
  } catch (error) {
    console.error("Error logging prompting data: ", error);
  }
};

// Log when a user clicks the regeneration button. Use promptId from metadata
// to match with promptIds of the prompt_submitted action instances.
const logRegeneration = async (
  numToggles,
  numToggleAlls,
  numPreviewPlays,
  numLinkClicks,
  numNewTracks,
  promptId
) => {
  if (process.env.REACT_APP_MODE === "DEV") {
    console.log("Regeneration not logged, in dev.");
    return;
  }

  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "regenerate_clicked";

  try {
    const regenerationData = {
      uid,
      timestamp: new Date().toISOString(),
      data: {
        numToggles,
        numToggleAlls,
        numPreviewPlays,
        numLinkClicks,
        numNewTracks,
        promptId,
      },
    };

    const docRef = await addDoc(
      collection(db, "kpis", actionId, "instances"),
      regenerationData
    );
    incrementCount(actionId);
    return docRef;
  } catch (error) {
    console.error("Error logging regeneration data: ", error);
  }
};

const logExport = async (numRegenerations, playlistId, promptId) => {
  if (process.env.REACT_APP_MODE === "DEV") {
    console.log("Export not logged, in dev.");
    return;
  }
  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "export_clicked";

  try {
    const exportData = {
      uid,
      timestamp: new Date().toISOString(),
      data: {
        numRegenerations,
        playlistId,
        promptId,
      },
    };

    const docRef = await addDoc(
      collection(db, "kpis", actionId, "instances"),
      exportData
    );

    incrementCount(actionId);
    return docRef.id;
  } catch (error) {
    console.error("Error logging export data: " + error);
  }
};

const logHistoryClick = async () => {
  return;
};

const kpis = {
  logPrompt: logPrompt,
  logRegeneration: logRegeneration,
  logExport: logExport,
  logHistoryClick,
};

export default kpis;
