const CityModel = {
  city: "Malmo",
  stationName: "Malmö A",
  stationId: 52350,
  lat: 55.605,
  lon: 13.0038,
};
export default CityModel;


// List of SMHI weather stations in Sweden with temperature parameter (1)
// Source: https://opendata.smhi.se/apidocs/metobs/station-list.html
// Format: Name (station id)
export const SMHI_CITIES = [
  // { name: "Abisko A", id: 25010, lat: null, lon: null },
  { name: "Abisko A", id: 188790, lat: 68.3538, lon: 18.8164 },
  { name: "Falsterbo A", id: 52240, lat: 55.383698, lon: 12.8166 },
  { name: "Gotska Sandön A", id: 89230, lat: 58.393938, lon: 19.193992 },
  { name: "Gävle A", id: 107420, lat: 60.716082, lon: 17.160666 },
  { name: "Göteborg A", id: 71420, lat: 57.715642, lon: 11.992377 },
  { name: "Helsingborg A", id: 62040, lat: 56.030407, lon: 12.762774 },
  { name: "Hörby A", id: 53530, lat: 55.862386, lon: 13.667259 },
  { name: "Kalmar flygplats", id: 66420, lat: 56.6783, lon: 16.2922 },
  { name: "Katterjåkk A", id: 188850, lat: 68.420182, lon: 18.168044 },
  { name: "Kiruna", id: 25080, lat: 67.85654, lon: 20.29367 },
  { name: "Ljungby A", id: 63510, lat: 56.852482, lon: 13.879433 },
  // { name: "Lund", id: 53430, lat: 55.693194, lon: 13.225057 },
  { name: "Malmö A", id: 52350, lat: 55.571456, lon: 13.070773 },
  { name: "Nikkaluokta A", id: 179960, lat: 67.852698, lon: 19.02199 },
  { name: "Ronneby-Bredåkra", id: 65160, lat: 56.267, lon: 15.265 },
  {
    name: "Stockholm-Arlanda Flygplats",
    id: 97400,
    lat: 59.6269,
    lon: 17.9545,
  },
  { name: "Torup A", id: 63590, lat: 56.949431, lon: 13.060081 },
  { name: "Uppsala Aut", id: 97510, lat: 59.847082, lon: 17.63198 },
  { name: "Varberg", id: 72050, lat: 57.108842, lon: 12.297462 },
  { name: "Visby Flygplats", id: 78400, lat: 57.667761, lon: 18.351619 },
  { name: "Växjö A", id: 64510, lat: 56.846284, lon: 14.829566 },
  { name: "Ölands norra udde A", id: 77210, lat: 57.367077, lon: 17.095401 },
  { name: "Ölands södra udde A", id: 66110, lat: 56.19766, lon: 16.400492 },
  { name: "Övertorneå", id: 173810, lat: 66.386036, lon: 23.615537 },
];

// Derived CityModel-shaped entries (lat/lon unknown here)
export const SMHI_CITY_MODELS = SMHI_CITIES.map((c) => ({
  city: String(c.name)
    .replace(/\sA$/, "")
    .replace(/ Flygplats$/, "")
    .trim(),
  stationName: c.name,
  stationId: c.id,
  lat: c.lat ?? null,
  lon: c.lon ?? null,
}));

// Array of station id numbers for simple iteration
export const SMHI_STATION_IDS = SMHI_CITY_MODELS.map((c) => c.stationId);

export function getCityNameByStationId(stationId) {
  const city = SMHI_CITY_MODELS.find((c) => c.stationId === stationId);
  return city ? city.city : null;
}

export function getLonLatByStationId(stationId) {
  const city = SMHI_CITY_MODELS.find((c) => c.stationId === stationId);
  if (city && city.lat != null && city.lon != null) {
    return { lat: city.lat, lon: city.lon };
  }
  return { lat: null, lon: null };
}
