import axios from "axios";
import Cookies from "js-cookie";
import { authenticate } from "./auth";
import { SPOTIFY_V1_URL } from "../constants";

export const fetch_personal_info = async () => {
  await authenticate();

  const token = Cookies.get("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const data = await axios.get(`${SPOTIFY_V1_URL}/me`, config);
    return data;
  } catch (err) {
    console.error(err);
  }
};
