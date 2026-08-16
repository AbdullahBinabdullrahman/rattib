"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { CATEGORY_GLYPH, CATEGORY_LABEL, pick, t } from "@/lib/i18n";
import ExperienceCard from "@/components/ExperienceCard";
import { Reveal } from "@/components/motion";
import { isToday } from "@/lib/format";
import { canBrowserBook } from "@/lib/eligibility";
import type { CategoryId } from "@/lib/types";

const MARQUEE: CategoryId[] = [
  "pottery",
  "bakery",
  "sadu",
  "coffee",
  "calligraphy",
  "perfume",
  "poetry",
  "khoos",
];

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
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28 md:pb-20">
          <Reveal>
            <span className="chip bg-brass-soft text-brass relative">
              <span className="relative flex w-1.5 h-1.5">
                <span className="live-dot absolute inset-0 rounded-full" />
                <span className="w-1.5 h-1.5 rounded-full bg-brass" />
              </span>
              {t("todayIn", lang)}
            </span>
          </Reveal>

          <Reveal index={1}>
            <h1 className="mt-6 text-[clamp(2.5rem,7vw,5rem)] font-extrabold leading-[1.05] max-w-3xl">
              {t("heroTitle", lang)}
              <br />
              <span className="text-brass">{t("heroTitle2", lang)}</span>
            </h1>
          </Reveal>

          <Reveal index={2}>
            <p className="mt-6 text-lg text-muted max-w-xl leading-relaxed">
              {t("heroBody", lang)}
            </p>
          </Reveal>

          <Reveal index={3}>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/explore" className="btn btn-primary !px-6 !py-3">
                {t("ctaExplore", lang)}
              </Link>
              <Link href="/auth" className="btn btn-ghost !px-6 !py-3">
                {t("ctaHost", lang)}
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Category rail — the crafts themselves, as the page's texture */}
        <Reveal index={4}>
          <div className="border-y border-line-soft bg-base-2/60">
            <div className="mx-auto max-w-6xl px-4 py-4 flex gap-2 overflow-x-auto">
              {MARQUEE.map((c) => (
                <Link
                  key={c}
                  href="/explore"
                  className="shrink-0 flex items-center gap-2 rounded-xl border border-line bg-panel px-3.5 py-2 text-sm font-semibold text-muted hover:text-fg hover:border-brass transition-colors"
                >
                  <span aria-hidden className="text-base">
                    {CATEGORY_GLYPH[c]}
                  </span>
                  {pick(CATEGORY_LABEL[c], lang)}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Today */}
      {todayList.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <Reveal>
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h2 className="text-xl font-extrabold">{t("todayIn", lang)}</h2>
              <Link
                href="/explore"
                className="text-sm font-semibold text-brass hover:underline"
              >
                {t("ctaExplore", lang)} →
              </Link>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayList.slice(0, 4).map((e, i) => (
              <Reveal key={e.id} index={i}>
                <ExperienceCard
                  experience={e}
                  nextSlot={nextSlotFor(e.id)}
                  compact
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <Reveal>
          <h2 className="text-xl font-extrabold mb-5">{t("whyTitle", lang)}</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: "✓", t: "why1t", b: "why1b", tone: "bg-palm-soft text-palm" },
            { icon: "♀", t: "why2t", b: "why2b", tone: "bg-rose-soft text-rose" },
            { icon: "⛨", t: "why3t", b: "why3b", tone: "bg-brass-soft text-brass" },
          ].map((c, i) => (
            <Reveal key={c.t} index={i}>
              <div className="card card-hover p-6 h-full">
                <span
                  className={`grid place-items-center w-10 h-10 rounded-xl text-lg font-bold ${c.tone}`}
                >
                  {c.icon}
                </span>
                <h3 className="font-bold mt-4 mb-2">{t(c.t as "why1t", lang)}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {t(c.b as "why1b", lang)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <Reveal>
          <h2 className="text-xl font-extrabold mb-5">{t("featured", lang)}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((e, i) => (
            <Reveal key={e.id} index={i}>
              <ExperienceCard experience={e} nextSlot={nextSlotFor(e.id)} />
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-10">
            <Link href="/explore" className="btn btn-ghost">
              {t("ctaExplore", lang)} →
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
