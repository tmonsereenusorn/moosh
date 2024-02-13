import axios from "axios";
import Cookies from "js-cookie";
import { SPOTIFY_V1_URL } from "../constants";

export const generatePlaylist = async ({ name, userId, songs }) => {
  try {
    console.log("clicked: " + userId + ", " + name);
    const id = await createPlaylist({ name, userId });
    console.log("id: " + id);
  } catch (err) {
    console.error(err);
  }
};

// Add songs
// const populatePlaylist = async ({ playlistId }) => {
//   try {
//     return null;
//   } catch (err) {
//     console.error(err);
//   }
// };

// Create empty playlist
const createPlaylist = async ({ name, userId }) => {
  const token = Cookies.get("token");
  console.log("Create called");

  try {
    const data = {
      name: `${name}`,
      description: "yer",
    };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    };
    const playlistId = await axios.post(
      `${SPOTIFY_V1_URL}/users/${userId}/playlists`,
      data,
      config
    );
    return playlistId;
  } catch (err) {
    console.error(err);
  }
};
