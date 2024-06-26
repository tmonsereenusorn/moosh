import axios from "axios";
import Cookies from "js-cookie";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

// Generate playlist by creating empty playlist then populating with recs.
export const exportPlaylist = async ({ name, userId, songs, description }) => {
  await authenticate();

  const token = Cookies.get("token");
  if (!token) {
    console.error("Unauthorized playlist generation");
  }

  try {
    const uris = [];
    for (var i = 0; i < songs.length; i++) {
      uris.push(songs[i].uri);
    }
    description = `"${description}" by moosh`;
    const { data } = await createPlaylist({
      name,
      userId,
      token: token,
      description: description,
    });

    // Returns snapshot of playlist after update. May be useful later for history.
    await populatePlaylist({
      playlistId: `${data.id}`,
      uris: uris,
      token: token,
    });

    const snapshot = await fetchPlaylist(data.id);
    
    return snapshot.data;
  } catch (err) {
    console.error(err);
  }
};

// Add songs
const populatePlaylist = async ({ playlistId, uris, token }) => {
  try {
    const data = {
      uris: uris,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      `${SPOTIFY_V1_URL}/playlists/${playlistId}/tracks`,
      data,
      config
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

// Create empty playlist
const createPlaylist = async ({ name, userId, token, description }) => {
  try {
    const data = {
      name: `${name}`,
      description: `${description}`,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    // Returns playlist object
    const res = await axios.post(
      `${SPOTIFY_V1_URL}/users/${userId}/playlists`,
      data,
      config
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

const fetchPlaylist = async (playlistId) => {
  await authenticate();

  const token = Cookies.get("token");
  if (!token) {
    console.error("Unauthorized playlist fetching");
  }
  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const res = await axios.get(
      `${SPOTIFY_V1_URL}/playlists/${playlistId}`,
      config
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};
