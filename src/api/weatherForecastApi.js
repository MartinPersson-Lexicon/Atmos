import { SMHI_CITY_MODELS } from "../models/cityModel.js";
import { getSmhiSymbolCodeEmoji } from "../models/SmhiSymbolCodesEmoji.js";
import { getSmhiSymbolCodeText } from "../models/SmhiSymbolCodesText.js";

const baseUrl =
  "https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1";
const createdTimeUrl = `${baseUrl}/createdtime.json`;

export async function getCreatedTime() {
  const res = await fetch(createdTimeUrl);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  return res.json();
}

export async function getPointForecastByCoord(lat, lon) {
  const url = `${baseUrl}/geotype/point/lon/${lon}/lat/${lat}/data.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error ${res.status} ${res.statusText}`);
  return res.json();
}

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
      let v = ts.data ? ts.data[k] ?? null : null;
      if (k === "air_temperature" && v !== null && v !== undefined) {
        const n = Number(v);
        v = Number.isNaN(n) ? null : Math.round(n);
      }
      values[k] = v;
    }

    const entry = {
      time: ts.time,
      value: keys.length ? values[keys[0]] : null,
      values,
      raw: ts,
    };
    if (keys.includes("symbol_code"))
      entry.emoji = getSmhiSymbolCodeEmoji(values["symbol_code"]);
    entry.symbol_text = getSmhiSymbolCodeText(values["symbol_code"]);
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

export async function getLatestHourForecastForStation(
  stationId,
  //   parameterKeys = ["air_temperature", "symbol_code"]
  parameterKeys = ["symbol_code"]
) {
  const full = await getForecastForStation(stationId, parameterKeys);
  const series = Array.isArray(full.series) ? full.series : [];
  if (!series.length) {
    return {
      ...full,
      series: [],
      range: null,
    };
  }

  const times = series
    .map((s) => Date.parse(s.time))
    .filter((t) => !Number.isNaN(t));
  if (!times.length) {
    return {
      ...full,
      series: [],
      range: null,
    };
  }

  const maxT = Math.max(...times);
  const hourMs = 60 * 60 * 1000;
  const start = maxT - hourMs;

  const filtered = series.filter((s) => {
    const t = Date.parse(s.time);
    return !Number.isNaN(t) && t >= start && t <= maxT;
  });

  return {
    ...full,
    series: filtered,
    range: {
      from: new Date(start).toISOString(),
      to: new Date(maxT).toISOString(),
    },
  };
}

export async function get10DayForecastForStation(
  stationId,
  parameterKeys = ["air_temperature", "symbol_code"]
) {
  const full = await getForecastForStation(stationId, parameterKeys);
  const now = Date.now();
  const tenDaysMs = 10 * 24 * 60 * 60 * 1000;
  const end = now + tenDaysMs;

  const filtered = (full.series || []).filter((s) => {
    const t = Date.parse(s.time);
    return !Number.isNaN(t) && t >= now && t <= end;
  });

  const groups = filtered.reduce((acc, s) => {
    const t = Date.parse(s.time);
    if (Number.isNaN(t)) return acc;
    const day = new Date(t).toISOString().slice(0, 10);
    if (!acc[day]) acc[day] = [];
    acc[day].push(s);
    return acc;
  }, {});

  const keys = Array.isArray(parameterKeys) ? parameterKeys : [parameterKeys];

  const days = Object.keys(groups)
    .sort()
    .map((day) => {
      const items = groups[day];
      const values = {};

      for (const key of keys) {
        const vals = items.map((it) => it.values?.[key]);
        const nonNull = vals.filter((v) => v !== null && v !== undefined);

        if (key === "symbol_code") {
          const freq = {};
          nonNull.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
          const entries = Object.entries(freq);
          values[key] = entries.length
            ? Number(entries.sort((a, b) => b[1] - a[1])[0][0])
            : null;
        } else {
          const nums = nonNull
            .map((v) => Number(v))
            .filter((n) => !Number.isNaN(n));
          if (nums.length) {
            const min = Math.min(...nums);
            const max = Math.max(...nums);
            values[`${key}_min`] = Math.round(min);
            values[`${key}_max`] = Math.round(max);
            values[key] = values[`${key}_max`];
          } else {
            values[`${key}_min`] = null;
            values[`${key}_max`] = null;
            values[key] = null;
          }
        }
      }

      const entry = {
        time: day,
        values,
        value: keys.length ? values[keys[0]] ?? null : null,
        raw: items.map((it) => it.raw ?? it),
      };
      if (keys.includes("symbol_code"))
        entry.emoji = getSmhiSymbolCodeEmoji(values["symbol_code"]);
      entry.symbol_text = getSmhiSymbolCodeText(values["symbol_code"]);
      return entry;
    });

  return {
    ...full,
    series: days,
    range: {
      from: new Date(now).toISOString(),
      to: new Date(end).toISOString(),
    },
  };
}

export default {
  getCreatedTime,
  getPointForecastByCoord,
  getForecastForStation,
  get10DayForecastForStation,
};
