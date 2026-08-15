"use client";

import type { AudiencePolicy, Bi, BookingStatus, CategoryId, ExperienceStatus, Lang } from "@/lib/types";
import { AUDIENCE_LABEL, CATEGORY_GLYPH, CATEGORY_LABEL, pick, t } from "@/lib/i18n";

/* ---------------------------------------------------------------- */
/* Audience policy badge — the product's signature primitive         */
/* ---------------------------------------------------------------- */

const AUDIENCE_STYLE: Record<AudiencePolicy, string> = {
  women_only: "bg-rose-soft text-rose",
  men_only: "bg-palm-soft text-palm",
  families_only: "bg-gold-soft text-gold",
  mixed: "bg-sand-deep text-muted",
  private_buyout: "bg-clay-soft text-clay",
};

const AUDIENCE_ICON: Record<AudiencePolicy, string> = {
  women_only: "♀",
  men_only: "♂",
  families_only: "◈",
  mixed: "◍",
  private_buyout: "▣",
};

export function AudienceBadge({
  policy,
  lang,
  size = "sm",
}: {
  policy: AudiencePolicy;
  lang: Lang;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`chip ${AUDIENCE_STYLE[policy]} ${
        size === "md" ? "!text-[0.8rem] !px-2.5 !py-1" : ""
      }`}
    >
      <span aria-hidden>{AUDIENCE_ICON[policy]}</span>
      {pick(AUDIENCE_LABEL[policy], lang)}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Category artwork — self-contained, no external images             */
/* ---------------------------------------------------------------- */

const CATEGORY_GRADIENT: Record<CategoryId, [string, string]> = {
  pottery: ["#C2703F", "#8A4526"],
  bakery: ["#D69B3C", "#A05F1E"],
  sadu: ["#A83B4B", "#6E1F2E"],
  coffee: ["#8C5A38", "#4E2E1B"],
  calligraphy: ["#3C4E7A", "#1E2748"],
  perfume: ["#7A4A86", "#43244C"],
  poetry: ["#2C6E63", "#14403A"],
  khoos: ["#5E8C42", "#31541F"],
  tours: ["#3E7EA0", "#1F4A63"],
};

/** A repeating eight-point star, drawn inline so nothing is fetched. */
function StarPattern({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
        <g fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="1">
          <path d="M22 4 L28 16 L40 22 L28 28 L22 40 L16 28 L4 22 L16 16 Z" />
          <rect x="4" y="4" width="36" height="36" transform="rotate(45 22 22)" />
        </g>
      </pattern>
    </defs>
  );
}

export function CategoryArt({
  category,
  className = "",
  glyphSize = "text-5xl",
}: {
  category: CategoryId;
  className?: string;
  glyphSize?: string;
}) {
  const [from, to] = CATEGORY_GRADIENT[category];
  const patternId = `stars-${category}`;
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <StarPattern id={patternId} />
        <rect width="100%" height="100%" fill={`url(#grad-${category})`} />
        <defs>
          <linearGradient id={`grad-${category}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <div className={`relative grid place-items-center h-full ${glyphSize}`}>
        <span aria-hidden>{CATEGORY_GLYPH[category]}</span>
      </div>
    </div>
  );
}

export function CategoryChip({
  category,
  lang,
}: {
  category: CategoryId;
  lang: Lang;
}) {
  return (
    <span className="chip bg-sand-deep text-muted">
      <span aria-hidden>{CATEGORY_GLYPH[category]}</span>
      {pick(CATEGORY_LABEL[category], lang)}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Ratings and statuses                                              */
/* ---------------------------------------------------------------- */

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-gold" aria-hidden>
        ★
      </span>
      <span className="font-semibold">{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className="text-muted">({count})</span>
      )}
    </span>
  );
}

const BOOKING_STYLE: Record<BookingStatus, string> = {
  pending: "bg-gold-soft text-gold",
  accepted: "bg-palm-soft text-palm",
  rejected: "bg-[#fdf0f0] text-[#a33a3a]",
  expired: "bg-sand-deep text-muted",
  cancelled: "bg-sand-deep text-muted",
  completed: "bg-palm-soft text-palm",
};

const BOOKING_KEY = {
  pending: "statusPending",
  accepted: "statusAccepted",
  rejected: "statusRejected",
  expired: "statusExpired",
  cancelled: "statusCancelled",
  completed: "statusCompleted",
} as const;

export function BookingStatusChip({
  status,
  lang,
}: {
  status: BookingStatus;
  lang: Lang;
}) {
  return (
    <span className={`chip ${BOOKING_STYLE[status]}`}>
      {t(BOOKING_KEY[status], lang)}
    </span>
  );
}

const EXP_STYLE: Record<ExperienceStatus, string> = {
  published: "bg-palm-soft text-palm",
  draft: "bg-sand-deep text-muted",
  blocked: "bg-[#fdf0f0] text-[#a33a3a]",
  in_review: "bg-gold-soft text-gold",
  paused: "bg-sand-deep text-muted",
};

const EXP_KEY = {
  published: "expStatusPublished",
  draft: "expStatusDraft",
  blocked: "expStatusBlocked",
  in_review: "expStatusInReview",
  paused: "expStatusPaused",
} as const;

export function ExperienceStatusChip({
  status,
  lang,
}: {
  status: ExperienceStatus;
  lang: Lang;
}) {
  return (
    <span className={`chip ${EXP_STYLE[status]}`}>{t(EXP_KEY[status], lang)}</span>
  );
}

/* ---------------------------------------------------------------- */

export function Avatar({
  initials,
  size = 44,
  tone = "palm",
}: {
  initials: string;
  size?: number;
  tone?: "palm" | "clay" | "rose";
}) {
  const bg = { palm: "bg-palm", clay: "bg-clay", rose: "bg-rose" }[tone];
  return (
    <span
      className={`grid place-items-center rounded-full text-white font-bold shrink-0 ${bg}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      dir="ltr"
    >
      {initials}
    </span>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-extrabold tracking-tight mb-4">{children}</h2>
  );
}

export function Empty({ text }: { text: string }) {
  return (
    <div className="card p-10 text-center text-muted text-sm">{text}</div>
  );
}

export function biText(bi: Bi, lang: Lang) {
  return pick(bi, lang);
}
