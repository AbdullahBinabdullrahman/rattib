"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/store";
import { CREDENTIAL_LABEL, pick, t } from "@/lib/i18n";
import {
  durationLabel,
  formatDate,
  formatTime,
  isToday,
  isTomorrow,
  money,
} from "@/lib/format";
import { canBrowserBook, isLocked } from "@/lib/eligibility";
import {
  AudienceBadge,
  Avatar,
  CategoryArt,
  CategoryChip,
  Stars,
} from "@/components/ui";

export default function ExperienceDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    lang,
    experienceById,
    expertById,
    slotsFor,
    credentials,
    mounted,
    viewerGender,
    persona,
  } = useDemo();

  const [slotId, setSlotId] = useState<string | null>(null);

  const exp = experienceById(params.id);
  if (!exp) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-muted">
        Not found ·{" "}
        <Link href="/explore" className="text-palm font-semibold">
          {t("navExplore", lang)}
        </Link>
      </div>
    );
  }

  const expert = expertById(exp.expertId)!;
  const slots = slotsFor(exp.id);
  const eligible =
    persona === "expert" || canBrowserBook(exp.audiencePolicy, viewerGender);
  const expertCreds = credentials.filter(
    (c) => c.expertId === expert.id && c.state === "verified",
  );

  const dayLabel = (iso: string) => {
    if (isToday(iso)) return t("today", lang);
    if (isTomorrow(iso)) return t("tomorrow", lang);
    return formatDate(iso, lang);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/explore"
        className="text-sm text-muted hover:text-fg font-semibold"
      >
        ← {t("backTo", lang)} {t("navExplore", lang)}
      </Link>

      {/* Header art */}
      <div className="card overflow-hidden mt-4">
        <div className="relative">
          <CategoryArt category={exp.category} className="h-52 md:h-64" glyphSize="text-7xl" />
          <div className="absolute top-4 start-4 flex gap-2">
            <AudienceBadge policy={exp.audiencePolicy} lang={lang} size="md" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-6 items-start">
        {/* Main column */}
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <CategoryChip category={exp.category} lang={lang} />
            <span className="chip bg-panel-2 text-muted">
              {pick(exp.district, lang)}
            </span>
            <span className="chip bg-panel-2 text-muted">
              {exp.bookingMode === "instant"
                ? t("instantBook", lang)
                : t("requestBook", lang)}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
            {pick(exp.title, lang)}
          </h1>
          <p className="text-muted mt-2 text-lg">{pick(exp.tagline, lang)}</p>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <Stars rating={expert.rating} count={expert.reviewCount} />
            <span className="text-muted">
              {durationLabel(exp.durationMin, lang)}
            </span>
            <span className="text-muted">
              {t("upTo", lang)} {exp.seatsMax} {t("seats", lang)}
            </span>
          </div>

          <Section title={t("about", lang)}>
            <p className="leading-relaxed text-[0.95rem]">
              {pick(exp.description, lang)}
            </p>
          </Section>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="font-bold mb-3">{t("whatsIncluded", lang)}</h3>
              <ul className="space-y-2 text-sm">
                {exp.toolsProvided.map((tool, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-palm font-bold">✓</span>
                    {pick(tool, lang)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">{t("whatToBring", lang)}</h3>
              {exp.toolsRequired.length === 0 ? (
                <p className="text-sm text-muted">{t("bringNothing", lang)}</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {exp.toolsRequired.map((tool, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-clay font-bold">•</span>
                      {pick(tool, lang)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Expert profile */}
          <Section title={t("hostedBy", lang)}>
            <div className="card p-5">
              <div className="flex items-start gap-4">
                <Avatar
                  initials={expert.initials}
                  size={56}
                  tone={expert.gender === "female" ? "rose" : "palm"}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg">
                      {pick(expert.name, lang)}
                    </h3>
                    {expert.identityVerified && (
                      <span className="chip bg-palm-soft text-palm">
                        ✓ {t("identityVerified", lang)}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-muted mt-1 flex-wrap">
                    <span>
                      {expert.sessionsHosted} {t("sessionsHosted", lang)}
                    </span>
                    <span>
                      {t("since", lang)} {expert.hostingSince}
                    </span>
                    <span>
                      {t("respondsIn", lang)} {expert.responseMinutes}{" "}
                      {t("minutes", lang)}
                    </span>
                  </div>
                  <p className="text-sm mt-3 leading-relaxed">
                    {pick(expert.bio, lang)}
                  </p>

                  {expert.id === "e1" && expertCreds.length > 0 && (
                    <div className="mt-4">
                      <span className="label !mb-2">
                        {t("credentialsHeld", lang)}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {expertCreds.map((c) => (
                          <span
                            key={c.id}
                            className="chip bg-palm-soft text-palm"
                          >
                            ✓ {pick(CREDENTIAL_LABEL[c.type], lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Section>

          <Section title={t("policyTitle", lang)}>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                • {t("slaLine", lang, { h: exp.responseSlaHours })}
              </li>
              <li>• {t("cancelLine", lang, { h: exp.freeCancelHours })}</li>
              <li>• {t("minAgeLine", lang, { n: exp.minAge })}</li>
              {isLocked(exp.audiencePolicy) && (
                <li className="text-rose font-semibold">
                  • {t("lockedNotice", lang)}
                </li>
              )}
            </ul>
          </Section>
        </div>

        {/* Booking rail */}
        <aside className="lg:sticky lg:top-24">
          <div className="card p-5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold">
                {money(exp.pricePerSeat, lang)}
              </span>
              <span className="text-sm text-muted">{t("perSeat", lang)}</span>
            </div>

            {!eligible ? (
              <div className="mt-4 rounded-xl bg-rose-soft text-rose p-4 text-sm">
                <p className="font-bold">{t("notEligible", lang)}</p>
                <p className="mt-1 opacity-80">{t("switchPersona", lang)}</p>
              </div>
            ) : (
              <>
                <div className="mt-5">
                  <span className="label">{t("pickSlot", lang)}</span>
                  {!mounted ? (
                    <div className="h-24 rounded-xl bg-panel-2 animate-pulse" />
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pe-1">
                      {slots.map((s) => {
                        const left = s.seatsTotal - s.seatsTaken;
                        const full = left <= 0;
                        const active = s.id === slotId;
                        return (
                          <button
                            key={s.id}
                            disabled={full}
                            onClick={() => setSlotId(s.id)}
                            className={`w-full text-start rounded-xl border p-3 transition-colors ${
                              active
                                ? "border-palm bg-palm-soft"
                                : "border-line hover:border-brass"
                            } ${full ? "opacity-45 cursor-not-allowed" : ""}`}
                          >
                            <div className="font-semibold text-sm leading-snug">
                              {dayLabel(s.startsAt)}
                              <span className="text-muted font-normal">
                                {" · "}
                              </span>
                              {formatTime(s.startsAt, lang)}
                            </div>
                            <div
                              className={`text-xs font-semibold mt-0.5 ${
                                full
                                  ? "text-muted"
                                  : left <= 2
                                    ? "text-clay"
                                    : "text-muted"
                              }`}
                            >
                              {full
                                ? t("soldOut", lang)
                                : `${left} ${t("seatsLeft", lang)}`}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  disabled={!slotId}
                  onClick={() => router.push(`/book/${slotId}`)}
                  className="btn btn-primary w-full mt-4 !py-3"
                >
                  {t("reserve", lang)}
                </button>

                <p className="text-[11px] text-muted mt-3 leading-relaxed">
                  {t("heldNote", lang)}
                </p>
              </>
            )}
          </div>
        </aside>
      </div>
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
    <div className="mt-8 pt-8 border-t border-line">
      <h2 className="font-bold text-lg mb-3">{title}</h2>
      {children}
    </div>
  );
}
