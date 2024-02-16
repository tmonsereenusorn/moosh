import axios from "axios";
import Cookies from "js-cookie";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

// Generate playlist by creating empty playlist then populating with recs.
export const generatePlaylist = async ({
  name,
  userId,
  songs,
  description,
}) => {
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
    description = `Mooshed: "${description}"`;
    const { data } = await createPlaylist({
      name,
      userId,
      token: token,
      description: description,
    });

    // Get url from response object to return to frontend.
    const url = data.external_urls.spotify;

    // Returns snapshot of playlist after update. May be useful later for history.
    const snapshot = await populatePlaylist({
      playlistId: `${data.id}`,
      uris: uris,
      token: token,
    });
    return url;
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
