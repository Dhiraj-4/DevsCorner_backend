import { createRequire } from "module";
const require = createRequire(import.meta.url);

const countriesSetRaw = require("../../processed/countriesSet.json");
const statesMap = require("../../processed/statesMap.json");
const citiesMap = require("../../processed/citiesMap.json");

const countriesSet = new Set(countriesSetRaw);

export function parseLocation(input) {
  const original = input.trim();
  const tokens = original.toLowerCase().split(/[\s,]+/).filter(Boolean);

  let detectedCountry = null;
  let detectedState = null;
  let detectedCity = null;
  let cityMatchData = null;

  // Country match
  for (const t of tokens) {
    if (countriesSet.has(t)) {
      detectedCountry = t;
      break;
    }
  }

  // State match
  for (const t of tokens) {
    if (statesMap[t]) {
      detectedState = t;
      break;
    }
  }

  // City match
  for (const t of tokens) {
    if (citiesMap[t]) {
      detectedCity = t;
      cityMatchData = citiesMap[t];
      break;
    }
  }

  // Nothing recognized → reject
  if (!detectedCountry && !detectedState && !detectedCity) return null;

  // CITY ONLY → infer
  if (detectedCity && !detectedState && !detectedCountry) {
    const first = cityMatchData[0];
    return {
      city: detectedCity,
      stateCode: first.stateCode,
      countryCode: first.countryCode,
      coordinates: { lat: first.lat, lon: first.lon }
    };
  }

  // STATE ONLY → infer
  if (detectedState && !detectedCountry) {
    detectedCountry = statesMap[detectedState].countryCode.toLowerCase();
  }

  // CITY + maybe state/country → resolve best match
  if (detectedCity) {
    let match = cityMatchData[0];

    if (detectedState) {
      match = cityMatchData.find(c => c.stateCode.toLowerCase() === statesMap[detectedState].stateCode.toLowerCase()) || match;
    }

    if (detectedCountry) {
      match = cityMatchData.find(c => c.countryCode.toLowerCase() === detectedCountry) || match;
    }

    return {
      city: detectedCity,
      stateCode: match.stateCode,
      countryCode: match.countryCode,
      coordinates: { lat: match.lat, lon: match.lon }
    };
  }

  // STATE ONLY (with inferred country already)
  if (detectedState && detectedCountry) {
    const s = statesMap[detectedState];
    return {
      city: null,
      stateCode: s.stateCode,
      countryCode: s.countryCode,
      coordinates: null
    };
  }

  // COUNTRY ONLY
  if (detectedCountry) {
    return {
      city: null,
      stateCode: null,
      countryCode: detectedCountry,
      coordinates: null
    };
  }

  // If we reach here → invalid
  return null;
}


// console.log(parseLocation("pune, maharashtra, india"));
// console.log(parseLocation("california, usa"));
// console.log(parseLocation("brazil"));
// console.log(parseLocation("berlin, germany"));
// console.log(parseLocation("tokyo"));
// console.log(parseLocation("xyzabc"));
