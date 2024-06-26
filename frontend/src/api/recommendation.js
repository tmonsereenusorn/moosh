import axios from "axios";
import Cookies from "js-cookie";
import { authenticate } from "./auth";

export const getRecommendationsFromExistingTracks = async (seedTracks, settings, blacklistedSongs, auth = true) => {
  const config = {
    headers: { 
      "Content-Type": "application/json"
    }
  };

  if (auth) {
    await authenticate();
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('Authentication failed: No token found.');
      return;
    }
  }

  try {
    const limitedSeedTracks = seedTracks.slice(0, 5);

    const requestBody = {
      seedTracks: limitedSeedTracks,
      settings: settings,
      blacklistedSongs: blacklistedSongs
    }

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/recommendations`, requestBody, config);
    const recommendations = res.data.recommendations;
    
    const synopsis = res.data.synopsis;

    const recs = recommendations.map(track => {
      return {
        ...track,
        duration: `${parseInt(track.duration / (1000 * 60))}m ${parseInt((track.duration % (1000 * 60)) / 1000)}s`
      }
    });

    return {synopsis, recs};
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    return [];
  }
}

/* Get recommendations from the Moosh API which uses GPT and Spotify's recommendation
   API to generate the response.
*/
export const getRecommendationsFromPrompt = async (prompt, settings, currConversation, auth = true) => {
  const config = {
    headers: { 
      "Content-Type": "application/json"
    }
  };

  if (auth) {
    await authenticate();
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error('Authentication failed: No token found.');
      return;
    }
  }

  const requestBody = {
    prompt: prompt,
    currConversation: currConversation,
    settings: settings
  };

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/prompt`, requestBody, config);
    const conversation = res.data.conversation;
    const recommendations = res.data.recommendations;
    
    const synopsis = recommendations.synopsis;
    const recs = recommendations.tracks.map(track => {
      return {
        ...track,
        duration: `${parseInt(track.duration / (1000 * 60))}m ${parseInt((track.duration % (1000 * 60)) / 1000)}s`
      }
    });

    return { synopsis, recs, conversation };
  } catch (err) {
    console.error(err);
    return [];
  }
};