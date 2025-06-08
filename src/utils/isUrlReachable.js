import axios from "axios";

export const isUrlReachable = async (url) => {
  try {
    const res = await axios.head(url);
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
};