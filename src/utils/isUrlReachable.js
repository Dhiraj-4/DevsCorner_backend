export const isUrlReachable = async (url) => {
  try {
    const res = await axios.get(url, { method: "GET", timeout: 5000 });
    return res.status >= 200 && res.status < 400;
  } catch {
    return false;
  }
};