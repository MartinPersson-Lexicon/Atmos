const WeatherModel = {
  Lufttemperatur: 0, //1, // Celsius
  Nederbördsintensitet: 5, // 38, // mm/s
  RelativLuftfuktighet: 50, // 6, // Procent
  Vindhastighet: 5, // 4, // m/s
  Vindriktning: 80, // 3, // grader
};

export const WeatherModelPairs = [
  { key: "Lufttemperatur", value: 1 }, // Celsius
  { key: "Nederbördsintensitet", value: 38 }, // mm/s
  { key: "Relativ Luftfuktighet", value: 6 }, // Procent
  { key: "Vindhastighet", value: 4 }, // m/s
  { key: "Vindriktning", value: 3 }, // grader
];

export default WeatherModel;

// Parameter	Title	Summary	Unit
// 21	Byvind	max, 1 gång/tim	meter per sekund
// 39	Daggpunktstemperatur	momentanvärde, 1 gång/tim	celsius
// 11	Global Irradians (svenska stationer)	medelvärde 1 timma, varje timme	watt per kvadratmeter
// 22	Lufttemperatur	medel, 1 gång per månad	celsius
// 26	Lufttemperatur	min, 2 gånger per dygn, kl 06 och 18	celsius
// 27	Lufttemperatur	max, 2 gånger per dygn, kl 06 och 18	celsius
// 19	Lufttemperatur	min, 1 gång per dygn	celsius
// 1	Lufttemperatur	momentanvärde, 1 gång/tim	celsius
// 2	Lufttemperatur	medelvärde 1 dygn, 1 gång/dygn, kl 00	celsius
// 20	Lufttemperatur	max, 1 gång per dygn	celsius
// 9	Lufttryck reducerat havsytans nivå	vid havsytans nivå, momentanvärde, 1 gång/tim	hektopascal
// 24	Långvågs-Irradians	medelvärde 1 timma, varje timme	watt per kvadratmeter
// 40	Markens tillstånd	momentanvärde, 1 gång/dygn, kl 06	kod
// 25	Max av MedelVindhastighet	maximum av medelvärde 10 min, under 3 timmar, 1 gång/tim	meter per sekund
// 28	Molnbas	lägsta molnlager, momentanvärde, 1 gång/tim	meter
// 30	Molnbas	andra molnlager, momentanvärde, 1 gång/tim	meter
// 32	Molnbas	tredje molnlager, momentanvärde, 1 gång/tim	meter
// 34	Molnbas	fjärde molnlager, momentanvärde, 1 gång/tim	meter
// 36	Molnbas	lägsta molnbas, momentanvärde, 1 gång/tim	meter
// 37	Molnbas	lägsta molnbas, min under 15 min, 1 gång/tim	meter
// 29	Molnmängd	lägsta molnlager, momentanvärde, 1 gång/tim	kod
// 31	Molnmängd	andra molnlager, momentanvärde, 1 gång/tim	kod
// 33	Molnmängd	tredje molnlager, momentanvärde, 1 gång/tim	kod
// 35	Molnmängd	fjärde molnlager, momentanvärde, 1 gång/tim	kod
// 17	Nederbörd	2 gånger/dygn, kl 06 och 18	kod
// 18	Nederbörd	1 gång/dygn, kl 18	kod
// 15	Nederbördsintensitet	max under 15 min, 4 gånger/tim	millimeter per sekund
// 38	Nederbördsintensitet	max av medel under 15 min, 4 gånger/tim	millimeter per sekund
// 23	Nederbördsmängd	summa, 1 gång per månad	millimeter
// 14	Nederbördsmängd	summa 15 min, 4 gånger/tim	millimeter
// 5	Nederbördsmängd	summa 1 dygn, 1 gång/dygn, kl 06	millimeter
// 7	Nederbördsmängd	summa 1 timme, 1 gång/tim	millimeter
// 6	Relativ Luftfuktighet	momentanvärde, 1 gång/tim	procent
// 13	Rådande väder	momentanvärde, 1 gång/tim resp 8 gånger/dygn	kod
// 12	Sikt	momentanvärde, 1 gång/tim	meter
// 8	Snödjup	momentanvärde, 1 gång/dygn, kl 06	meter
// 10	Solskenstid	summa 1 timme, 1 gång/tim	sekund
// 16	Total molnmängd	momentanvärde, 1 gång/tim	procent
// 4	Vindhastighet	medelvärde 10 min, 1 gång/tim	meter per sekund
// 3	Vindriktning	medelvärde 10 min, 1 gång/tim	grader
