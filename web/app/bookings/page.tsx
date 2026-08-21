"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { pick, t } from "@/lib/i18n";
import { countdown, formatDateLong, formatTime, money } from "@/lib/format";
import { BookingStatusChip, CategoryArt, Empty } from "@/components/ui";

export default function Bookings() {
  const {
    lang,
    bookings,
    experienceById,
    slotById,
    expertById,
    cancelBooking,
    now,
    mounted,
  } = useDemo();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-extrabold tracking-tight mb-6">
        {t("myBookings", lang)}
      </h1>

      {!mounted ? null : bookings.length === 0 ? (
        <div className="space-y-4">
          <Empty text={t("noBookings", lang)} />
          <Link href="/explore" className="btn btn-primary">
            {t("ctaExplore", lang)}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => {
            const exp = experienceById(b.experienceId)!;
            const slot = slotById(b.slotId);
            const expert = expertById(exp.expertId)!;
            const refunded =
              b.status === "rejected" ||
              b.status === "expired" ||
              b.status === "cancelled";

            return (
              <div key={b.id} className="card overflow-hidden">
                <div className="flex">
                  <CategoryArt
                    category={exp.category}
                    className="w-24 sm:w-32 shrink-0"
                    glyphSize="text-4xl"
                  />
                  <div className="p-4 flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <Link
                          href={`/experience/${exp.id}`}
                          className="font-bold hover:text-palm"
                        >
                          {pick(exp.title, lang)}
                        </Link>
                        <p className="text-sm text-muted mt-0.5">
                          {pick(expert.name, lang)} ·{" "}
                          {pick(exp.district, lang)}
                        </p>
                        {slot && (
                          <p className="text-sm text-muted">
                            {formatDateLong(slot.startsAt, lang)} ·{" "}
                            {formatTime(slot.startsAt, lang)}
                          </p>
                        )}
                      </div>
                      <BookingStatusChip status={b.status} lang={lang} />
                    </div>

                    <div className="flex items-center gap-4 mt-3 flex-wrap text-sm">
                      <span className="font-semibold">
                        {money(b.amount + b.serviceFee, lang)}
                      </span>
                      <span className="text-muted">
                        {t("seatsX", lang, { n: b.seats })}
                      </span>
                    </div>

                    {/* Pending — the SLA clock the customer can watch */}
                    {b.status === "pending" && (
                      <div className="mt-3 rounded-xl bg-door-soft text-brass p-3 text-sm font-semibold flex items-center justify-between gap-2 flex-wrap">
                        <span>{t("respondBy", lang)}</span>
                        <span dir="ltr">{countdown(b.respondBy, lang, now)}</span>
                      </div>
                    )}

                    {b.status === "accepted" && (
                      <div className="mt-3 rounded-xl bg-palm-soft text-palm p-3 text-sm flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-semibold">
                          {t("checkinCode", lang)}
                        </span>
                        <span
                          className="font-mono font-extrabold tracking-[0.25em] text-base"
                          dir="ltr"
                        >
                          {b.checkinCode}
                        </span>
                      </div>
                    )}

                    {refunded && (
                      <div className="mt-3 rounded-xl bg-panel-2 text-muted p-3 text-sm">
                        <span className="font-semibold">
                          {t("refunded", lang)}
                        </span>
                        {b.rejectionReason && (
                          <span> — {pick(b.rejectionReason, lang)}</span>
                        )}
                      </div>
                    )}

                    {(b.status === "pending" || b.status === "accepted") && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="btn btn-danger !py-1.5 !px-3 !text-xs mt-3"
                      >
                        {t("cancelBooking", lang)}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
