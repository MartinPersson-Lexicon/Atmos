// SMHI helper utilities
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  return res.json();
}

function pickLatestFromValueArray(periodJson) {
  const arr = Array.isArray(periodJson.value) ? periodJson.value : [];
  if (arr.length === 0) return null;
  const latest = arr.reduce((best, cur) => {
    const bd = Number(best.date || 0);
    const cd = Number(cur.date || 0);
    return cd > bd ? cur : best;
  }, arr[0]);

  return {
    raw: latest,
    date: new Date(Number(latest.date)).toISOString(),
    value:
      latest.value === null || latest.value === undefined
        ? null
        : Number(latest.value),
    quality: latest.quality || null,
  };
}

async function fetchLatestParam(
  stationId,
  parameterId,
  periodKey = "latest-hour"
) {
  const url = `https://opendata-download-metobs.smhi.se/api/version/latest/parameter/${parameterId}/station/${stationId}/period/${periodKey}/data.json`;
  const json = await fetchJson(url);
  return pickLatestFromValueArray(json);
}

/**
 * Populate a WeatherModel-shaped object by station id.
 * Fetches temperature (param 1), windDirection (3) and windSpeed (4) by default.
 */
export async function populateWeatherModelFromStationId(stationId, opts = {}) {
  const params = opts.params || {
    temperature: 1,
    windDirection: 3,
    windSpeed: 4,
    rainIntensity: 38,
    relativeHumidity: 6,
  };
  const period = opts.period || "latest-hour";

  const [temp, windDirection, windSpeed, rainIntensity, relativeHumidity] = await Promise.all([
    fetchLatestParam(stationId, params.temperature, period).catch(() => null),
    fetchLatestParam(stationId, params.windDirection, period).catch(() => null),
    fetchLatestParam(stationId, params.windSpeed, period).catch(() => null),
    fetchLatestParam(stationId, params.rainIntensity, period).catch(() => null),
    fetchLatestParam(stationId, params.relativeHumidity, period).catch(() => null),
  ]);

  return {
    dateTime: temp?.date ?? windDirection?.date ?? windSpeed?.date ?? null,
    temperature: temp?.value ?? null,
    windDirection: windDirection?.value ?? null,
    windSpeed: windSpeed?.value ?? null,
    rainIntensity: rainIntensity?.value ?? null,
    relativeHumidity: relativeHumidity?.value ?? null,
    quality: temp?.quality ?? null,
    raw: {
      temp: temp?.raw ?? null,
      windDirection: windDirection?.raw ?? null,
      windSpeed: windSpeed?.raw ?? null,
      rainIntensity: rainIntensity?.raw ?? null,
      relativeHumidity: relativeHumidity?.raw ?? null,
    },
  };
}

export default { fetchLatestParam, populateWeatherModelFromStationId };
