"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { CREDENTIAL_LABEL, pick, t } from "@/lib/i18n";
import { DEMO_EXPERT_ID } from "@/lib/seed";
import { countdown, formatDateLong, formatTime, money } from "@/lib/format";
import {
  AudienceBadge,
  Avatar,
  CategoryArt,
  Empty,
  ExperienceStatusChip,
  SectionTitle,
} from "@/components/ui";

export default function ExpertDashboard() {
  const {
    lang,
    experiences,
    bookings,
    experienceById,
    slotById,
    expertById,
    respondToBooking,
    now,
    mounted,
  } = useDemo();

  const expert = expertById(DEMO_EXPERT_ID)!;
  const mine = experiences.filter((e) => e.expertId === DEMO_EXPERT_ID);
  const mineIds = new Set(mine.map((e) => e.id));

  const requests = bookings.filter(
    (b) => b.status === "pending" && mineIds.has(b.experienceId),
  );

  const accepted = bookings.filter(
    (b) => b.status === "accepted" && mineIds.has(b.experienceId),
  );
  const pendingEarnings = accepted.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <Avatar initials={expert.initials} size={52} tone="rose" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight">
            {t("expertDash", lang)}
          </h1>
          <p className="text-sm text-muted">
            {pick(expert.name, lang)} · {pick(expert.district, lang)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/expert/credentials" className="btn btn-ghost !text-xs">
            {t("myCredentials", lang)}
          </Link>
          <Link href="/expert/new" className="btn btn-primary !text-xs">
            + {t("newExperience", lang)}
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Stat
          label={t("pendingRequests", lang)}
          value={mounted ? String(requests.length) : "—"}
          tone="brass"
        />
        <Stat
          label={t("myExperiences", lang)}
          value={String(mine.filter((e) => e.status === "published").length)}
        />
        <Stat
          label={t("sessionsHosted", lang)}
          value={String(expert.sessionsHosted)}
        />
        <Stat
          label={t("earnings", lang)}
          value={mounted ? money(pendingEarnings, lang) : "—"}
          tone="palm"
        />
      </div>

      {/* Incoming requests — accept / reject against the SLA clock */}
      <SectionTitle>{t("pendingRequests", lang)}</SectionTitle>
      {!mounted ? null : requests.length === 0 ? (
        <Empty text={t("noRequests", lang)} />
      ) : (
        <div className="space-y-3">
          {requests.map((b) => {
            const exp = experienceById(b.experienceId)!;
            const slot = slotById(b.slotId);
            const overdue = new Date(b.respondBy) <= now;
            const women = b.guests.filter((g) => g.gender === "female").length;
            const men = b.guests.length - women;

            return (
              <div key={b.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold">{pick(exp.title, lang)}</h3>
                      <AudienceBadge
                        policy={exp.audiencePolicy}
                        lang={lang}
                      />
                    </div>
                    {slot && (
                      <p className="text-sm text-muted mt-1">
                        {formatDateLong(slot.startsAt, lang)} ·{" "}
                        {formatTime(slot.startsAt, lang)}
                      </p>
                    )}
                    <p className="text-sm text-muted">
                      {t("partyOf", lang, { n: b.seats })} ·{" "}
                      {/* The host sees composition, never guest identities. */}
                      {women > 0 && `${women} ♀`} {men > 0 && `${men} ♂`} ·{" "}
                      {money(b.amount, lang)}
                    </p>
                  </div>

                  <div className="text-end">
                    <p className="text-[11px] text-muted font-semibold">
                      {t("timeLeft", lang)}
                    </p>
                    <p
                      className={`font-extrabold ${
                        overdue ? "text-danger" : "text-brass"
                      }`}
                      dir="ltr"
                    >
                      {overdue
                        ? t("slaBreached", lang)
                        : countdown(b.respondBy, lang, now)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => respondToBooking(b.id, true)}
                    className="btn btn-primary !py-1.5 !text-xs"
                  >
                    {t("accept", lang)}
                  </button>
                  <button
                    onClick={() => respondToBooking(b.id, false)}
                    className="btn btn-danger !py-1.5 !text-xs"
                  >
                    {t("reject", lang)}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Listings */}
      <div className="mt-10">
        <SectionTitle>{t("myExperiences", lang)}</SectionTitle>
        <div className="space-y-3">
          {mine.map((e) => (
            <div key={e.id} className="card overflow-hidden flex">
              <CategoryArt
                category={e.category}
                className="w-20 shrink-0"
                glyphSize="text-3xl"
              />
              <div className="p-4 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h3 className="font-bold">{pick(e.title, lang)}</h3>
                    <p className="text-sm text-muted">
                      {money(e.pricePerSeat, lang)} · {t("upTo", lang)}{" "}
                      {e.seatsMax} {t("seats", lang)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AudienceBadge policy={e.audiencePolicy} lang={lang} />
                    <ExperienceStatusChip status={e.status} lang={lang} />
                    <Link
                      href={`/expert/edit/${e.id}`}
                      className="btn btn-ghost !py-1 !px-3 !text-xs"
                    >
                      {t("edit", lang)}
                    </Link>
                  </div>
                </div>

                {/* The credential gate, visible in the product */}
                {e.status === "blocked" && e.blockedOn && (
                  <div className="mt-3 rounded-xl bg-danger-soft text-danger p-3 text-sm">
                    <p className="font-semibold">
                      {t("publishBlockedBody", lang, {
                        c: pick(e.title, lang),
                        r: pick(CREDENTIAL_LABEL[e.blockedOn], lang),
                      })}
                    </p>
                    <Link
                      href="/expert/credentials"
                      className="btn btn-ghost !py-1 !px-3 !text-xs mt-2"
                    >
                      {t("addCredential", lang)} →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "fg",
}: {
  label: string;
  value: string;
  tone?: "fg" | "brass" | "palm";
}) {
  const color =
    tone === "brass" ? "text-brass" : tone === "palm" ? "text-palm" : "text-fg";
  return (
    <div className="card p-4">
      <p className="text-[11px] font-bold text-muted uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
