"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDemo } from "@/lib/store";
import { PAYMENT_LABEL, pick, t } from "@/lib/i18n";
import { durationLabel, formatDateLong, formatTime, money } from "@/lib/format";
import {
  checkGuest,
  checkParty,
  requiresVerifiedIdentity,
} from "@/lib/eligibility";
import type { Gender, Guest, PaymentMethod } from "@/lib/types";
import { AudienceBadge, CategoryArt } from "@/components/ui";

const METHODS: PaymentMethod[] = ["mada", "applepay", "stcpay", "tabby"];

export default function BookPage() {
  const params = useParams<{ slotId: string }>();
  const router = useRouter();
  const {
    lang,
    slotById,
    experienceById,
    viewerGender,
    createBooking,
    mounted,
    serviceFeeRate,
  } = useDemo();

  const slot = slotById(params.slotId);
  const exp = slot ? experienceById(slot.experienceId) : undefined;

  const [guests, setGuests] = useState<Guest[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("mada");
  const [paying, setPaying] = useState(false);

  // Seed the party with the signed-in customer.
  useEffect(() => {
    if (guests.length === 0) {
      setGuests([
        {
          name: lang === "ar" ? "أنت" : "You",
          gender: viewerGender,
          verified: false,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerGender]);

  if (!mounted) {
    return <div className="mx-auto max-w-4xl px-4 py-20" />;
  }

  if (!slot || !exp) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-muted">
        Not found ·{" "}
        <Link href="/explore" className="text-palm font-semibold">
          {t("navExplore", lang)}
        </Link>
      </div>
    );
  }

  const locked = requiresVerifiedIdentity(exp.audiencePolicy);
  const partyCheck = checkParty(exp.audiencePolicy, guests);
  const seatsLeft = slot.seatsTotal - slot.seatsTaken;
  const overCapacity = guests.length > seatsLeft;
  const canPay = partyCheck.ok && !overCapacity && guests.length > 0;

  const amount = exp.pricePerSeat * guests.length;
  const fee = Math.round(amount * serviceFeeRate);

  const setGuest = (i: number, patch: Partial<Guest>) =>
    setGuests((g) => g.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  const pay = () => {
    setPaying(true);
    // A real integration would hand off to a licensed PSP here.
    setTimeout(() => {
      createBooking({ slotId: slot.id, guests, method });
      router.push("/bookings");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href={`/experience/${exp.id}`}
        className="text-sm text-muted hover:text-ink font-semibold"
      >
        ← {pick(exp.title, lang)}
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight mt-4 mb-6">
        {t("bookingTitle", lang)}
      </h1>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-6">
          {/* Session summary */}
          <div className="card overflow-hidden flex">
            <CategoryArt
              category={exp.category}
              className="w-28 shrink-0"
              glyphSize="text-4xl"
            />
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <h2 className="font-bold">{pick(exp.title, lang)}</h2>
                <AudienceBadge policy={exp.audiencePolicy} lang={lang} />
              </div>
              <p className="text-sm text-muted mt-1">
                {formatDateLong(slot.startsAt, lang)} ·{" "}
                {formatTime(slot.startsAt, lang)} ·{" "}
                {durationLabel(exp.durationMin, lang)}
              </p>
              <p className="text-sm text-muted">
                {pick(exp.district, lang)} · {seatsLeft} {t("seatsLeft", lang)}
              </p>
            </div>
          </div>

          {/* Guests — this is where audience policy is enforced */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold">{t("guests", lang)}</h2>
              <button
                onClick={() =>
                  setGuests((g) => [
                    ...g,
                    { name: "", gender: viewerGender, verified: false },
                  ])
                }
                disabled={guests.length >= seatsLeft}
                className="btn btn-ghost !py-1 !px-3 !text-xs"
              >
                + {t("addGuest", lang)}
              </button>
            </div>

            {locked && (
              <div className="rounded-xl bg-rose-soft text-rose text-sm p-3 my-3 font-semibold">
                {t("lockedNotice", lang)}
              </div>
            )}

            <div className="space-y-3 mt-3">
              {guests.map((g, i) => {
                const check = checkGuest(exp.audiencePolicy, g);
                return (
                  <div
                    key={i}
                    className={`rounded-xl border p-3 ${
                      check.ok ? "border-line" : "border-rose/40 bg-rose-soft/40"
                    }`}
                  >
                    <div className="flex gap-2 items-center flex-wrap">
                      <input
                        className="field flex-1 min-w-[130px] !py-1.5"
                        placeholder={t("guestName", lang)}
                        value={g.name}
                        onChange={(e) => setGuest(i, { name: e.target.value })}
                      />

                      <div className="flex rounded-lg border border-line overflow-hidden">
                        {(["female", "male"] as Gender[]).map((gen) => (
                          <button
                            key={gen}
                            onClick={() => setGuest(i, { gender: gen, verified: false })}
                            className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                              g.gender === gen
                                ? gen === "female"
                                  ? "bg-rose text-white"
                                  : "bg-palm text-white"
                                : "bg-surface text-muted"
                            }`}
                          >
                            {t(gen === "female" ? "female" : "male", lang)}
                          </button>
                        ))}
                      </div>

                      {locked &&
                        (g.verified ? (
                          <span className="chip bg-palm-soft text-palm">
                            ✓ {t("verified", lang)}
                          </span>
                        ) : (
                          <button
                            onClick={() => setGuest(i, { verified: true })}
                            className="btn !py-1.5 !px-3 !text-xs bg-[#1B3A6B] text-white"
                          >
                            {t("verifyNafath", lang)}
                          </button>
                        ))}

                      {guests.length > 1 && (
                        <button
                          onClick={() =>
                            setGuests((gs) => gs.filter((_, idx) => idx !== i))
                          }
                          className="text-muted hover:text-ink text-lg px-1"
                          aria-label={t("remove", lang)}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {!check.ok && (
                      <p className="text-xs text-rose font-semibold mt-2">
                        {pick(check.reason, lang)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!partyCheck.ok && guests.every((g) => checkGuest(exp.audiencePolicy, g).ok) && (
              <p className="text-xs text-rose font-semibold mt-3">
                {pick(partyCheck.reason, lang)}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="card p-5">
            <h2 className="font-bold mb-3">{t("payWith", lang)}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border p-3 text-sm font-semibold transition-colors ${
                    method === m
                      ? "border-palm bg-palm-soft text-palm"
                      : "border-line hover:border-ink"
                  }`}
                >
                  {pick(PAYMENT_LABEL[m], lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price rail */}
        <aside className="lg:sticky lg:top-24 card p-5">
          <h2 className="font-bold mb-4">{t("priceSummary", lang)}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">
                {t("seatsX", lang, { n: guests.length })}
              </dt>
              <dd>{money(amount, lang)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("serviceFee", lang)}</dt>
              <dd>{money(fee, lang)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 mt-2 font-extrabold text-base">
              <dt>{t("total", lang)}</dt>
              <dd>{money(amount + fee, lang)}</dd>
            </div>
          </dl>
          <p className="text-[11px] text-muted mt-1">{t("vatNote", lang)}</p>

          {overCapacity && (
            <p className="text-xs text-rose font-semibold mt-3">
              {seatsLeft} {t("seatsLeft", lang)}
            </p>
          )}

          <button
            disabled={!canPay || paying}
            onClick={pay}
            className="btn btn-primary w-full mt-4 !py-3"
          >
            {paying ? "…" : t("payNow", lang)}
          </button>

          <p className="text-[11px] text-muted mt-3 leading-relaxed">
            {t("heldNote", lang)}
          </p>
          <p className="text-[11px] text-muted mt-2 leading-relaxed">
            {exp.bookingMode === "instant"
              ? t("instantBook", lang)
              : t("slaLine", lang, { h: exp.responseSlaHours })}
          </p>
        </aside>
      </div>
    </div>
  );
}
