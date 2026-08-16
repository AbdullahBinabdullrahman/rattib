"use client";

import type * as Leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { Experience, Lang } from "@/lib/types";
import { CATEGORY_GLYPH, pick } from "@/lib/i18n";

/**
 * Riyadh map, built on Leaflet (BSD-2, open source, no API key).
 *
 * Two layers of base map, in order of preference:
 *
 *  1. OpenStreetMap raster tiles — real streets, when the network allows.
 *  2. Local geometry rendered as SVG from inline GeoJSON, always drawn.
 *     The single-file build runs under a content-security policy that blocks
 *     every external request, so without this the map would be an empty
 *     rectangle wherever the demo is shared.
 *
 * Leaflet rather than MapLibre deliberately: MapLibre parses vector sources
 * in a Web Worker, which does not survive this bundler and cannot exist at
 * all inside a single self-contained HTML file. Leaflet needs no worker and
 * no WebGL, so the same component works in the app and in the shared build.
 */

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const RIYADH_CENTER: [number, number] = [24.715, 46.685];

/* ------------------------------------------------------------------ */
/* Local geometry, as [lat, lon] the way Leaflet expects               */
/* ------------------------------------------------------------------ */

const WADI_HANIFAH: [number, number][] = [
  [24.905, 46.565],
  [24.82, 46.548],
  [24.771, 46.561],
  [24.732, 46.578],
  [24.681, 46.592],
  [24.63, 46.612],
  [24.575, 46.641],
];

const ROADS: [number, number][][] = [
  [[24.585, 46.675], [24.845, 46.675]], // King Fahd Rd
  [[24.59, 46.762], [24.83, 46.762]], // Eastern Ring Rd
  [[24.7605, 46.58], [24.7605, 46.83]], // Northern Ring Rd
  [[24.6905, 46.6], [24.6905, 46.83]], // Makkah Al Mukarramah Rd
  [[24.7215, 46.585], [24.7215, 46.8]], // King Abdullah Rd
  [[24.585, 46.72], [24.83, 46.72]], // King Abdulaziz Rd
  [[24.706, 46.6], [24.706, 46.8]], // Al Urubah Rd
];

const URBAN_AREA: [number, number][] = [
  [24.6, 46.57],
  [24.6, 46.83],
  [24.72, 46.85],
  [24.85, 46.82],
  [24.9, 46.66],
  [24.84, 46.57],
  [24.72, 46.545],
];

export const DISTRICTS: { ar: string; en: string; lat: number; lon: number }[] = [
  { ar: "الدرعية", en: "Diriyah", lat: 24.734, lon: 46.5735 },
  { ar: "حطين", en: "Hittin", lat: 24.751, lon: 46.606 },
  { ar: "الياسمين", en: "Al Yasmin", lat: 24.824, lon: 46.632 },
  { ar: "الصحافة", en: "Al Sahafa", lat: 24.799, lon: 46.646 },
  { ar: "النخيل", en: "Al Nakheel", lat: 24.727, lon: 46.655 },
  { ar: "العليا", en: "Olaya", lat: 24.6905, lon: 46.688 },
  { ar: "المربع", en: "Al Murabba", lat: 24.6455, lon: 46.7135 },
  { ar: "قصر الحكم", en: "Qasr Al Hokm", lat: 24.6265, lon: 46.716 },
  { ar: "الملز", en: "Al Malaz", lat: 24.664, lon: 46.7385 },
  { ar: "الروضة", en: "Al Rawdah", lat: 24.748, lon: 46.782 },
  { ar: "السفارات", en: "Diplomatic Quarter", lat: 24.678, lon: 46.6185 },
];

/**
 * Leaflet positions a marker by writing a transform onto its element, so the
 * rotated teardrop has to be a child rather than the element itself.
 */
function pinHtml(exp: Experience) {
  const tone = exp.audiencePolicy === "women_only" ? "rose" : "brass";
  return `<span class="rattib-pin-wrap" data-tone="${tone}" data-selected="false"><span class="rattib-pin pin-in"><span aria-hidden="true">${
    CATEGORY_GLYPH[exp.category]
  }</span></span></span>`;
}

export default function RiyadhMap({
  experiences,
  selectedId,
  onSelect,
  lang,
}: {
  experiences: Experience[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  lang: Lang;
}) {
  const container = useRef<HTMLDivElement>(null);
  const leaflet = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const markers = useRef<globalThis.Map<string, Leaflet.Marker>>(
    new globalThis.Map(),
  );
  const districts = useRef<Leaflet.Marker[]>([]);
  const [ready, setReady] = useState(false);
  const tileLayer = useRef<Leaflet.TileLayer | null>(null);
  const [streets, setStreets] = useState(false);
  const [tilesFailed, setTilesFailed] = useState(false);

  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  /* Create the map once. Leaflet touches `window` at module scope, so it is
     imported here rather than at the top of the file — that keeps the page
     server-renderable and works identically in the single-file build. */
  useEffect(() => {
    if (!container.current || map.current) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !container.current) return;
      leaflet.current = L;

      const m = L.map(container.current, {
        center: RIYADH_CENTER,
        zoom: 11,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: true,
        attributionControl: true,
        // Keyboard panning would fight the page's own scroll handling.
        scrollWheelZoom: true,
      });

      // Local geometry first: this is what makes the map legible with no
      // network at all, and it sits under the tiles when they do arrive.
      L.polygon(URBAN_AREA, {
        color: "#232833",
        weight: 1,
        fillColor: "#161a21",
        fillOpacity: 1,
        interactive: false,
      }).addTo(m);

      L.polyline(WADI_HANIFAH, {
        color: "#1c3a33",
        weight: 22,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round",
        interactive: false,
      }).addTo(m);

      L.polyline(WADI_HANIFAH, {
        color: "#2f6a58",
        weight: 6,
        lineCap: "round",
        interactive: false,
      }).addTo(m);

      ROADS.forEach((road) =>
        L.polyline(road, {
          color: "#333a46",
          weight: 3,
          interactive: false,
        }).addTo(m),
      );


      map.current = m;
      setReady(true);

      cleanup = () => {
        markers.current.forEach((mk) => mk.remove());
        markers.current.clear();
        districts.current.forEach((mk) => mk.remove());
        districts.current = [];
        m.remove();
        map.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  /* Street tiles are opt-in: the shared single-file build runs under a
     content policy that blocks external hosts, so the map must be useful
     without ever reaching for the network. */
  useEffect(() => {
    const L = leaflet.current;
    const m = map.current;
    if (!ready || !L || !m) return;

    if (!streets) {
      tileLayer.current?.remove();
      tileLayer.current = null;
      return;
    }

    const layer = L.tileLayer(TILE_URL, {
      maxZoom: 16,
      opacity: 0.55,
      className: "rattib-tiles",
      attribution: "&copy; OpenStreetMap contributors",
    });
    layer.on("tileerror", () => {
      setTilesFailed(true);
      setStreets(false);
    });
    layer.addTo(m);
    tileLayer.current = layer;

    return () => {
      layer.remove();
    };
  }, [ready, streets]);

  /* District labels. */
  useEffect(() => {
    if (!ready || !map.current) return;
    districts.current.forEach((mk) => mk.remove());
    const L = leaflet.current;
    if (!L) return;
    districts.current = DISTRICTS.map((d) =>
      L.marker([d.lat, d.lon], {
        icon: L.divIcon({
          className: "rattib-district-icon",
          html: `<span class="rattib-district">${lang === "ar" ? d.ar : d.en}</span>`,
          iconSize: [0, 0],
        }),
        interactive: false,
        keyboard: false,
      }).addTo(map.current!),
    );
  }, [ready, lang]);

  /* Experience pins. */
  useEffect(() => {
    if (!ready || !map.current) return;

    const L = leaflet.current;
    if (!L) return;

    const wanted = new Set(experiences.map((e) => e.id));
    for (const [id, mk] of markers.current) {
      if (!wanted.has(id)) {
        mk.remove();
        markers.current.delete(id);
      }
    }

    experiences.forEach((exp) => {
      if (markers.current.has(exp.id)) return;
      const mk = L.marker([exp.lat, exp.lon], {
        icon: L.divIcon({
          className: "rattib-pin-icon",
          html: pinHtml(exp),
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        }),
        title: pick(exp.title, lang),
        riseOnHover: true,
      })
        .addTo(map.current!)
        .on("click", () => onSelectRef.current(exp.id));
      markers.current.set(exp.id, mk);
    });
  }, [ready, experiences, lang]);

  /* Selection: highlight the pin and ease the map toward it. */
  useEffect(() => {
    for (const [id, mk] of markers.current) {
      const wrap = mk.getElement()?.querySelector(".rattib-pin-wrap");
      if (wrap instanceof HTMLElement) {
        wrap.dataset.selected = id === selectedId ? "true" : "false";
      }
    }
    if (!selectedId || !map.current) return;
    const exp = experiences.find((e) => e.id === selectedId);
    if (!exp) return;
    map.current.flyTo([exp.lat, exp.lon], Math.max(map.current.getZoom(), 13), {
      duration: 0.7,
    });
  }, [selectedId, experiences]);

  return (
    <div className="relative w-full h-full">
      <div ref={container} className="w-full h-full" />

      {!ready && <div className="absolute inset-0 skeleton z-[500]" />}

      <div className="absolute bottom-3 start-3 card px-3 py-2 flex flex-col gap-1.5 pointer-events-none z-[500]">
        <span className="flex items-center gap-2 text-[11px] font-semibold">
          <i className="w-2.5 h-2.5 rounded-full bg-rose inline-block" />
          {lang === "ar" ? "للنساء فقط" : "Women only"}
        </span>
        <span className="flex items-center gap-2 text-[11px] font-semibold">
          <i className="w-2.5 h-2.5 rounded-full bg-brass inline-block" />
          {lang === "ar" ? "بقية التجارب" : "All other experiences"}
        </span>
      </div>

      <div className="absolute top-3 start-3 z-[500] flex items-center gap-2">
        <button
          onClick={() => {
            setTilesFailed(false);
            setStreets((v) => !v);
          }}
          className={`chip border transition-colors ${
            streets
              ? "bg-brass text-[#16120a] border-transparent"
              : "bg-panel text-muted border-line hover:text-fg"
          }`}
        >
          {lang === "ar" ? "شوارع" : "Streets"}
        </button>
        {tilesFailed && (
          <span className="chip bg-panel-2 text-muted border border-line">
            {lang === "ar" ? "الخريطة غير متاحة" : "Tiles unavailable"}
          </span>
        )}
      </div>
    </div>
  );
}
