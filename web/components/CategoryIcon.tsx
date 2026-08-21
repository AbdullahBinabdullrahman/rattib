import type { CategoryId } from "@/lib/types";

/**
 * Drawn marks for each craft, replacing the emoji the categories used to
 * carry. Emoji render differently on every platform, cannot take the
 * palette, and read as filler; these are line drawings of the actual object
 * — a dallah for coffee, a qalam for calligraphy, a woven band for sadu.
 *
 * Paths are exported as strings as well as components, because the map pins
 * are built as raw HTML for Leaflet rather than rendered by React.
 */

const PATHS: Record<CategoryId, string> = {
  // Vase on the wheel
  pottery:
    '<path d="M8.5 3.5h7M10 3.5c-.4 2.2-4 3.4-4 8 0 4.2 2.7 7 6 7s6-2.8 6-7c0-4.6-3.6-5.8-4-8"/><path d="M7 11.5h10"/>',
  // Loaf, scored
  bakery:
    '<path d="M3.5 14.5c0-3.6 3.8-6.5 8.5-6.5s8.5 2.9 8.5 6.5v2.5a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 17z"/><path d="M9 11.2l1.6 2.4M13 11.2l1.6 2.4"/>',
  // Woven bands on the loom
  sadu:
    '<path d="M3.5 7.5l2.8-1.8 2.9 1.8 2.8-1.8 2.9 1.8 2.8-1.8 2.8 1.8"/><path d="M3.5 12l2.8-1.8L9.2 12l2.8-1.8L14.9 12l2.8-1.8L20.5 12"/><path d="M3.5 16.5l2.8-1.8 2.9 1.8 2.8-1.8 2.9 1.8 2.8-1.8 2.8 1.8"/>',
  // Dallah — the Arabic coffee pot
  coffee:
    '<path d="M8 20.5h8l1.1-9.5H6.9z"/><path d="M9 11V8.5a3 3 0 0 1 6 0V11"/><path d="M15 8.5l3-2.5"/><path d="M6.9 13.5c-1.6.5-2.4 1.6-2.4 2.8s.9 2.2 2.4 2.6"/><path d="M10.5 5.5h3"/>',
  // Qalam and its stroke
  calligraphy:
    '<path d="M4 20.5c2.6-.4 4.4-1.1 6-2.4"/><path d="M8.6 17.4l9.1-9.1a1.6 1.6 0 0 0 0-2.3l-.7-.7a1.6 1.6 0 0 0-2.3 0l-9.1 9.1z"/><path d="M5.6 14.4l3 3"/>',
  // Mabkhara, burning
  perfume:
    '<path d="M7 12.5h10l-1 6.5a1.5 1.5 0 0 1-1.5 1.3h-5A1.5 1.5 0 0 1 8 19z"/><path d="M6 12.5h12"/><path d="M12 9.5c1.6-1 1.6-2.6 0-3.6M9.2 9.8c1-.8 1-2 0-2.8M14.8 9.8c-1-.8-1-2 0-2.8"/>',
  // A folded sheet of verse
  poetry:
    '<path d="M5.5 4.5h10a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h-11A1.5 1.5 0 0 1 6 18V6"/><path d="M5.5 4.5A1.5 1.5 0 0 0 4 6v1.5h2"/><path d="M9 9h5M9 12.5h5"/>',
  // Palm frond
  khoos:
    '<path d="M12 20.5V7"/><path d="M12 8.5c-1.6-2.2-3.8-3.2-6.4-3.3.7 2.5 2.6 4 6.4 4.6"/><path d="M12 8.5c1.6-2.2 3.8-3.2 6.4-3.3-.7 2.5-2.6 4-6.4 4.6"/><path d="M12 13c-1.3-1.7-3-2.5-5-2.6.5 2 2 3.1 5 3.6"/><path d="M12 13c1.3-1.7 3-2.5 5-2.6-.5 2-2 3.1-5 3.6"/>',
  // Compass rose
  tours:
    '<circle cx="12" cy="12" r="8.2"/><path d="M15.2 8.8l-1.7 4.7-4.7 1.7 1.7-4.7z"/>',
};

export function categoryIconSvg(
  category: CategoryId,
  size = 20,
  stroke = "currentColor",
): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[category]}</svg>`;
}

export default function CategoryIcon({
  category,
  size = 20,
  className = "",
}: {
  category: CategoryId;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: PATHS[category] }}
    />
  );
}
