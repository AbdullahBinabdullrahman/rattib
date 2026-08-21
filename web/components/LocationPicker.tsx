"use client";

import type * as Leaflet from "leaflet";
import { useEffect, useRef, useState } from "react";
import { t } from "@/lib/i18n";
import type { Bi, Lang } from "@/lib/types";
import {
  TILE_URL,
  addBaseLayers,
  geocodeRemote,
  inRiyadh,
  searchPlaces,
  type Place,
} from "@/lib/riyadh";

/**
 * Picks where an experience happens, three ways:
 *
 *  1. By name — searching a local gazetteer of Riyadh districts and
 *     landmarks, so it works with no network; an optional wider lookup
 *     handles street addresses when one is reachable.
 *  2. On the map — click anywhere, or drag the pin.
 *  3. By coordinates — for a host who already knows them.
 *
 * All three write to the same value, and the map always reflects it, so the
 * host can start one way and adjust another.
 */

export interface LocationValue {
  lat: number;
  lon: number;
  district: Bi;
}

type Mode = "search" | "map" | "coords";

export default function LocationPicker({
  value,
  onChange,
  lang,
}: {
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  lang: Lang;
}) {
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const leaflet = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const marker = useRef<Leaflet.Marker | null>(null);
  const tiles = useRef<Leaflet.TileLayer | null>(null);
  const [streets, setStreets] = useState(true);
  const [ready, setReady] = useState(false);

  // Latest value without re-creating the map on every keystroke.
  const valueRef = useRef(value);
  valueRef.current = value;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  /* Search — local first, wider lookup only if nothing matched. */
  useEffect(() => {
    const local = searchPlaces(query);
    setResults(local);
    if (local.length > 0 || query.trim().length < 3) return;

    const controller = new AbortController();
    const id = window.setTimeout(async () => {
      setSearching(true);
      const remote = await geocodeRemote(query, lang, controller.signal);
      setSearching(false);
      if (!controller.signal.aborted) setResults(remote);
    }, 450);

    return () => {
      controller.abort();
      window.clearTimeout(id);
      setSearching(false);
    };
  }, [query, lang]);

  /* Map, created once. */
  useEffect(() => {
    if (!container.current || map.current) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    void (async () => {
      const L = (await import("leaflet")).default;
      if (disposed || !container.current) return;
      leaflet.current = L;

      const m = L.map(container.current, {
        center: [valueRef.current.lat, valueRef.current.lon],
        zoom: 12,
        minZoom: 9,
        maxZoom: 17,
        attributionControl: true,
      });
      addBaseLayers(L, m);

      const mk = L.marker([valueRef.current.lat, valueRef.current.lon], {
        draggable: true,
        icon: L.divIcon({
          className: "rattib-pin-icon",
          html: `<span class="rattib-pin-wrap" data-tone="brass"><span class="rattib-pin"><span aria-hidden="true">📍</span></span></span>`,
          iconSize: [38, 38],
          iconAnchor: [19, 38],
        }),
      }).addTo(m);

      const commit = (lat: number, lon: number) =>
        onChangeRef.current({
          ...valueRef.current,
          lat: Number(lat.toFixed(5)),
          lon: Number(lon.toFixed(5)),
        });

      mk.on("dragend", () => {
        const p = mk.getLatLng();
        commit(p.lat, p.lng);
      });
      m.on("click", (e: Leaflet.LeafletMouseEvent) => {
        mk.setLatLng(e.latlng);
        commit(e.latlng.lat, e.latlng.lng);
      });

      map.current = m;
      marker.current = mk;
      setReady(true);

      cleanup = () => {
        mk.remove();
        m.remove();
        map.current = null;
        marker.current = null;
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  /* Keep the map in step when the value changes from search or coordinates. */
  useEffect(() => {
    if (!ready || !map.current || !marker.current) return;
    marker.current.setLatLng([value.lat, value.lon]);
    map.current.panTo([value.lat, value.lon], { animate: true });
  }, [ready, value.lat, value.lon]);

  /* Street tiles stay opt-in, as on the browse map. */
  useEffect(() => {
    const L = leaflet.current;
    const m = map.current;
    if (!ready || !L || !m) return;
    if (!streets) {
      tiles.current?.remove();
      tiles.current = null;
      return;
    }
    const layer = L.tileLayer(TILE_URL, {
      maxZoom: 17,
      opacity: 0.55,
      attribution: "&copy; OpenStreetMap contributors",
    });
    layer.on("tileerror", () => setStreets(false));
    layer.addTo(m);
    tiles.current = layer;
    return () => {
      layer.remove();
    };
  }, [ready, streets]);

  /** Drop the pin on the host's own position, if they allow it. */
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        onChangeRef.current({
          ...valueRef.current,
          lat: Number(pos.coords.latitude.toFixed(5)),
          lon: Number(pos.coords.longitude.toFixed(5)),
        }),
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const choose = (p: Place) => {
    onChange({
      lat: p.lat,
      lon: p.lon,
      district: { ar: p.ar, en: p.en },
    });
    setQuery("");
    setResults([]);
  };

  const outside = !inRiyadh(value.lat, value.lon);

  return (
    <div className="space-y-3">
      {/* Mode switch */}
      <div className="flex rounded-xl border border-line overflow-hidden w-fit">
        {(
          [
            ["search", "byName"],
            ["map", "onMap"],
            ["coords", "byCoords"],
          ] as const
        ).map(([m, key]) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              mode === m
                ? "bg-door text-panel"
                : "bg-panel text-muted hover:text-fg"
            }`}
          >
            {t(key, lang)}
          </button>
        ))}
      </div>

      {mode === "search" && (
        <div>
          <input
            className="field"
            placeholder={t("searchPlaceholder", lang)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searching && (
            <p className="text-xs text-muted mt-2">{t("searching", lang)}</p>
          )}
          {results.length > 0 && (
            <ul className="mt-2 rounded-xl border border-line overflow-hidden">
              {results.map((p, i) => (
                <li key={`${p.en}-${i}`}>
                  <button
                    type="button"
                    onClick={() => choose(p)}
                    className="w-full text-start px-3 py-2.5 hover:bg-panel-2 transition-colors flex items-center justify-between gap-3"
                  >
                    <span className="font-semibold text-sm">
                      {lang === "ar" ? p.ar : p.en}
                    </span>
                    <span className="text-[11px] text-faint">
                      {t(p.kind === "district" ? "kindDistrict" : "kindLandmark", lang)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {query.trim().length > 0 && results.length === 0 && !searching && (
            <p className="text-xs text-muted mt-2">{t("noPlaces", lang)}</p>
          )}
        </div>
      )}

      {mode === "coords" && (
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <span className="label">{t("latField", lang)}</span>
            <input
              type="number"
              step="0.00001"
              dir="ltr"
              className="field tnum"
              value={value.lat}
              onChange={(e) =>
                onChange({ ...value, lat: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <span className="label">{t("lonField", lang)}</span>
            <input
              type="number"
              step="0.00001"
              dir="ltr"
              className="field tnum"
              value={value.lon}
              onChange={(e) =>
                onChange({ ...value, lon: Number(e.target.value) })
              }
            />
          </div>
        </div>
      )}

      {/* The map is always visible — it is the confirmation for all three modes. */}
      <div className="relative rounded-xl overflow-hidden border border-line h-64">
        <div ref={container} className="w-full h-full" />
        {!ready && <div className="absolute inset-0 skeleton z-[500]" />}
        <button
          type="button"
          onClick={() => setStreets((v) => !v)}
          className={`absolute top-2 start-2 z-[500] chip border transition-colors ${
            streets
              ? "bg-door text-panel border-transparent"
              : "bg-panel text-muted border-line hover:text-fg"
          }`}
        >
          {lang === "ar" ? "شوارع" : "Streets"}
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          className="absolute top-2 end-2 z-[500] chip border bg-panel text-muted border-line hover:text-fg transition-colors"
        >
          {lang === "ar" ? "موقعي" : "My location"}
        </button>
        {mode === "map" && (
          <span className="absolute bottom-2 start-2 z-[500] chip bg-panel text-muted border border-line">
            {t("mapPickHint", lang)}
          </span>
        )}
      </div>

      {/* Readout — always shows exactly what will be saved. */}
      <div className="flex items-center justify-between gap-3 flex-wrap text-xs">
        <span className="text-muted">
          {t("selectedPoint", lang)}{" "}
          <span className="text-fg font-semibold tnum" dir="ltr">
            {value.lat.toFixed(5)}, {value.lon.toFixed(5)}
          </span>
        </span>
        {outside && (
          <span className="chip bg-danger-soft text-danger">
            {t("outsideRiyadh", lang)}
          </span>
        )}
      </div>

      {/* District label, editable independently of the pin. */}
      <div className="grid sm:grid-cols-2 gap-3">
        {(["ar", "en"] as Lang[]).map((l) => (
          <div key={l}>
            <input
              className="field"
              dir={l === "ar" ? "rtl" : "ltr"}
              placeholder={t("districtField", lang)}
              value={value.district[l]}
              onChange={(e) =>
                onChange({
                  ...value,
                  district: { ...value.district, [l]: e.target.value },
                })
              }
            />
            <span className="text-[11px] text-faint mt-1 block">
              {t(l === "ar" ? "arabic" : "english", lang)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
