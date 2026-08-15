import type { Lang } from "./types";

/**
 * Gregorian only, Asia/Riyadh, Latin digits — per product brief §2.3.
 *
 * `ar-SA` defaults to the Islamic calendar, so the Gregorian calendar and
 * Latin numbering system are pinned explicitly on the locale. Nothing in
 * the product renders a Hijri date.
 */
const LOCALE: Record<Lang, string> = {
  ar: "ar-SA-u-ca-gregory-nu-latn",
  en: "en-GB-u-ca-gregory",
};

const TZ = "Asia/Riyadh";

export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    hour: "numeric",
    minute: "2-digit",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatDateLong(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

export function formatDateTime(iso: string, lang: Lang): string {
  return `${formatDate(iso, lang)} · ${formatTime(iso, lang)}`;
}

/** Riyadh calendar day as YYYY-MM-DD, for same-day comparisons. */
export function riyadhDayKey(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: TZ,
  }).format(d);
}

export function isToday(iso: string, now: Date = new Date()): boolean {
  return riyadhDayKey(iso) === riyadhDayKey(now);
}

export function isTomorrow(iso: string, now: Date = new Date()): boolean {
  const t = new Date(now.getTime() + 86_400_000);
  return riyadhDayKey(iso) === riyadhDayKey(t);
}

export function money(amount: number, lang: Lang): string {
  const n = new Intl.NumberFormat(
    lang === "ar" ? "ar-SA-u-nu-latn" : "en-GB",
    { maximumFractionDigits: 0 },
  ).format(amount);
  return lang === "ar" ? `${n} ريال` : `SAR ${n}`;
}

/** Coarse countdown for SLA timers: "5h 20m" / "٥ س ٢٠ د". */
export function countdown(deadlineIso: string, lang: Lang, now: Date = new Date()): string {
  const ms = new Date(deadlineIso).getTime() - now.getTime();
  if (ms <= 0) return lang === "ar" ? "انتهت" : "expired";
  const hours = Math.floor(ms / 3600_000);
  const mins = Math.floor((ms % 3600_000) / 60_000);
  if (lang === "ar") {
    return hours > 0 ? `${hours} س ${mins} د` : `${mins} د`;
  }
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

export function durationLabel(minutes: number, lang: Lang): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (lang === "ar") {
    if (h && m) return `${h} س ${m} د`;
    return h ? `${h} ساعة` : `${m} دقيقة`;
  }
  if (h && m) return `${h}h ${m}m`;
  return h ? `${h}h` : `${m}m`;
}
