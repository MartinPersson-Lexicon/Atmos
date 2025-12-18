// SMHI parameter definitions (id, title, summary, unit)
export const SMHI_PARAMETERS = [
  { id: 21, title: "Byvind", summary: "max, 1 gång/tim", unit: "meter per sekund" },
  { id: 39, title: "Daggpunktstemperatur", summary: "momentanvärde, 1 gång/tim", unit: "celsius" },
  { id: 11, title: "Global Irradians (svenska stationer)", summary: "medelvärde 1 timma, varje timme", unit: "watt per kvadratmeter" },
  { id: 22, title: "Lufttemperatur", summary: "medel, 1 gång per månad", unit: "celsius" },
  { id: 26, title: "Lufttemperatur", summary: "min, 2 gånger per dygn, kl 06 och 18", unit: "celsius" },
  { id: 27, title: "Lufttemperatur", summary: "max, 2 gånger per dygn, kl 06 och 18", unit: "celsius" },
  { id: 19, title: "Lufttemperatur", summary: "min, 1 gång per dygn", unit: "celsius" },
  { id: 1,  title: "Lufttemperatur", summary: "momentanvärde, 1 gång/tim", unit: "celsius" },
  { id: 2,  title: "Lufttemperatur", summary: "medelvärde 1 dygn, 1 gång/dygn, kl 00", unit: "celsius" },
  { id: 20, title: "Lufttemperatur", summary: "max, 1 gång per dygn", unit: "celsius" },
  { id: 9,  title: "Lufttryck reducerat havsytans nivå", summary: "vid havsytans nivå, momentanvärde, 1 gång/tim", unit: "hektopascal" },
  { id: 24, title: "Långvågs-Irradians", summary: "medelvärde 1 timma, varje timme", unit: "watt per kvadratmeter" },
  { id: 40, title: "Markens tillstånd", summary: "momentanvärde, 1 gång/dygn, kl 06", unit: "kod" },
  { id: 25, title: "Max av MedelVindhastighet", summary: "maximum av medelvärde 10 min, under 3 timmar, 1 gång/tim", unit: "meter per sekund" },
  { id: 28, title: "Molnbas", summary: "lägsta molnlager, momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 30, title: "Molnbas", summary: "andra molnlager, momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 32, title: "Molnbas", summary: "tredje molnlager, momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 34, title: "Molnbas", summary: "fjärde molnlager, momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 36, title: "Molnbas", summary: "lägsta molnbas, momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 37, title: "Molnbas", summary: "lägsta molnbas, min under 15 min, 1 gång/tim", unit: "meter" },
  { id: 29, title: "Molnmängd", summary: "lägsta molnlager, momentanvärde, 1 gång/tim", unit: "kod" },
  { id: 31, title: "Molnmängd", summary: "andra molnlager, momentanvärde, 1 gång/tim", unit: "kod" },
  { id: 33, title: "Molnmängd", summary: "tredje molnlager, momentanvärde, 1 gång/tim", unit: "kod" },
  { id: 35, title: "Molnmängd", summary: "fjärde molnlager, momentanvärde, 1 gång/tim", unit: "kod" },
  { id: 17, title: "Nederbörd", summary: "2 gånger/dygn, kl 06 och 18", unit: "kod" },
  { id: 18, title: "Nederbörd", summary: "1 gång/dygn, kl 18", unit: "kod" },
  { id: 15, title: "Nederbördsintensitet", summary: "max under 15 min, 4 gånger/tim", unit: "millimeter per sekund" },
  { id: 38, title: "Nederbördsintensitet", summary: "max av medel under 15 min, 4 gånger/tim", unit: "millimeter per sekund" },
  { id: 23, title: "Nederbördsmängd", summary: "summa, 1 gång per månad", unit: "millimeter" },
  { id: 14, title: "Nederbördsmängd", summary: "summa 15 min, 4 gånger/tim", unit: "millimeter" },
  { id: 5,  title: "Nederbördsmängd", summary: "summa 1 dygn, 1 gång/dygn, kl 06", unit: "millimeter" },
  { id: 7,  title: "Nederbördsmängd", summary: "summa 1 timme, 1 gång/tim", unit: "millimeter" },
  { id: 6,  title: "Relativ Luftfuktighet", summary: "momentanvärde, 1 gång/tim", unit: "procent" },
  { id: 13, title: "Rådande väder", summary: "momentanvärde, 1 gång/tim resp 8 gånger/dygn", unit: "kod" },
  { id: 12, title: "Sikt", summary: "momentanvärde, 1 gång/tim", unit: "meter" },
  { id: 8,  title: "Snödjup", summary: "momentanvärde 1 gång/dygn, kl 06", unit: "meter" },
  { id: 10, title: "Solskenstid", summary: "summa 1 timme, 1 gång/tim", unit: "sekund" },
  { id: 16, title: "Total molnmängd", summary: "momentanvärde, 1 gång/tim", unit: "procent" },
  { id: 4,  title: "Vindhastighet", summary: "medelvärde 10 min, 1 gång/tim", unit: "meter per sekund" },
  { id: 3,  title: "Vindriktning", summary: "medelvärde 10 min, 1 gång/tim", unit: "grader" }
];

// Map from id -> parameter object for quick lookup
export const SMHI_PARAMETERS_MAP = Object.fromEntries(
  SMHI_PARAMETERS.map((p) => [p.id, p])
);

export default SMHI_PARAMETERS;
