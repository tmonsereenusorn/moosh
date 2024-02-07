import axios from "axios";

/* Get recommendations from the Moosh API which uses GPT and Spotify's recommendation
   API to generate the response.
*/
export const getRecommendations = async (prompt) => {
  try {
    const headers = {
      "Content-Type": "application/json"
    };

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/prompt`, {"prompt": prompt}, headers);
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