import { db, firebaseAuth } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

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
const logPrompt = async (
  numKeystrokes,
  numTracks,
  promptLength,
  promptId,
  sessionId
) => {
  if (process.env.REACT_APP_MODE !== "PROD") {
    console.log("Prompt not logged, in dev.");
    return;
  }

  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "prompt_submitted";

  try {
    const promptData = {
      uid: uid,
      timestamp: new Date().toISOString(),
      sessionId,
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
  promptId,
  sessionId
) => {
  if (process.env.REACT_APP_MODE !== "PROD") {
    console.log("Prompt not logged, in dev.");
    return;
  }

  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "regenerate_clicked";

  try {
    const regenerationData = {
      uid,
      timestamp: new Date().toISOString(),
      sessionId,
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

const logExport = async (numRegenerations, playlistId, promptId, sessionId) => {
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
      sessionId,
      data: {
        numRegenerations,
        playlistId,
        promptId,
      },
    };

    await setDoc(
      doc(db, "kpis", actionId, "instances", playlistId),
      exportData
    );

    incrementCount(actionId);
    return playlistId;
  } catch (error) {
    console.error("Error logging export data: " + error);
  }
};

const logSession = async () => {
  if (process.env.REACT_APP_MODE !== "PROD") {
    console.log("Prompt not logged, in dev.");
    return;
  }
  const uid = firebaseAuth.currentUser?.uid;
  const actionId = "session_logged";

  try {
    const sessionData = {
      uid,
      timestamp: new Date().toISOString(),
    };

    const docRef = await addDoc(
      collection(db, "kpis", actionId, "instances"),
      sessionData
    );
    incrementCount(actionId);
    return docRef.id;
  } catch (error) {
    console.error("Error logging session: " + error);
  }
  return;
};

const kpis = {
  logPrompt,
  logRegeneration,
  logExport,
  logSession,
};

export default kpis;
