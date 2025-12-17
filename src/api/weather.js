const SMHI_API_BASE =
  "https://opendata-download-metobs.smhi.se/api/version/latest";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  return res.json();
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getStationsForParameter(parameterKey = "1") {
  const url = `${SMHI_API_BASE}/parameter/${parameterKey}.json`;
  const json = await fetchJson(url);
  // station list is provided as `station` in the parameter resource
  return json.station || [];
}

export async function findNearestStation(lat, lon, parameterKey = "1") {
  const stations = await getStationsForParameter(parameterKey);
  if (!stations || stations.length === 0) return null;

  let best = null;
  let bestDist = Infinity;
  for (const s of stations) {
    const slat = Number(s.latitude);
    const slon = Number(s.longitude);
    if (Number.isFinite(slat) && Number.isFinite(slon)) {
      const d = haversineDistance(lat, lon, slat, slon);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
  }
  return best ? { station: best, distanceKm: bestDist } : null;
}

export async function getStationMeta(parameterKey, stationKey) {
  const url = `${SMHI_API_BASE}/parameter/${parameterKey}/station/${stationKey}.json`;
  return fetchJson(url);
}

export async function getPeriodData(parameterKey, stationKey, periodKey) {
  const url = `${SMHI_API_BASE}/parameter/${parameterKey}/station/${stationKey}/period/${periodKey}.json`;
  const period = await fetchJson(url);

  // The period resource contains `data` array with links to the actual files
  const dataEntry = Array.isArray(period.data) && period.data[0];
  if (
    !dataEntry ||
    !Array.isArray(dataEntry.link) ||
    dataEntry.link.length === 0
  ) {
    throw new Error("No data link available for this period");
  }

  const dataHref = dataEntry.link[0].href;
  const res = await fetch(dataHref);
  if (!res.ok) throw new Error(`Data fetch failed: ${res.status}`);

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json"))
    return { type: "json", payload: await res.json() };
  // most period data is provided as CSV/text
  const text = await res.text();
  return { type: "text", payload: text };
}

/**
 * Convenience: find nearest station and fetch the first available period's data.
 * Returns { station, periodKey, period, data } where `data` is either text (CSV)
 * or a parsed JSON payload depending on what SMHI provides for that period.
 */
export async function getNearestStationData(lat, lon, parameterKey = "1") {
  const nearest = await findNearestStation(lat, lon, parameterKey);
  if (!nearest) return null;
  const stationKey =
    nearest.station.key || nearest.station.id || nearest.station.key;
  const meta = await getStationMeta(parameterKey, stationKey);
  const periods = Array.isArray(meta.period) ? meta.period : [];
  if (periods.length === 0)
    return {
      station: nearest.station,
      distanceKm: nearest.distanceKm,
      period: null,
      data: null,
    };

  // prefer period keys named 'latest' if present, otherwise use the first period
  const latestPeriod =
    periods.find((p) => p.key && p.key.toLowerCase().includes("latest")) ||
    periods[0];
  const periodKey = latestPeriod.key;
  const data = await getPeriodData(parameterKey, stationKey, periodKey);
  return {
    station: nearest.station,
    distanceKm: nearest.distanceKm,
    period: latestPeriod,
    data,
  };
}

export default {
  getStationsForParameter,
  findNearestStation,
  getStationMeta,
  getPeriodData,
  getNearestStationData,
};
