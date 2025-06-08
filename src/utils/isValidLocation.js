import axios from "axios";
import { GOOGLE_API_KEY } from "../config/serverConfig.js";

export const isValidLocation = async (location) => {
  const API_KEY = GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${API_KEY}`;

  try {
    const res = await axios.get(url);
    return res.data.status === "OK" && res.data.results.length > 0;
  } catch (err) {
    console.error("Location check error:", err.message);
    return false;
  }
};