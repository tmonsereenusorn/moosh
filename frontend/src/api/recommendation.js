import axios from "axios";
import Cookies from "js-cookie";

/* Get recommendations from the Moosh API which uses GPT and Spotify's recommendation
   API to generate the response.
*/
export const getRecommendations = async (prompt) => {
  const token = Cookies.get('token');
  const config = {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/prompt`, {"prompt": prompt}, config);
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