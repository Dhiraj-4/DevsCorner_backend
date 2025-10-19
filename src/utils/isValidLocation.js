import axios from "axios";

export const verifyLocation = async (location) => {
  if (!location || typeof location !== "string") return false;

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          format: "json",
          addressdetails: 1,
          q: location.toLowerCase(),
        },
        headers: {
          "User-Agent": "location-verifier/1.0",
        },
      }
    );

    const data = response.data;
    if (!Array.isArray(data) || !data.length) return false;

    const place = data[0].address;

    const hasCity = Boolean(place.city || place.town || place.village);
    const hasState = Boolean(place.state);
    const hasCountry = Boolean(place.country);

    // return true if at least country exists (and optionally city/state)
    if (hasCountry) return true;

    return hasCity && hasState && hasCountry;
  } catch (err) {
    console.error("Error verifying location:", err.message);
    return false;
  }
};

// Example usage
// (async () => {
//   console.log((await verifyLocation("USA"))); // true ✅
//   console.log((await verifyLocation("Pune, Maharashtra, India")), "India"); // true ✅
//   console.log((await verifyLocation("surat, gujarat, germany")), "Earth"); // false ✅
// })();