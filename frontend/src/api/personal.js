import axios from "axios";
import Cookies from "js-cookie";

export const fetch_personal_info = async () => {
  const token = Cookies.get('token');
  if (token === undefined) return;
  const config = {
    headers: { Authorization: `Bearer ${token}`}
  };
  const data = await axios.get("https://api.spotify.com/v1/me", config);
  return data;
};