// Minimal module: fetch a single fixed SMHI period JSON and return the latest sample
const FIXED_URL =
  "https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station/52350/period/latest-hour/data.json";

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
    date: new Date(Number(latest.date)).toLocaleString("sv-SE", {
      timeZone: "Europe/Stockholm",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }),
    value:
      latest.value === null || latest.value === undefined
        ? null
        : Number(latest.value),
    quality: latest.quality || null,
  };
}

export async function getLatestFromFixedEndpoint() {
  const json = await fetchJson(FIXED_URL);
  return pickLatestFromValueArray(json);
}

export default { getLatestFromFixedEndpoint };
