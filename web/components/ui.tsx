"use client";

import type { AudiencePolicy, Bi, BookingStatus, CategoryId, ExperienceStatus, Lang } from "@/lib/types";
import { AUDIENCE_LABEL, CATEGORY_LABEL, pick, t } from "@/lib/i18n";
import CategoryIcon from "./CategoryIcon";

/* ---------------------------------------------------------------- */
/* Audience policy badge — the product's signature primitive         */
/* ---------------------------------------------------------------- */

const AUDIENCE_STYLE: Record<AudiencePolicy, string> = {
  women_only: "bg-rose-soft text-rose",
  men_only: "bg-palm-soft text-palm",
  families_only: "bg-door-soft text-brass",
  mixed: "bg-panel-2 text-muted",
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
/* Category plates                                                   */
/* ---------------------------------------------------------------- */

/**
 * Flat earth tints rather than gradients: each craft gets a colour taken
 * from its own material — fired clay, proofed dough, madder-dyed wool.
 */
const CATEGORY_TINT: Record<CategoryId, [string, string]> = {
  pottery: ["#c9a48c", "#5f3419"],
  bakery: ["#d8c199", "#664c14"],
  sadu: ["#c79a99", "#71241f"],
  coffee: ["#bda88e", "#4f3219"],
  calligraphy: ["#a8b2c1", "#28374b"],
  perfume: ["#bda9c0", "#43294b"],
  poetry: ["#a4bdb4", "#1e4842"],
  khoos: ["#b5c29a", "#354920"],
  tours: ["#a8bcc7", "#22414d"],
};

export function CategoryArt({
  category,
  className = "",
  glyphSize,
}: {
  category: CategoryId;
  className?: string;
  /** Retained for call-site compatibility; icon size is derived instead. */
  glyphSize?: string;
}) {
  const [bg, ink] = CATEGORY_TINT[category];
  const big = glyphSize?.includes("7xl") || glyphSize?.includes("5xl");
  return (
    <div
      className={`relative grid place-items-center ${className}`}
      style={{ background: bg, color: ink }}
    >
      <CategoryIcon category={category} size={big ? 64 : 34} />
      {/* Najdi crenellation along the base, tinted to the plate */}
      <span
        className="absolute inset-x-0 bottom-0 h-[7px] opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='7' viewBox='0 0 14 7'><path d='M0 7 L7 0 L14 7 Z' fill='${encodeURIComponent(
            ink,
          )}'/></svg>")`,
          backgroundRepeat: "repeat-x",
        }}
      />
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
    <span className="chip bg-panel-2 text-muted">
      <CategoryIcon category={category} size={14} />
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
      <span className="text-brass" aria-hidden>
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
  pending: "bg-door-soft text-brass",
  accepted: "bg-palm-soft text-palm",
  rejected: "bg-danger-soft text-danger",
  expired: "bg-panel-2 text-muted",
  cancelled: "bg-panel-2 text-muted",
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
  draft: "bg-panel-2 text-muted",
  blocked: "bg-danger-soft text-danger",
  in_review: "bg-door-soft text-brass",
  paused: "bg-panel-2 text-muted",
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
      className={`grid place-items-center rounded-[3px] text-panel font-bold shrink-0 ${bg}`}
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
