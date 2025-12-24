// SMHI symbol_code -> emoji mapping (1-27)
const SMHI_SYMBOL_EMOJI = {
  1: "☀️",
  2: "🌤️",
  3: "⛅",
  4: "🌥️",
  5: "☁️",
  6: "☁️",
  7: "🌫️",
  8: "🌦️",
  9: "🌧️",
  10: "⛈️",
  11: "⛈️⚡",
  12: "🌨️🌧️",
  13: "🌨️",
  14: "🌨️❄️",
  15: "🌨️",
  16: "❄️",
  17: "❄️🌨️",
  18: "🌦️",
  19: "🌧️",
  20: "🌧️⛈️",
  21: "⚡",
  22: "🌨️",
  23: "🌨️",
  24: "❄️",
  25: "🌨️",
  26: "❄️",
  27: "❄️",
};

export function getSmhiSymbolEmoji(code) {
  if (code === null || code === undefined) return null;
  const n = Number(code);
  return SMHI_SYMBOL_EMOJI[n] ?? "❓";
}

export default SMHI_SYMBOL_EMOJI;
