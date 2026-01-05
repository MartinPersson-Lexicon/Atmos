// SMHI helper utilities

import { SMHI_STATION_IDS } from "../models/cityModel.js";
import { getCityNameByStationId } from "../models/cityModel.js";
import { getLonLatByStationId } from "../models/cityModel.js";
import SMHI_CODES_EN from "../models/SmhiCodesEn.js";

import { getLatestHourForecastForStation } from "./weatherForecastApi.js";
import { getSmhiSymbolCodeEmoji } from "../models/SmhiSymbolCodesEmoji.js";
import { getSmhiSymbolCodeText } from "../models/SmhiSymbolCodesText.js";

const allStationIds = Array.isArray(SMHI_STATION_IDS) ? SMHI_STATION_IDS : [];

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
  const picked = pickLatestFromValueArray(json);
  // If this is the temperature parameter (1), round to nearest integer
  try {
    if (
      picked &&
      picked.value !== null &&
      picked.value !== undefined &&
      Number(parameterId) === 1
    ) {
      const n = Number(picked.value);
      picked.value = Number.isNaN(n) ? null : Math.round(n);
    }
  } catch {
    // preserve original value on any unexpected error
  }
  return picked;
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
    currentWeather: 13,
    visibility: 12
  };
  const period = opts.period || "latest-hour";

  const [
    temp,
    windDirection,
    windSpeed,
    rainIntensity,
    relativeHumidity,
    currentWeather,
    visibility,
  ] = await Promise.all([
    fetchLatestParam(stationId, params.temperature, period).catch(() => null),
    fetchLatestParam(stationId, params.windDirection, period).catch(() => null),
    fetchLatestParam(stationId, params.windSpeed, period).catch(() => null),
    fetchLatestParam(stationId, params.rainIntensity, period).catch(() => null),
    fetchLatestParam(stationId, params.relativeHumidity, period).catch(
      () => null
    ),
    fetchLatestParam(stationId, params.currentWeather, period).catch(
      () => null
    ),
    fetchLatestParam(stationId, params.visibility, period).catch(() => null),
  ]);

  const model = {
    stationId: stationId,
    cityName: getCityNameByStationId(stationId),
    dateTime: temp?.date ?? windDirection?.date ?? windSpeed?.date ?? null,
    temperature: temp?.value ?? null,
    windDirection: windDirection?.value ?? null,
    windSpeed: windSpeed?.value ?? null,
    rainIntensity: rainIntensity?.value ?? null,
    relativeHumidity: relativeHumidity?.value ?? null,
    weatherCode: currentWeather?.value ?? null,
    visibility: (function () {
      const raw = visibility?.value ?? null;
      if (raw === null || raw === undefined) return null;
      const n = Number(raw);
      if (Number.isNaN(n)) return null;
      // convert meters to kilometers and round to nearest integer
      return Math.round(n / 1000);
    })(),

    weatherText: (function () {
      const code = currentWeather?.value;
      if (code === null || code === undefined) return null;
      return SMHI_CODES_EN[Number(code)] ?? String(code);
    })(),
    symbolCode: null,
    symbolCodeIcon: null,
    symbolCodeText: null,
    quality: temp?.quality ?? null,
    raw: {
      temp: temp?.raw ?? null,
      windDirection: windDirection?.raw ?? null,
      windSpeed: windSpeed?.raw ?? null,
      rainIntensity: rainIntensity?.raw ?? null,
      relativeHumidity: relativeHumidity?.raw ?? null,
      currentWeather: currentWeather?.raw ?? null,
    },
  };

  // Populate symbol code icon by querying the latest-hour forecast (non-blocking)
  try {
    const latestForecast = await getLatestHourForecastForStation(stationId, [
      "symbol_code",
    ]);
    const sseries = Array.isArray(latestForecast.series)
      ? latestForecast.series
      : [];
    if (sseries.length) {
      const last = sseries[sseries.length - 1];
      const code = last?.values?.symbol_code ?? null;
      model.symbolCode = code;
      model.symbolCodeIcon = getSmhiSymbolCodeEmoji(code);
      model.symbolCodeText = getSmhiSymbolCodeText(code);
    }
  } catch {
    // ignore forecast fetch errors — keep symbolCodeIcon null
  }

  // Populate UV index (non-blocking)
  try {
    const latestUvIndex = await getUvIndexForStation(stationId);
    model.uvIndex = latestUvIndex.uvIndex ?? null;
  } catch {
    // ignore UV index fetch errors — keep uvIndex null
  }

  return model;
}

export async function fetchWeaterForAllStrationIds(opts = {}) {
  const results = {};
  await Promise.all(
    allStationIds.map(async (stationId) => {
      try {
        const data = await populateWeatherModelFromStationId(stationId, opts);
        results[stationId] = { data, error: null };
      } catch (error) {
        results[stationId] = {
          data: null,
          error: error.message || String(error),
        };
      }
    })
  );
  return results;
}

// { id: 13, title: "Rådande väder", summary: "momentanvärde, 1 gång/tim resp 8 gånger/dygn", unit: "kod" },

export async function fetchStationsForParameter(parameterId = 4) {
  const url = `https://opendata-download-metobs.smhi.se/api/version/latest/parameter/${parameterId}.json`;
  try {
    const json = await fetchJson(url);
    const stations = Array.isArray(json.station) ? json.station : [];
    console.log("Get JSON done");
    return stations.map((s) => ({
      id: s.id ?? s.stationid ?? null,
      name: s.name ?? s.stationname ?? "",
      lat: s.latitude ?? s.lat ?? null,
      lon: s.longitude ?? s.lon ?? null,
      raw: s,
    }));
  } catch (err) {
    console.log("Get JSON error", err);
    throw err;
  } finally {
    console.log("Get JSON complete");
  }
}

export async function getUvIndexForStation(stationId, parameterId = 116) {
  const cityModel = getLonLatByStationId(stationId);

  const buildUrl = (lon, lat) =>
    `https://opendata-download-metanalys.smhi.se/api/category/strang1g/version/1/geotype/point/lon/${lon}/lat/${lat}/parameter/${parameterId}/data.json`;

  const tryFetch = async (lon, lat) => {
    try {
      const json = await fetchJson(buildUrl(lon, lat));
      // API may return either { timeSeries: [...] } or a top-level array of samples
      if (Array.isArray(json) && json.length) {
        const first = json[0];
        return first && first.value !== null && first.value !== undefined
          ? Number(first.value)
          : null;
      }
      const first =
        json && Array.isArray(json.timeSeries) ? json.timeSeries[0] : null;
      if (!first) return null;
      if (Array.isArray(first.value) && first.value.length) {
        const v = first.value[0];
        return v && v.value !== null && v.value !== undefined
          ? Number(v.value)
          : null;
      }
      return first.value !== null && first.value !== undefined
        ? Number(first.value)
        : null;
    } catch (err) {
      console.log("UV fetch error for", lon, lat, err?.message ?? err);
      return null;
    }
  };

  let firstUvIndex = null;

  const stationLon = cityModel.lon;
  const stationLat = cityModel.lat;
  if (stationLon != null && stationLat != null) {
    firstUvIndex = await tryFetch(stationLon, stationLat);
  }

  if (firstUvIndex == null) {
    const fallbackLon = 16.158;
    const fallbackLat = 58.5812;
    firstUvIndex = await tryFetch(fallbackLon, fallbackLat);
  }

  return {
    stationId,
    uvIndex: Number.isNaN(firstUvIndex) ? null : firstUvIndex,
  };
}

export default {
  fetchLatestParam,
  populateWeatherModelFromStationId,
  fetchWeaterForAllStrationIds,
  fetchStationsForParameter,
  getUvIndexForStation,
};
