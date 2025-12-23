const baseUrl =
  "https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1";

const createdTimeUrl = `${baseUrl}/createdtime.json`;

import { SMHI_CITY_MODELS } from "../models/cityModel.js";
import { getSmhiSymbolEmoji } from "../models/SmhiSymbolEmoji.js";

export async function getCreatedTime() {
  const res = await fetch(createdTimeUrl);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  const createdTime = await res.json();
  return createdTime;
}

/**
 * Fetch point forecast for a given latitude/longitude and return full JSON
 */
export async function getPointForecastByCoord(lat, lon) {
  const url = `${baseUrl}/geotype/point/lon/${lon}/lat/${lat}/data.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  return res.json();
}

/**
 * Get forecast for a SMHI station id.
 * Looks up station lat/lon from `SMHI_CITY_MODELS` and returns the time series for the requested parameterKey (default `air_temperature`).
 */
export async function getForecastForStation(
  stationId,
  parameterKey = ["air_temperature", "symbol_code"]
) {
  const model = SMHI_CITY_MODELS.find((m) => m.stationId === stationId);
  if (!model)
    throw new Error(`Station id ${stationId} not found in city models`);
  if (model.lat == null || model.lon == null)
    throw new Error(`No lat/lon available for station ${stationId}`);

  const json = await getPointForecastByCoord(model.lat, model.lon);
  const coords = Array.isArray(json.geometry?.coordinates)
    ? json.geometry.coordinates
    : null;

  const timeSeries = Array.isArray(json.timeSeries) ? json.timeSeries : [];

  const keys = Array.isArray(parameterKey) ? parameterKey : [parameterKey];

  const series = timeSeries.map((ts) => {
    const values = {};
    for (const k of keys) {
      values[k] = ts.data ? ts.data[k] ?? null : null;
    }

    const entry = {
      time: ts.time,
      value: keys.length ? values[keys[0]] : null,
      values,
      raw: ts,
    };

    if (keys.includes("symbol_code")) {
      entry.emoji = getSmhiSymbolEmoji(values["symbol_code"]);
    }

    return entry;
  });

  return {
    stationId,
    stationModel: model,
    coordinates: coords,
    parameter: parameterKey,
    series,
  };
}

export default {
  getCreatedTime,
  getPointForecastByCoord,
  getForecastForStation,
};
