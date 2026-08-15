"use client";

import type { Experience, Lang } from "@/lib/types";
import { CATEGORY_GLYPH, pick } from "@/lib/i18n";

/**
 * A stylised vector map of Riyadh.
 *
 * Drawn inline rather than using a tile provider: no API key, no network
 * dependency at demo time, and full control over how audience policy reads
 * at a glance — women-only pins are rose, everything else is palm green.
 */

const BOUNDS = { lonMin: 46.54, lonMax: 46.86, latMin: 24.56, latMax: 24.92 };
const W = 1000;
const H = 760;

export function project(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - BOUNDS.lonMin) / (BOUNDS.lonMax - BOUNDS.lonMin)) * W;
  const y = ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * H;
  return { x, y };
}

const DISTRICTS: { ar: string; en: string; lat: number; lon: number }[] = [
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

/** Major arteries, as [lat|lon, from, to] in degrees. */
const ROADS_V = [46.675, 46.762, 46.6265]; // King Fahd, Eastern Ring, DQ approach
const ROADS_H = [24.7605, 24.6905, 24.7215, 24.6395]; // N Ring, Makkah Rd, K Abdullah, S

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
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-full block"
      role="img"
      aria-label={lang === "ar" ? "خريطة الرياض" : "Map of Riyadh"}
    >
      <defs>
        <linearGradient id="mapbg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6F1E7" />
          <stop offset="100%" stopColor="#EFE7D8" />
        </linearGradient>
        <pattern id="mapgrid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path
            d="M50 0 L0 0 0 50"
            fill="none"
            stroke="#DFD4C0"
            strokeWidth="0.6"
            strokeOpacity="0.6"
          />
        </pattern>
        <filter id="pinshadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect width={W} height={H} fill="url(#mapbg)" />
      <rect width={W} height={H} fill="url(#mapgrid)" />

      {/* Wadi Hanifah — the valley the city grew along */}
      <path
        d="M 40 60 C 90 180, 60 280, 130 380 C 190 465, 175 560, 250 700 L 300 760"
        fill="none"
        stroke="#CFE0CE"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M 40 60 C 90 180, 60 280, 130 380 C 190 465, 175 560, 250 700 L 300 760"
        fill="none"
        stroke="#B6D2B4"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Built-up area */}
      <ellipse
        cx={520}
        cy={430}
        rx={400}
        ry={300}
        fill="#E7DCC8"
        fillOpacity="0.55"
      />

      {/* Roads */}
      <g stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.95">
        {ROADS_V.map((lon) => {
          const { x } = project(0, lon);
          return <line key={`v${lon}`} x1={x} y1={70} x2={x} y2={H - 40} />;
        })}
        {ROADS_H.map((lat) => {
          const { y } = project(lat, 0);
          return <line key={`h${lat}`} x1={70} y1={y} x2={W - 60} y2={y} />;
        })}
      </g>
      <g stroke="#E3D7C1" strokeWidth="1.5" opacity="0.9">
        {ROADS_V.map((lon) => {
          const { x } = project(0, lon);
          return <line key={`vo${lon}`} x1={x} y1={70} x2={x} y2={H - 40} />;
        })}
        {ROADS_H.map((lat) => {
          const { y } = project(lat, 0);
          return <line key={`ho${lat}`} x1={70} y1={y} x2={W - 60} y2={y} />;
        })}
      </g>

      {/* District markers. The labels themselves are drawn last, on top of
          the pins, so a pin can never clip a place name. */}
      <g>
        {DISTRICTS.map((d) => {
          const { x, y } = project(d.lat, d.lon);
          return <circle key={d.en} cx={x} cy={y} r={3} fill="#C3B49A" />;
        })}
      </g>

      {/* Experience pins */}
      <g>
        {experiences.map((exp, i) => {
          const { x, y } = project(exp.lat, exp.lon);
          const selected = exp.id === selectedId;
          const rose = exp.audiencePolicy === "women_only";
          const fill = rose ? "#A63C6B" : "#14614C";
          const r = selected ? 24 : 19;

          return (
            <g
              key={exp.id}
              className="pin-in cursor-pointer"
              style={{ animationDelay: `${Math.min(i * 45, 500)}ms` }}
              onClick={() => onSelect(exp.id)}
              role="button"
              aria-label={pick(exp.title, lang)}
            >
              {selected && (
                <circle cx={x} cy={y} r={r + 12} fill={fill} fillOpacity="0.16" />
              )}
              <g filter="url(#pinshadow)">
                <path
                  d={`M ${x} ${y + r * 0.95} L ${x - 6} ${y + r * 0.35} L ${
                    x + 6
                  } ${y + r * 0.35} Z`}
                  fill={fill}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={fill}
                  stroke="#fff"
                  strokeWidth={selected ? 3.5 : 2.5}
                />
              </g>
              <text
                x={x}
                y={y + r * 0.34}
                textAnchor="middle"
                fontSize={selected ? 21 : 17}
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {CATEGORY_GLYPH[exp.category]}
              </text>
            </g>
          );
        })}
      </g>

      {/* District labels, drawn above everything with a halo so they stay
          readable wherever a pin lands. */}
      <g style={{ pointerEvents: "none" }}>
        {DISTRICTS.map((d) => {
          const { x, y } = project(d.lat, d.lon);
          return (
            <text
              key={d.en}
              x={x}
              y={y - 28}
              textAnchor="middle"
              fontSize="12.5"
              fill="#7E7260"
              fontWeight="700"
              stroke="#F2EBDF"
              strokeWidth="3.5"
              paintOrder="stroke"
            >
              {lang === "ar" ? d.ar : d.en}
            </text>
          );
        })}
      </g>

      {/* Legend */}
      <g transform={`translate(${W - 205}, ${H - 78})`}>
        <rect
          width="185"
          height="58"
          rx="10"
          fill="#fff"
          fillOpacity="0.92"
          stroke="#E9E1D5"
        />
        <circle cx="20" cy="21" r="7" fill="#A63C6B" />
        <text x="34" y="26" fontSize="12.5" fill="#4A4238" fontWeight="600">
          {lang === "ar" ? "للنساء فقط" : "Women only"}
        </text>
        <circle cx="20" cy="42" r="7" fill="#14614C" />
        <text x="34" y="47" fontSize="12.5" fill="#4A4238" fontWeight="600">
          {lang === "ar" ? "بقية التجارب" : "All other experiences"}
        </text>
      </g>
    </svg>
  );
}
