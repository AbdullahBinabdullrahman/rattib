import type * as Leaflet from "leaflet";
import type { Bi, Lang } from "./types";

/**
 * Riyadh geography, shared by the browse map and the location picker so both
 * render the same city.
 *
 * Coordinates are approximate district and landmark centroids — good enough
 * to place a pin and orient by, not survey data. A production build would
 * take these from a geocoding service.
 */

export const RIYADH_CENTER: [number, number] = [24.715, 46.685];
export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

/** Rough bounds of the built-up city, used to keep pins plausible. */
export const RIYADH_BOUNDS = {
  latMin: 24.45,
  latMax: 25.05,
  lonMin: 46.4,
  lonMax: 47.05,
};

export const WADI_HANIFAH: [number, number][] = [
  [24.905, 46.565],
  [24.82, 46.548],
  [24.771, 46.561],
  [24.732, 46.578],
  [24.681, 46.592],
  [24.63, 46.612],
  [24.575, 46.641],
];

export const ROADS: [number, number][][] = [
  [[24.585, 46.675], [24.845, 46.675]], // King Fahd Rd
  [[24.59, 46.762], [24.83, 46.762]], // Eastern Ring Rd
  [[24.7605, 46.58], [24.7605, 46.83]], // Northern Ring Rd
  [[24.6905, 46.6], [24.6905, 46.83]], // Makkah Al Mukarramah Rd
  [[24.7215, 46.585], [24.7215, 46.8]], // King Abdullah Rd
  [[24.585, 46.72], [24.83, 46.72]], // King Abdulaziz Rd
  [[24.706, 46.6], [24.706, 46.8]], // Al Urubah Rd
];

export const URBAN_AREA: [number, number][] = [
  [24.6, 46.57],
  [24.6, 46.83],
  [24.72, 46.85],
  [24.85, 46.82],
  [24.9, 46.66],
  [24.84, 46.57],
  [24.72, 46.545],
];

export interface Place {
  ar: string;
  en: string;
  lat: number;
  lon: number;
  /** Districts are labelled on the map; landmarks are search-only. */
  kind: "district" | "landmark";
}

export const PLACES: Place[] = [
  // Districts
  { ar: "الدرعية", en: "Diriyah", lat: 24.734, lon: 46.5735, kind: "district" },
  { ar: "حطين", en: "Hittin", lat: 24.751, lon: 46.606, kind: "district" },
  { ar: "الياسمين", en: "Al Yasmin", lat: 24.824, lon: 46.632, kind: "district" },
  { ar: "الصحافة", en: "Al Sahafa", lat: 24.799, lon: 46.646, kind: "district" },
  { ar: "النخيل", en: "Al Nakheel", lat: 24.727, lon: 46.655, kind: "district" },
  { ar: "العليا", en: "Olaya", lat: 24.6905, lon: 46.688, kind: "district" },
  { ar: "المربع", en: "Al Murabba", lat: 24.6455, lon: 46.7135, kind: "district" },
  { ar: "قصر الحكم", en: "Qasr Al Hokm", lat: 24.6265, lon: 46.716, kind: "district" },
  { ar: "الملز", en: "Al Malaz", lat: 24.664, lon: 46.7385, kind: "district" },
  { ar: "الروضة", en: "Al Rawdah", lat: 24.748, lon: 46.782, kind: "district" },
  { ar: "السفارات", en: "Diplomatic Quarter", lat: 24.678, lon: 46.6185, kind: "district" },
  { ar: "الورود", en: "Al Wurud", lat: 24.716, lon: 46.677, kind: "district" },
  { ar: "الربيع", en: "Al Rabie", lat: 24.798, lon: 46.673, kind: "district" },
  { ar: "الازدهار", en: "Al Izdihar", lat: 24.766, lon: 46.706, kind: "district" },
  { ar: "قرطبة", en: "Qurtubah", lat: 24.803, lon: 46.759, kind: "district" },
  { ar: "الحمراء", en: "Al Hamra", lat: 24.775, lon: 46.79, kind: "district" },
  { ar: "النسيم", en: "Al Naseem", lat: 24.72, lon: 46.83, kind: "district" },
  { ar: "الشفا", en: "Al Shifa", lat: 24.565, lon: 46.72, kind: "district" },
  { ar: "عرقة", en: "Irqah", lat: 24.706, lon: 46.556, kind: "district" },
  { ar: "أم الحمام", en: "Umm Al Hamam", lat: 24.716, lon: 46.632, kind: "district" },
  { ar: "المحمدية", en: "Al Mohammadiyah", lat: 24.744, lon: 46.634, kind: "district" },
  { ar: "السليمانية", en: "Al Sulimaniyah", lat: 24.704, lon: 46.703, kind: "district" },
  { ar: "الوزارات", en: "Al Wizarat", lat: 24.658, lon: 46.708, kind: "district" },
  { ar: "المرسلات", en: "Al Mursalat", lat: 24.744, lon: 46.7, kind: "district" },
  { ar: "الغدير", en: "Al Ghadir", lat: 24.767, lon: 46.678, kind: "district" },
  { ar: "المصيف", en: "Al Masif", lat: 24.752, lon: 46.677, kind: "district" },
  { ar: "البطحاء", en: "Al Batha", lat: 24.63, lon: 46.723, kind: "district" },
  { ar: "منفوحة", en: "Manfouhah", lat: 24.611, lon: 46.723, kind: "district" },
  { ar: "السويدي", en: "Al Suwaidi", lat: 24.6, lon: 46.665, kind: "district" },
  { ar: "العقيق", en: "Al Aqiq", lat: 24.767, lon: 46.643, kind: "district" },

  // Landmarks
  { ar: "برج المملكة", en: "Kingdom Centre", lat: 24.7113, lon: 46.6745, kind: "landmark" },
  { ar: "برج الفيصلية", en: "Al Faisaliah Tower", lat: 24.6905, lon: 46.6853, kind: "landmark" },
  { ar: "حي الطريف", en: "At-Turaif District", lat: 24.7339, lon: 46.5721, kind: "landmark" },
  { ar: "البجيري", en: "Al Bujairi Terrace", lat: 24.7346, lon: 46.5766, kind: "landmark" },
  { ar: "قصر المصمك", en: "Al Masmak Palace", lat: 24.6309, lon: 46.7135, kind: "landmark" },
  { ar: "بوليفارد رياض سيتي", en: "Boulevard Riyadh City", lat: 24.7676, lon: 46.6205, kind: "landmark" },
  { ar: "المركز المالي — كافد", en: "KAFD", lat: 24.7625, lon: 46.6415, kind: "landmark" },
  { ar: "الرياض فرونت", en: "Riyadh Front", lat: 24.8154, lon: 46.7093, kind: "landmark" },
  { ar: "المتحف الوطني", en: "National Museum", lat: 24.6474, lon: 46.7113, kind: "landmark" },
  { ar: "حديقة السلام", en: "Salam Park", lat: 24.6339, lon: 46.7016, kind: "landmark" },
  { ar: "وادي حنيفة", en: "Wadi Hanifah Park", lat: 24.6805, lon: 46.5915, kind: "landmark" },
  { ar: "الرياض بارك", en: "Riyadh Park Mall", lat: 24.7597, lon: 46.6294, kind: "landmark" },
  { ar: "النخيل مول", en: "Al Nakheel Mall", lat: 24.7549, lon: 46.6428, kind: "landmark" },
  { ar: "جامعة الملك سعود", en: "King Saud University", lat: 24.7228, lon: 46.6199, kind: "landmark" },
  { ar: "شارع التحلية", en: "Tahlia Street", lat: 24.6928, lon: 46.6836, kind: "landmark" },
  { ar: "حديقة الملك عبدالله", en: "King Abdullah Park", lat: 24.7016, lon: 46.7295, kind: "landmark" },
  { ar: "الظهيرة", en: "Al Dhahirah", lat: 24.6367, lon: 46.7009, kind: "landmark" },
];

export const DISTRICTS = PLACES.filter((p) => p.kind === "district");

/* ------------------------------------------------------------------ */
/* Search                                                              */
/* ------------------------------------------------------------------ */

/**
 * Arabic is written with varying orthography — alef forms, ta marbuta,
 * optional diacritics — so both the query and the target are flattened
 * before comparison, otherwise "الدرعيه" would not match "الدرعية".
 */
function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىي]/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .trim();
}

export function searchPlaces(query: string, limit = 6): Place[] {
  const q = normalise(query);
  if (q.length < 1) return [];

  const scored = PLACES.map((p) => {
    const ar = normalise(p.ar);
    const en = normalise(p.en);
    let score = -1;
    if (ar === q || en === q) score = 100;
    else if (ar.startsWith(q) || en.startsWith(q)) score = 70;
    else if (ar.includes(q) || en.includes(q)) score = 40;
    // Landmarks rank just below districts on equal matches.
    if (score > 0 && p.kind === "landmark") score -= 5;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.p);
}

export function placeLabel(p: Place): Bi {
  return { ar: p.ar, en: p.en };
}

export function inRiyadh(lat: number, lon: number): boolean {
  return (
    lat >= RIYADH_BOUNDS.latMin &&
    lat <= RIYADH_BOUNDS.latMax &&
    lon >= RIYADH_BOUNDS.lonMin &&
    lon <= RIYADH_BOUNDS.lonMax
  );
}

/**
 * Optional wider lookup for anything not in the local gazetteer — a street
 * address, a specific venue. Fails silently: the shared single-file build
 * blocks external hosts, and the picker still works via search, map click
 * and coordinates.
 */
export async function geocodeRemote(
  query: string,
  lang: Lang,
  signal?: AbortSignal,
): Promise<Place[]> {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&limit=5" +
    `&viewbox=${RIYADH_BOUNDS.lonMin},${RIYADH_BOUNDS.latMax},${RIYADH_BOUNDS.lonMax},${RIYADH_BOUNDS.latMin}` +
    `&bounded=1&accept-language=${lang}&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const rows = (await res.json()) as {
      display_name: string;
      lat: string;
      lon: string;
    }[];
    return rows.map((r) => ({
      ar: r.display_name.split(",")[0],
      en: r.display_name.split(",")[0],
      lat: Number(r.lat),
      lon: Number(r.lon),
      kind: "landmark" as const,
    }));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Shared base layers                                                  */
/* ------------------------------------------------------------------ */

/** Draws the city underneath, so the map reads with no tiles at all. */
export function addBaseLayers(L: typeof Leaflet, map: Leaflet.Map) {
  // Built-up ground: one step deeper than the page, never a dark blob.
  L.polygon(URBAN_AREA, {
    stroke: false,
    fillColor: "#e3d8c3",
    fillOpacity: 0.85,
    interactive: false,
  }).addTo(map);

  L.polyline(WADI_HANIFAH, {
    color: "#c3d3bd",
    weight: 20,
    opacity: 0.85,
    lineCap: "round",
    lineJoin: "round",
    interactive: false,
  }).addTo(map);

  L.polyline(WADI_HANIFAH, {
    color: "#8aa886",
    weight: 4,
    opacity: 0.9,
    lineCap: "round",
    interactive: false,
  }).addTo(map);

  ROADS.forEach((road) =>
    L.polyline(road, {
      color: "#c9bca3",
      weight: 2.5,
      opacity: 1,
      interactive: false,
    }).addTo(map),
  );
}
