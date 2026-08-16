"use client";

import Link from "next/link";
import type { Experience, Lang, Slot } from "@/lib/types";
import { pick, t } from "@/lib/i18n";
import { durationLabel, formatDateTime, isToday, money } from "@/lib/format";
import { useDemo } from "@/lib/store";
import { AudienceBadge, Avatar, CategoryArt, Stars } from "./ui";

export default function ExperienceCard({
  experience,
  nextSlot,
  compact = false,
}: {
  experience: Experience;
  nextSlot?: Slot;
  compact?: boolean;
}) {
  const { lang, expertById, mounted } = useDemo();
  const expert = expertById(experience.expertId);

  return (
    <Link
      href={`/experience/${experience.id}`}
      className="card card-hover overflow-hidden group flex flex-col h-full"
    >
      <div className="relative">
        <CategoryArt
          category={experience.category}
          className={compact ? "h-28" : "h-40"}
          glyphSize={compact ? "text-4xl" : "text-5xl"}
        />
        <div className="absolute top-2.5 start-2.5">
          <AudienceBadge policy={experience.audiencePolicy} lang={lang} />
        </div>
        {mounted && nextSlot && isToday(nextSlot.startsAt) && (
          <div className="absolute top-2.5 end-2.5">
            <span className="chip bg-clay text-white">{t("today", lang)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold leading-snug group-hover:text-brass transition-colors">
            {pick(experience.title, lang)}
          </h3>
          {expert && <Stars rating={expert.rating} />}
        </div>

        <p className="text-sm text-muted line-clamp-2">
          {pick(experience.tagline, lang)}
        </p>

        {expert && (
          <div className="flex items-center gap-2 text-xs text-muted mt-auto pt-2">
            <Avatar initials={expert.initials} size={24} />
            <span className="font-semibold text-fg">
              {pick(expert.name, lang)}
            </span>
            <span>·</span>
            <span>{pick(experience.district, lang)}</span>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-line pt-3 mt-1">
          <div>
            <span className="font-extrabold">
              {money(experience.pricePerSeat, lang)}
            </span>
            <span className="text-xs text-muted"> / {t("perSeat", lang)}</span>
          </div>
          <span className="text-xs text-muted">
            {durationLabel(experience.durationMin, lang)}
          </span>
        </div>

        {mounted && nextSlot && (
          <div className="text-xs text-palm font-semibold">
            {formatDateTime(nextSlot.startsAt, lang)}
          </div>
        )}
      </div>
    </Link>
  );
}
