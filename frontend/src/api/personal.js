import axios from "axios";
import Cookies from "js-cookie";
import { authorize } from "./auth";

export const fetch_personal_info = async () => {
  await authorize();
  
  const token = Cookies.get('token');
  const config = {
    headers: { Authorization: `Bearer ${token}`}
  };

  try {
    const data = await axios.get("https://api.spotify.com/v1/me", config);
    return data;
  } catch (err) {
    console.error(err);
  }
};