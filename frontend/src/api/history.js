import { getAuth } from "firebase/auth";
import { firebaseAuth } from "./firebase";
import {
  getFirestore,
  where,
  collection,
  getDocs,
  query,
  addDoc,
} from "firebase/firestore";

/***** SETTERS *****/
export const addPrompt = (prompt) => {
  const uid = firebaseAuth.currentUser?.uid;

  return uid;
};
export const updatePromptSongs = (prompt_id, songs) => {};
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
