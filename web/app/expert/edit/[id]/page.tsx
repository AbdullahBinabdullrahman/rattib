"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/store";
import {
  AUDIENCE_LABEL,
  CATEGORY_LABEL,
  CREDENTIAL_LABEL,
  pick,
  t,
} from "@/lib/i18n";
import { CATEGORY_RULES, checkHost } from "@/lib/eligibility";
import { DEMO_EXPERT_ID } from "@/lib/seed";
import type {
  AudiencePolicy,
  Bi,
  CategoryId,
  Experience,
  Lang,
} from "@/lib/types";
import { AudienceBadge, CategoryArt, ExperienceStatusChip } from "@/components/ui";
import LocationPicker from "@/components/LocationPicker";

const CATEGORIES: CategoryId[] = [
  "pottery",
  "bakery",
  "sadu",
  "coffee",
  "calligraphy",
  "perfume",
  "poetry",
  "khoos",
  "tours",
];

const AUDIENCES: AudiencePolicy[] = [
  "mixed",
  "women_only",
  "men_only",
  "families_only",
  "private_buyout",
];

/**
 * Editing an existing listing.
 *
 * A single form rather than the publish wizard: the wizard walks a first-time
 * host through decisions in order, but editing is a return visit to change one
 * thing, so everything is on one page and saves immediately.
 */
export default function EditExperience() {
  const params = useParams<{ id: string }>();
  const { lang, experienceById, updateExperience, credentials } = useDemo();

  const exp = experienceById(params.id);
  const [flash, setFlash] = useState(false);

  if (!exp) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">
        Not found ·{" "}
        <Link href="/expert" className="text-brass font-semibold">
          {t("backToDash", lang)}
        </Link>
      </div>
    );
  }

  const mine = credentials.filter((c) => c.expertId === DEMO_EXPERT_ID);
  const gate = checkHost(exp.category, mine);
  const required = CATEGORY_RULES[exp.category] ?? [];

  const set = (patch: Partial<Experience>) => {
    updateExperience(exp.id, patch);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1200);
  };

  const setBi = (field: "title" | "tagline" | "description" | "district", l: Lang, v: string) =>
    set({ [field]: { ...(exp[field] as Bi), [l]: v } } as Partial<Experience>);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/expert"
        className="text-sm text-muted hover:text-fg font-semibold"
      >
        ← {t("backTo", lang)} {t("backToDash", lang)}
      </Link>

      <div className="flex items-start justify-between gap-4 flex-wrap mt-4 mb-2">
        <div>
          <h1 className="text-3xl font-extrabold">{t("editTitle", lang)}</h1>
          <p className="text-sm text-muted mt-1">{t("editSub", lang)}</p>
        </div>
        <span
          className={`chip bg-palm-soft text-palm transition-opacity duration-300 ${
            flash ? "opacity-100" : "opacity-0"
          }`}
        >
          ✓ {t("saved", lang)}
        </span>
      </div>

      {/* Preview */}
      <div className="card overflow-hidden flex mb-6">
        <CategoryArt
          category={exp.category}
          className="w-24 shrink-0"
          glyphSize="text-3xl"
        />
        <div className="p-4 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold">{pick(exp.title, lang)}</h2>
            <AudienceBadge policy={exp.audiencePolicy} lang={lang} />
            <ExperienceStatusChip status={exp.status} lang={lang} />
          </div>
          <p className="text-sm text-muted mt-1">
            {pick(CATEGORY_LABEL[exp.category], lang)} ·{" "}
            {pick(exp.district, lang)}
          </p>
        </div>
      </div>

      {/* Content */}
      <Section title={t("contentSection", lang)}>
        <BiField
          label={t("titleField", lang)}
          value={exp.title}
          lang={lang}
          onChange={(l, v) => setBi("title", l, v)}
        />
        <BiField
          label={t("taglineField", lang)}
          value={exp.tagline}
          lang={lang}
          onChange={(l, v) => setBi("tagline", l, v)}
        />
        <BiField
          label={t("descField", lang)}
          value={exp.description}
          lang={lang}
          multiline
          onChange={(l, v) => setBi("description", l, v)}
        />
        <div>
          <span className="label">{t("category", lang)}</span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => set({ category: c })}
                className={`chip border transition-colors ${
                  exp.category === c
                    ? "bg-brass text-[#16120a] border-transparent"
                    : "bg-panel text-muted border-line hover:text-fg"
                }`}
              >
                {pick(CATEGORY_LABEL[c], lang)}
              </button>
            ))}
          </div>
          {required.length > 0 && (
            <p className="text-xs text-muted mt-2">
              {pick(CATEGORY_LABEL[exp.category], lang)} →{" "}
              {required.map((c) => pick(CREDENTIAL_LABEL[c], lang)).join(" + ")}
            </p>
          )}
        </div>
      </Section>

      <Section title={t("locationSection", lang)}>
        <LocationPicker
          value={{ lat: exp.lat, lon: exp.lon, district: exp.district }}
          onChange={(v) =>
            set({ lat: v.lat, lon: v.lon, district: v.district })
          }
          lang={lang}
        />
      </Section>

      {/* Pricing and scheduling */}
      <Section title={t("pricingSection", lang)}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Num
            label={t("priceField", lang)}
            value={exp.pricePerSeat}
            min={50}
            max={2000}
            step={10}
            onChange={(v) => set({ pricePerSeat: v })}
          />
          <Num
            label={t("durationField", lang)}
            value={exp.durationMin}
            min={30}
            max={480}
            step={15}
            onChange={(v) => set({ durationMin: v })}
          />
          <Num
            label={t("seatsField", lang)}
            value={exp.seatsMax}
            min={2}
            max={30}
            step={1}
            onChange={(v) => set({ seatsMax: v })}
          />
          <Num
            label={t("slaField", lang)}
            value={exp.responseSlaHours}
            min={1}
            max={48}
            step={1}
            onChange={(v) => set({ responseSlaHours: v })}
          />
          <Num
            label={t("cancelHoursField", lang)}
            value={exp.freeCancelHours}
            min={0}
            max={168}
            step={1}
            onChange={(v) => set({ freeCancelHours: v })}
          />
          <Num
            label={t("minAgeField", lang)}
            value={exp.minAge}
            min={0}
            max={30}
            step={1}
            onChange={(v) => set({ minAge: v })}
          />
        </div>

        <div>
          <span className="label">{t("bookingModeField", lang)}</span>
          <div className="flex rounded-xl border border-line overflow-hidden w-fit">
            {(["instant", "request"] as const).map((m) => (
              <button
                key={m}
                onClick={() => set({ bookingMode: m })}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  exp.bookingMode === m
                    ? "bg-brass text-[#16120a]"
                    : "bg-panel text-muted hover:text-fg"
                }`}
              >
                {t(m === "instant" ? "instantBook" : "requestBook", lang)}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Audience */}
      <Section title={t("policySection", lang)}>
        <div className="space-y-2">
          {AUDIENCES.map((a) => (
            <button
              key={a}
              onClick={() => set({ audiencePolicy: a })}
              className={`w-full text-start rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                exp.audiencePolicy === a
                  ? "border-brass bg-panel-2"
                  : "border-line hover:border-brass"
              }`}
            >
              <AudienceBadge policy={a} lang={lang} size="md" />
              <span className="text-sm text-muted">
                {pick(AUDIENCE_LABEL[a], lang)}
              </span>
            </button>
          ))}
        </div>
        {(exp.audiencePolicy === "women_only" ||
          exp.audiencePolicy === "men_only" ||
          exp.audiencePolicy === "families_only") && (
          <p className="text-xs text-rose font-semibold leading-relaxed">
            {t("lockedNotice", lang)}
          </p>
        )}
      </Section>

      {/* Status */}
      <Section title={t("statusSection", lang)}>
        <div className="flex items-center gap-3 flex-wrap">
          <ExperienceStatusChip status={exp.status} lang={lang} />
          {exp.status === "published" ? (
            <button
              onClick={() => set({ status: "paused" })}
              className="btn btn-ghost !py-1.5 !text-xs"
            >
              {t("pauseAction", lang)}
            </button>
          ) : (
            <button
              onClick={() => set({ status: "published" })}
              disabled={!gate.ok}
              className="btn btn-primary !py-1.5 !text-xs"
            >
              {t("publishAction", lang)}
            </button>
          )}
        </div>
        <p className="text-xs text-muted leading-relaxed">
          {t("unpublishNote", lang)}
        </p>
        {!gate.ok && exp.status !== "published" && (
          <p className="text-xs text-danger font-semibold leading-relaxed">
            {t("cannotPublish", lang)}{" "}
            <Link href="/expert/credentials" className="underline">
              {t("myCredentials", lang)}
            </Link>
          </p>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6 mb-4">
      <h2 className="font-extrabold mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Both languages side by side, so nothing is authored in only one. */
function BiField({
  label,
  value,
  lang,
  multiline,
  onChange,
}: {
  label: string;
  value: Bi;
  lang: Lang;
  multiline?: boolean;
  onChange: (l: Lang, v: string) => void;
}) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div>
      <span className="label">{label}</span>
      <div className="grid sm:grid-cols-2 gap-3">
        {(["ar", "en"] as Lang[]).map((l) => (
          <div key={l}>
            <Field
              className={`field ${multiline ? "min-h-24" : ""}`}
              dir={l === "ar" ? "rtl" : "ltr"}
              value={value[l]}
              onChange={(
                e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) => onChange(l, e.target.value)}
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

function Num({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <input
        type="number"
        className="field tnum"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
