"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useDemo } from "@/lib/store";
import {
  AUDIENCE_LABEL,
  CATEGORY_LABEL,
  pick,
  t,
} from "@/lib/i18n";
import type { AudiencePolicy, CategoryId } from "@/lib/types";
import { canBrowserBook } from "@/lib/eligibility";
import { isToday, money, durationLabel, formatDateTime } from "@/lib/format";
import RiyadhMap from "@/components/RiyadhMap";
import ExperienceCard from "@/components/ExperienceCard";
import { AudienceBadge, CategoryArt, Stars } from "@/components/ui";

const CATEGORIES: CategoryId[] = [
  "pottery",
  "bakery",
  "sadu",
  "coffee",
  "calligraphy",
  "perfume",
  "poetry",
  "khoos",
];

const AUDIENCES: AudiencePolicy[] = [
  "women_only",
  "families_only",
  "men_only",
  "mixed",
];

export default function Explore() {
  const {
    lang,
    experiences,
    slots,
    mounted,
    viewerGender,
    persona,
    expertById,
  } = useDemo();

  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [audience, setAudience] = useState<AudiencePolicy | "all">("all");
  const [maxPrice, setMaxPrice] = useState(500);
  const [todayOnly, setTodayOnly] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const nextSlotFor = (id: string) =>
    slots.filter((s) => s.experienceId === id && s.seatsTaken < s.seatsTotal)[0];

  const filtered = useMemo(() => {
    return experiences.filter((e) => {
      if (e.status !== "published") return false;
      // A customer never sees an experience they could not sit in.
      if (
        persona === "customer" &&
        !canBrowserBook(e.audiencePolicy, viewerGender)
      )
        return false;
      if (category !== "all" && e.category !== category) return false;
      if (audience !== "all" && e.audiencePolicy !== audience) return false;
      if (e.pricePerSeat > maxPrice) return false;
      if (todayOnly) {
        if (!mounted) return false;
        const s = nextSlotFor(e.id);
        if (!s || !isToday(s.startsAt)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    experiences,
    slots,
    category,
    audience,
    maxPrice,
    todayOnly,
    mounted,
    viewerGender,
    persona,
  ]);

  const selectedExp = filtered.find((e) => e.id === selected) ?? null;
  const selectedExpert = selectedExp ? expertById(selectedExp.expertId) : null;
  const selectedSlot = selectedExp ? nextSlotFor(selectedExp.id) : undefined;

  const reset = () => {
    setCategory("all");
    setAudience("all");
    setMaxPrice(500);
    setTodayOnly(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {t("exploreTitle", lang)}
          </h1>
          <p className="text-sm text-muted mt-1">
            {filtered.length} {t("results", lang)} · {t("mapHint", lang)}
          </p>
        </div>
        <button onClick={reset} className="btn btn-ghost !py-1.5 !text-xs">
          {t("resetFilters", lang)}
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <div>
          <span className="label">{t("category", lang)}</span>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              active={category === "all"}
              onClick={() => setCategory("all")}
              label={t("allCategories", lang)}
            />
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
                label={pick(CATEGORY_LABEL[c], lang)}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="label">{t("audience", lang)}</span>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill
              active={audience === "all"}
              onClick={() => setAudience("all")}
              label={t("allAudiences", lang)}
            />
            {AUDIENCES.map((a) => (
              <FilterPill
                key={a}
                active={audience === a}
                onClick={() => setAudience(a)}
                label={pick(AUDIENCE_LABEL[a], lang)}
                tone={a === "women_only" ? "rose" : "palm"}
              />
            ))}
          </div>
        </div>

        <div className="min-w-[170px]">
          <span className="label">
            {t("maxPrice", lang)} — {money(maxPrice, lang)}
          </span>
          <input
            type="range"
            min={100}
            max={500}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#14614C]"
          />
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer pb-1">
          <input
            type="checkbox"
            checked={todayOnly}
            onChange={(e) => setTodayOnly(e.target.checked)}
            className="w-4 h-4 accent-[#BD5F39]"
          />
          {t("todayOnly", lang)}
        </label>
      </div>

      {/* Map */}
      <div className="card overflow-hidden mb-6 relative">
        <div className="aspect-[4/3] sm:aspect-[16/9] bg-sand-deep">
          <RiyadhMap
            experiences={filtered}
            selectedId={selected}
            onSelect={setSelected}
            lang={lang}
          />
        </div>

        {/* Pin preview */}
        {selectedExp && (
          <div className="absolute bottom-4 start-4 end-4 sm:end-auto sm:w-[380px]">
            <div className="card shadow-xl overflow-hidden flex">
              <CategoryArt
                category={selectedExp.category}
                className="w-24 shrink-0"
                glyphSize="text-3xl"
              />
              <div className="p-3 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm leading-snug truncate">
                    {pick(selectedExp.title, lang)}
                  </h3>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-muted hover:text-ink text-lg leading-none shrink-0"
                    aria-label="close"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <AudienceBadge
                    policy={selectedExp.audiencePolicy}
                    lang={lang}
                  />
                  {selectedExpert && <Stars rating={selectedExpert.rating} />}
                </div>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className="text-xs text-muted">
                    {money(selectedExp.pricePerSeat, lang)} ·{" "}
                    {durationLabel(selectedExp.durationMin, lang)}
                  </span>
                  <Link
                    href={`/experience/${selectedExp.id}`}
                    className="btn btn-primary !py-1 !px-3 !text-xs"
                  >
                    {t("reserve", lang)}
                  </Link>
                </div>
                {mounted && selectedSlot && (
                  <p className="text-[11px] text-palm font-semibold mt-1.5">
                    {formatDateTime(selectedSlot.startsAt, lang)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center text-muted text-sm">
          {t("noResults", lang)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((e) => (
            <ExperienceCard
              key={e.id}
              experience={e}
              nextSlot={nextSlotFor(e.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  tone = "palm",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  tone?: "palm" | "rose";
}) {
  const activeClass =
    tone === "rose" ? "bg-rose text-white" : "bg-palm text-white";
  return (
    <button
      onClick={onClick}
      className={`chip border transition-colors ${
        active
          ? `${activeClass} border-transparent`
          : "bg-surface text-muted border-line hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
