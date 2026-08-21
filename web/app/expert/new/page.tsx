"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import type { AudiencePolicy, CategoryId, Experience } from "@/lib/types";
import { AudienceBadge, CategoryArt } from "@/components/ui";
import LocationPicker, { type LocationValue } from "@/components/LocationPicker";
import { money } from "@/lib/format";

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

const STEPS = ["basics", "logistics", "audienceStep", "reviewStep"] as const;

export default function NewExperience() {
  const router = useRouter();
  const { lang, credentials, publishExperience } = useDemo();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<CategoryId>("pottery");
  const [location, setLocation] = useState<LocationValue>({
    lat: 24.734,
    lon: 46.5735,
    district: { ar: "الدرعية", en: "Diriyah" },
  });
  const [price, setPrice] = useState(250);
  const [duration, setDuration] = useState(120);
  const [seats, setSeats] = useState(8);
  const [sla, setSla] = useState(6);
  const [audience, setAudience] = useState<AudiencePolicy>("mixed");
  const [done, setDone] = useState(false);

  const mine = credentials.filter((c) => c.expertId === DEMO_EXPERT_ID);
  const gate = checkHost(category, mine);
  const required = CATEGORY_RULES[category] ?? [];

  const submit = () => {
    const exp: Experience = {
      id: `x${Math.random().toString(36).slice(2, 7)}`,
      expertId: DEMO_EXPERT_ID,
      title: { ar: title || "تجربة جديدة", en: title || "New experience" },
      tagline: { ar: "", en: "" },
      description: { ar: desc, en: desc },
      category,
      district: location.district,
      lat: location.lat,
      lon: location.lon,
      durationMin: duration,
      seatsMin: 2,
      seatsMax: seats,
      pricePerSeat: price,
      audiencePolicy: audience,
      minAge: 12,
      toolsProvided: [],
      toolsRequired: [],
      responseSlaHours: sla,
      freeCancelHours: 24,
      bookingMode: "request",
      status: "in_review",
    };
    publishExperience(exp);
    setDone(true);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-extrabold">{t("submitted", lang)}</h1>
        <p className="text-muted mt-2">{t("publishReady", lang)}</p>
        <button
          onClick={() => router.push("/expert")}
          className="btn btn-primary mt-6"
        >
          {t("expertDash", lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/expert"
        className="text-sm text-muted hover:text-fg font-semibold"
      >
        ← {t("backTo", lang)} {t("expertDash", lang)}
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight mt-4">
        {t("publishTitle", lang)}
      </h1>

      {/* Progress */}
      <div className="flex items-center gap-2 mt-5 mb-7">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? "bg-palm" : "bg-line"
              }`}
            />
            <p
              className={`text-[11px] mt-1.5 font-semibold ${
                i <= step ? "text-palm" : "text-muted"
              }`}
            >
              {t(s, lang)}
            </p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <span className="label">{t("titleField", lang)}</span>
              <input
                className="field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  lang === "ar" ? "الفخار على الدولاب" : "Pottery on the wheel"
                }
              />
            </div>
            <div>
              <span className="label">{t("descField", lang)}</span>
              <textarea
                className="field min-h-28"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div>
              <span className="label">{t("category", lang)}</span>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`chip border ${
                      category === c
                        ? "bg-palm text-white border-transparent"
                        : "bg-panel text-muted border-line hover:border-door"
                    }`}
                  >
                    {pick(CATEGORY_LABEL[c], lang)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label">{t("locationSection", lang)}</span>
              <LocationPicker
                value={location}
                onChange={setLocation}
                lang={lang}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <NumField
              label={t("priceField", lang)}
              value={price}
              onChange={setPrice}
              min={50}
              max={2000}
              step={10}
            />
            <NumField
              label={t("durationField", lang)}
              value={duration}
              onChange={setDuration}
              min={30}
              max={480}
              step={15}
            />
            <NumField
              label={t("seatsField", lang)}
              value={seats}
              onChange={setSeats}
              min={2}
              max={30}
              step={1}
            />
            <NumField
              label={t("slaField", lang)}
              value={sla}
              onChange={setSla}
              min={1}
              max={48}
              step={1}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <span className="label">{t("audience", lang)}</span>
            <div className="space-y-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`w-full text-start rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                    audience === a
                      ? "border-palm bg-palm-soft"
                      : "border-line hover:border-door"
                  }`}
                >
                  <AudienceBadge policy={a} lang={lang} size="md" />
                  <span className="text-sm text-muted">
                    {pick(AUDIENCE_LABEL[a], lang)}
                  </span>
                </button>
              ))}
            </div>
            {(audience === "women_only" || audience === "men_only") && (
              <p className="text-xs text-rose font-semibold mt-4 leading-relaxed">
                {t("lockedNotice", lang)}
              </p>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex gap-4 items-start">
              <CategoryArt
                category={category}
                className="w-24 h-24 rounded-xl shrink-0"
                glyphSize="text-3xl"
              />
              <div className="min-w-0">
                <h2 className="font-bold text-lg">
                  {title || (lang === "ar" ? "بدون عنوان" : "Untitled")}
                </h2>
                <p className="text-sm text-muted mt-1">
                  {pick(CATEGORY_LABEL[category], lang)} ·{" "}
                  {money(price, lang)} · {duration} {t("minutes", lang)} ·{" "}
                  {seats} {t("seats", lang)}
                </p>
                <p className="text-xs text-muted mt-1">
                  {pick(location.district, lang)} ·{" "}
                  <span className="tnum" dir="ltr">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </span>
                </p>
                <div className="mt-2">
                  <AudienceBadge policy={audience} lang={lang} />
                </div>
              </div>
            </div>

            {/* The publish-time credential gate */}
            <div className="mt-6 pt-6 border-t border-line">
              <span className="label">{t("credentialsHeld", lang)}</span>

              {gate.ok ? (
                <div className="rounded-xl bg-palm-soft text-palm p-4 text-sm font-semibold">
                  ✓ {t("publishReady", lang)}
                </div>
              ) : (
                <div className="rounded-xl bg-danger-soft text-danger p-4 text-sm">
                  <p className="font-extrabold mb-1">
                    {t("publishBlocked", lang)}
                  </p>
                  <p>
                    {t("publishBlockedBody", lang, {
                      c: pick(CATEGORY_LABEL[category], lang),
                      r: (gate.hasIdentity
                        ? gate.missing
                        : ["freelance_doc" as const]
                      )
                        .map((c) => pick(CREDENTIAL_LABEL[c], lang))
                        .join("، "),
                    })}
                  </p>
                  <Link
                    href="/expert/credentials"
                    className="btn btn-ghost !py-1 !px-3 !text-xs mt-3"
                  >
                    {t("addCredential", lang)} →
                  </Link>
                </div>
              )}

              {required.length > 0 && (
                <p className="text-xs text-muted mt-3">
                  {pick(CATEGORY_LABEL[category], lang)} →{" "}
                  {required
                    .map((c) => pick(CREDENTIAL_LABEL[c], lang))
                    .join(" + ")}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Wizard controls */}
        <div className="flex items-center justify-between gap-3 mt-7 pt-5 border-t border-line">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-ghost !text-xs"
          >
            {t("back", lang)}
          </button>
          <span className="text-xs text-muted">
            {t("step", lang)} {step + 1} {t("of", lang)} {STEPS.length}
          </span>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn btn-primary !text-xs"
            >
              {t("next", lang)}
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!gate.ok}
              className="btn btn-primary !text-xs"
            >
              {t("submitForReview", lang)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div>
      <span className="label">{label}</span>
      <input
        type="number"
        className="field"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
