import axios from "axios";
import Cookies from "js-cookie";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

export const getRecommendationsFromExistingTracks = async (seedTracks, numRecs, blacklistedSongs) => {
  await authenticate();
  try {
    const token = Cookies.get('token');

    const limitedSeedTracks = seedTracks.slice(0, 5);

    const config = {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      params: {
        seed_artists: "",
        seed_genres: "",
        seed_tracks: limitedSeedTracks.join(','),
        limit: blacklistedSongs.length + numRecs
      }
    };

    const res = await axios.get(`${SPOTIFY_V1_URL}/recommendations`, config);
    let recommendations = res.data.tracks;

    // Filter out blacklisted songs
    recommendations = recommendations.filter(track => !blacklistedSongs.includes(track.id));
    recommendations = recommendations.slice(0, numRecs); // Return just numRecs

    // Transform recommendations to match the expected format
    const formattedRecs = recommendations.map(track => ({
      id: track.id,
      uri: track.uri,
      artist: track.artists[0].name, // Assuming there's at least one artist
      title: track.name,
      url: track.external_urls.spotify,
      preview: track.preview_url,
      duration: `${Math.floor(track.duration_ms / (1000 * 60))}m ${Math.floor((track.duration_ms % (1000 * 60)) / 1000)}s`
    }));

    return formattedRecs;
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    throw err; // Rethrow or handle error appropriately
  }
}

/* Get recommendations from the Moosh API which uses GPT and Spotify's recommendation
   API to generate the response.
*/
export const getRecommendationsFromPrompt = async (prompt, numRecs, blacklistedSongs = []) => {
  await authenticate();

  const token = Cookies.get('token');
  const config = {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

  const requestBody = {
    prompt: prompt,
    num_recs: numRecs,
    blacklisted_songs: blacklistedSongs
  };

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/prompt`, requestBody, config);
    const data = res.data;

    const recs = data.map(track => {
      return {
        ...track,
        duration: `${parseInt(track.duration / (1000 * 60))}m ${parseInt((track.duration % (1000 * 60)) / 1000)}s`
      }
    });

    return recs;
  } catch (err) {
    console.error(err);
  }
};