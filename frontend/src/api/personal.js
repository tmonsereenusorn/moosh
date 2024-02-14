import axios from "axios";
import Cookies from "js-cookie";
import { SPOTIFY_V1_URL } from "../constants";

export const fetch_personal_info = async () => {
  const token = Cookies.get("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const data = await axios.get(`${process.env.REACT_APP_API_URL}/profile`, config);
    return data;
  } catch (err) {
    console.error(err);
  }
};
