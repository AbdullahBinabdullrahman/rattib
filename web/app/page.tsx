"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { t } from "@/lib/i18n";
import ExperienceCard from "@/components/ExperienceCard";
import { SectionTitle } from "@/components/ui";
import { isToday } from "@/lib/format";
import { canBrowserBook } from "@/lib/eligibility";

export default function Home() {
  const { lang, experiences, slots, mounted, viewerGender, persona } = useDemo();

  const published = experiences.filter((e) => e.status === "published");
  const visible = published.filter((e) =>
    persona === "customer" ? canBrowserBook(e.audiencePolicy, viewerGender) : true,
  );

  const nextSlotFor = (id: string) =>
    slots.filter((s) => s.experienceId === id && s.seatsTaken < s.seatsTotal)[0];

  const todayList = mounted
    ? visible.filter((e) => {
        const s = nextSlotFor(e.id);
        return s && isToday(s.startsAt);
      })
    : [];

  const featured = visible.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 bg-gradient-to-b from-palm-soft/70 to-sand" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <span className="chip bg-clay-soft text-clay mb-5">
            {t("todayIn", lang)}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.15] max-w-3xl">
            {t("heroTitle", lang)}
            <br />
            <span className="text-palm">{t("heroTitle2", lang)}</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl leading-relaxed">
            {t("heroBody", lang)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className="btn btn-primary !px-6 !py-3">
              {t("ctaExplore", lang)}
            </Link>
            <Link href="/expert" className="btn btn-ghost !px-6 !py-3">
              {t("ctaHost", lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle>{t("whyTitle", lang)}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "✓", t: "why1t", b: "why1b", tone: "bg-palm-soft text-palm" },
            { icon: "♀", t: "why2t", b: "why2b", tone: "bg-rose-soft text-rose" },
            { icon: "⛨", t: "why3t", b: "why3b", tone: "bg-gold-soft text-gold" },
          ].map((c) => (
            <div key={c.t} className="card p-6">
              <span
                className={`grid place-items-center w-10 h-10 rounded-xl text-lg font-bold ${c.tone}`}
              >
                {c.icon}
              </span>
              <h3 className="font-bold mt-4 mb-2">
                {t(c.t as "why1t", lang)}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {t(c.b as "why1b", lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Today */}
      {todayList.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-6">
          <SectionTitle>{t("todayIn", lang)}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayList.slice(0, 4).map((e) => (
              <ExperienceCard
                key={e.id}
                experience={e}
                nextSlot={nextSlotFor(e.id)}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle>{t("featured", lang)}</SectionTitle>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((e) => (
            <ExperienceCard
              key={e.id}
              experience={e}
              nextSlot={nextSlotFor(e.id)}
            />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/explore" className="btn btn-ghost">
            {t("ctaExplore", lang)} →
          </Link>
        </div>
      </section>
    </div>
  );
}
