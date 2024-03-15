import { getAuth } from "firebase/auth";
import { db, firebaseAuth } from "./firebase";
import {
  getFirestore,
  where,
  collection,
  getDocs,
  query,
  addDoc,
  getDoc,
  doc,
  writeBatch,
} from "firebase/firestore";

/***** SETTERS *****/

// Takes in a prompt. Adds prompt to a user's prompts subcollection. Returns
// prompt doc id.
export const addPrompt = async (prompt = "") => {
  const uid = firebaseAuth.currentUser?.uid;
  try {
    const promptObj = {
      prompt: prompt,
      timestamp: new Date().toISOString(),
      playlist: null,
    };
    const promptRef = await addDoc(
      collection(db, "users", uid, "prompts"),
      promptObj
    );
    return promptRef.id;
  } catch (error) {
    console.error("Error adding prompt to user: ", error);
  }
};

// Takes in a doc id. Updates the songs subcolleciton of the prompt. Returns
// songs colleciton id.
export const updatePromptSongs = async (prompt_id = "", songs = []) => {
  const uid = firebaseAuth.currentUser?.uid;

  try {
    const batch = writeBatch(db);
    const songsRef = collection(
      db,
      "users",
      uid,
      "prompts",
      prompt_id.toString(),
      "songs"
    );

    // Put all songs in batch operation and commit together.
    for (var i in songs) {
      const newDocRef = doc(songsRef);
      const song = songs[i];
      const songObj = {
        id: song.id,
        artist: song.artist,
        title: song.title,
        duration: song.duration,
        preview: song.preview,
        uri: song.uri,
        url: song.url,
      };

      batch.set(newDocRef, songObj);
    }
    await batch.commit();
    return songsRef.id;
  } catch (error) {
    console.error("Error adding songs to prompt collection: ", error);
  }
};
export const deletePrompt = (prompt_id) => {};
export const addExportedPlaylist = (playlist_id) => {};

/***** GETTERS *****/

// Fetch all playlists in Moosh library from a user's Spotify.
export const updateHistory = () => {};
export const getPromptsForUser = (user_id) => {};
export const getPlaylistsForUser = (user_id) => {};

// Spotify
export const deletePlaylist = (playlist_id) => {};
export const updatePlaylistDescription = (playlist_id) => {};
export const updatePlaylistTitle = (playlist_id) => {};
