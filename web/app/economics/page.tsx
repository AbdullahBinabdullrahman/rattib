"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/lib/store";
import { pick } from "@/lib/i18n";
import { money } from "@/lib/format";
import type { Bi, Lang } from "@/lib/types";
import {
  BASE,
  cumulativeBurn,
  customerEconomics,
  hostCase,
  perBooking,
  project,
  type Assumptions,
} from "@/lib/economics";

const T = {
  title: { ar: "اقتصاديات الوحدة", en: "Unit economics" },
  sub: {
    ar: "كل رقم هنا محسوب من الافتراضات — حرّك أي مؤشر وسترى الأثر",
    en: "Every figure here is computed from the assumptions — move a slider and watch it flow through",
  },
  assumptions: { ar: "الافتراضات", en: "Assumptions" },
  hostCommission: { ar: "عمولة الخبير", en: "Host commission" },
  guestFee: { ar: "رسوم خدمة العميل", en: "Guest service fee" },
  fillDm: { ar: "نسبة الإشغال عبر الرسائل", en: "Fill rate selling by DM" },
  fillRattib: { ar: "نسبة الإشغال على رتّب", en: "Fill rate on Rattib" },
  cac: { ar: "تكلفة اكتساب العميل", en: "Customer acquisition cost" },
  perBooking: { ar: "لكل حجز", en: "Per booking" },
  guestPays: { ar: "يدفع العميل", en: "Guest pays" },
  toHost: { ar: "للخبير", en: "To host" },
  grossTake: { ar: "إجمالي عمولتنا", en: "Our gross take" },
  processing: { ar: "رسوم الدفع", en: "Payment processing" },
  refunds: { ar: "استردادات", en: "Refunds" },
  insurance: { ar: "تأمين المسؤولية", en: "Liability insurance" },
  support: { ar: "الدعم والتشغيل", en: "Support and ops" },
  banking: { ar: "تحويلات بنكية", en: "Banking" },
  contribution: { ar: "هامش المساهمة", en: "Contribution" },
  ofNetRev: { ar: "من صافي الإيراد", en: "of net revenue" },
  effTake: { ar: "العمولة الفعلية", en: "Effective take rate" },

  hostTitle: { ar: "حالة الخبير", en: "The host case" },
  hostSub: {
    ar: "لماذا لا يكتفي الخبير بإنستقرام؟ ليس الولاء — بل نسبة الإشغال.",
    en: "Why wouldn't the host just keep using Instagram? Not loyalty — fill rate.",
  },
  viaDm: { ar: "عبر الرسائل الخاصة", en: "Selling by DM" },
  viaRattib: { ar: "على رتّب", en: "On Rattib" },
  monthlyNet: { ar: "صافي الدخل الشهري", en: "Net monthly income" },
  seatsSold: { ar: "مقعدًا مباعًا", en: "seats sold" },
  uplift: { ar: "الفارق", en: "uplift" },
  hostWarn: {
    ar: "عند فارق إشغال أقل من ١٠ نقاط، لا يكفي المكسب لإبقاء الخبير على المنصة. هذا أهم افتراض يحتاج إثباتًا.",
    en: "Below about 10 points of fill-rate uplift the gain is not enough to hold a host. This is the assumption most urgently needing proof.",
  },

  customerTitle: { ar: "اقتصاديات العميل", en: "Customer economics" },
  payback: { ar: "الاسترداد", en: "Payback" },
  bookings: { ar: "حجز", en: "bookings" },
  ltv: { ar: "القيمة على سنتين", en: "2-year LTV" },
  ratio: { ar: "القيمة إلى التكلفة", en: "LTV : CAC" },

  planTitle: { ar: "خطة ثلاث سنوات", en: "Three-year plan" },
  year: { ar: "السنة", en: "Year" },
  cities: { ar: "مدن", en: "Cities" },
  hosts: { ar: "خبراء نشطون", en: "Active hosts" },
  gmv: { ar: "إجمالي المبيعات", en: "GMV" },
  netRev: { ar: "صافي الإيراد", en: "Net revenue" },
  opex: { ar: "المصروفات", en: "Opex" },
  ebitda: { ar: "الأرباح قبل الفوائد", en: "EBITDA" },
  burn: { ar: "إجمالي الحرق حتى نهاية السنة ٣", en: "Cumulative burn to end of Y3" },
  sensitivity: { ar: "حساسية نسبة الإشغال", en: "Fill-rate sensitivity" },
  sensitivityNote: {
    ar: "إجمالي المبيعات خطي تقريبًا مع نسبة الإشغال — أعلى متغير أثرًا.",
    en: "GMV is close to linear in fill rate, making it the highest-leverage variable.",
  },

  askTitle: { ar: "الطلب", en: "The ask" },
  askAmount: { ar: "٧٫٥ مليون ريال", en: "SAR 7.5M" },
  askSub: {
    ar: "جولة تأسيسية لـ ١٨ شهرًا — لا نجمع ثلاث سنوات دفعة واحدة، بل حتى نقطة الإثبات التالية.",
    en: "An 18-month seed — not three years at once, but to the next proof point.",
  },
  milestones: { ar: "ما تشتريه الجولة", en: "What the seed buys" },
  reset: { ar: "إعادة الافتراضات", en: "Reset assumptions" },
  caveat: {
    ar: "الافتراضات القابلة للطعن موثّقة بالكامل في docs/unit-economics.md §7.",
    en: "The contestable assumptions are documented in full in docs/unit-economics.md §7.",
  },
};

const MILESTONES: Bi[] = [
  {
    ar: "تسوية هيكل الترخيص وتشغيله",
    en: "Licensing structure settled and operating",
  },
  {
    ar: "١٨٠ خبيرًا نشطًا في الرياض مع محرّك التراخيص",
    en: "180 active Riyadh hosts, with the credential engine running",
  },
  {
    ar: "إثبات نسبة إشغال ٦٥٪+ وفارق دخل للخبير ٢٥٪+",
    en: "Fill rate proven at 65%+ and host income uplift confirmed at 25%+",
  },
  {
    ar: "معدل تكرار يتجاوز ٢٫٥ حجز للعميل سنويًا",
    en: "Repeat rate above 2.5 bookings per customer per year",
  },
  {
    ar: "إطلاق المدينة الثانية لإثبات قابلية التكرار",
    en: "City two launched, proving the playbook transfers",
  },
];

export default function Economics() {
  const { lang } = useDemo();
  const [a, setA] = useState<Assumptions>(BASE);

  const unit = useMemo(() => perBooking(a), [a]);
  const host = useMemo(() => hostCase(a), [a]);
  const cust = useMemo(() => customerEconomics(a), [a]);
  const plan = useMemo(() => project(a), [a]);
  const burn = useMemo(() => cumulativeBurn(plan), [plan]);

  const set = (patch: Partial<Assumptions>) => setA((s) => ({ ...s, ...patch }));
  const tt = (k: keyof typeof T) => pick(T[k] as Bi, lang);

  const upliftTooSmall = a.fillRateRattib - a.fillRateDm < 0.1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">{tt("title")}</h1>
      <p className="text-lg text-muted mt-2 max-w-2xl">{tt("sub")}</p>

      {/* Assumption controls */}
      <section className="card p-5 mt-8">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 className="font-extrabold">{tt("assumptions")}</h2>
          <button
            onClick={() => setA(BASE)}
            className="btn btn-ghost !py-1 !px-3 !text-xs"
          >
            {tt("reset")}
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Slider
            label={tt("hostCommission")}
            value={a.hostCommission}
            display={`${Math.round(a.hostCommission * 100)}%`}
            min={0}
            max={0.35}
            step={0.01}
            onChange={(v) => set({ hostCommission: v })}
          />
          <Slider
            label={tt("guestFee")}
            value={a.guestFee}
            display={`${Math.round(a.guestFee * 100)}%`}
            min={0}
            max={0.25}
            step={0.01}
            onChange={(v) => set({ guestFee: v })}
          />
          <Slider
            label={tt("cac")}
            value={a.cac}
            display={money(a.cac, lang)}
            min={40}
            max={300}
            step={5}
            onChange={(v) => set({ cac: v })}
          />
          <Slider
            label={tt("fillDm")}
            value={a.fillRateDm}
            display={`${Math.round(a.fillRateDm * 100)}%`}
            min={0.2}
            max={0.9}
            step={0.01}
            onChange={(v) => set({ fillRateDm: v })}
            tone="clay"
          />
          <Slider
            label={tt("fillRattib")}
            value={a.fillRateRattib}
            display={`${Math.round(a.fillRateRattib * 100)}%`}
            min={0.2}
            max={0.95}
            step={0.01}
            onChange={(v) => set({ fillRateRattib: v })}
          />
        </div>
      </section>

      {/* Per booking */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold mb-4">{tt("perBooking")}</h2>
        <div className="grid lg:grid-cols-[1fr_260px] gap-4 items-start">
          <div className="card p-5">
            <Row label={tt("guestPays")} value={money(unit.chargedToGuest, lang)} bold />
            <Row
              label={tt("toHost")}
              value={`− ${money(unit.paidToHost, lang)}`}
              muted
            />
            <Row
              label={tt("grossTake")}
              value={money(unit.grossTake, lang)}
              bold
              divider
            />
            <Row label={tt("processing")} value={`− ${money(unit.processing, lang)}`} muted />
            <Row label={tt("refunds")} value={`− ${money(unit.refunds, lang)}`} muted />
            <Row label={tt("insurance")} value={`− ${money(unit.insurance, lang)}`} muted />
            <Row label={tt("support")} value={`− ${money(unit.support, lang)}`} muted />
            <Row label={tt("banking")} value={`− ${money(unit.banking, lang)}`} muted />
            <Row
              label={tt("contribution")}
              value={money(unit.contribution, lang)}
              bold
              divider
              tone={unit.contribution > 0 ? "palm" : "danger"}
            />
          </div>

          <div className="space-y-3">
            <Metric
              label={tt("contribution")}
              value={`${Math.round(unit.contributionMargin * 100)}%`}
              note={tt("ofNetRev")}
              tone={unit.contributionMargin > 0.6 ? "palm" : "clay"}
            />
            <Metric
              label={tt("effTake")}
              value={`${(unit.effectiveTakeRate * 100).toFixed(1)}%`}
              note={lang === "ar" ? "مما يدفعه العميل" : "of what the guest pays"}
            />
          </div>
        </div>
      </section>

      {/* Host case */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-1">{tt("hostTitle")}</h2>
        <p className="text-sm text-muted mb-4 max-w-2xl">{tt("hostSub")}</p>

        <div className="card p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <HostBar
              label={tt("viaDm")}
              amount={host.dmNet}
              seats={host.dmSeats}
              max={Math.max(host.dmNet, host.rattibNet)}
              seatsLabel={tt("seatsSold")}
              lang={lang}
              tone="clay"
            />
            <HostBar
              label={tt("viaRattib")}
              amount={host.rattibNet}
              seats={host.rattibSeats}
              max={Math.max(host.dmNet, host.rattibNet)}
              seatsLabel={tt("seatsSold")}
              lang={lang}
              tone="palm"
            />
          </div>

          <div className="mt-6 pt-5 border-t border-line flex items-baseline gap-3 flex-wrap">
            <span className="text-sm font-semibold text-muted">
              {tt("uplift")}
            </span>
            <span
              className={`text-3xl font-extrabold ${
                host.uplift >= 0.2
                  ? "text-palm"
                  : host.uplift > 0
                    ? "text-clay"
                    : "text-danger"
              }`}
              dir="ltr"
            >
              {host.uplift >= 0 ? "+" : ""}
              {Math.round(host.uplift * 100)}%
            </span>
            <span className="text-sm text-muted">{tt("monthlyNet")}</span>
          </div>

          {upliftTooSmall && (
            <p className="mt-4 rounded-xl bg-danger-soft text-danger p-3 text-sm font-semibold">
              {tt("hostWarn")}
            </p>
          )}
        </div>
      </section>

      {/* Customer economics */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-4">{tt("customerTitle")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Metric
            label={tt("cac")}
            value={money(a.cac, lang)}
            note={lang === "ar" ? "مخلوط" : "blended"}
          />
          <Metric
            label={tt("payback")}
            value={cust.paybackBookings.toFixed(1)}
            note={tt("bookings")}
            tone={cust.paybackBookings <= 1.5 ? "palm" : "clay"}
          />
          <Metric label={tt("ltv")} value={money(cust.ltv2y, lang)} />
          <Metric
            label={tt("ratio")}
            value={`${cust.ltvToCac.toFixed(1)}×`}
            tone={cust.ltvToCac >= 3 ? "palm" : "clay"}
          />
        </div>
      </section>

      {/* Three-year plan */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-4">{tt("planTitle")}</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-line text-muted text-xs">
                <Th>{tt("year")}</Th>
                <Th>{tt("cities")}</Th>
                <Th>{tt("hosts")}</Th>
                <Th>{tt("gmv")}</Th>
                <Th>{tt("netRev")}</Th>
                <Th>{tt("opex")}</Th>
                <Th>{tt("ebitda")}</Th>
              </tr>
            </thead>
            <tbody>
              {plan.map((r, i) => (
                <tr key={r.year} className="border-b border-line last:border-0">
                  <Td bold>{r.year}</Td>
                  <Td>{r.cities}</Td>
                  <Td>{PLAN_HOSTS[i]}</Td>
                  <Td bold>{millions(r.gmv, lang)}</Td>
                  <Td>{millions(r.netRevenue, lang)}</Td>
                  <Td>{millions(r.opex, lang)}</Td>
                  <Td tone={r.ebitda < 0 ? "danger" : "palm"}>
                    {millions(r.ebitda, lang)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div className="card p-5">
            <p className="text-xs font-bold text-muted uppercase tracking-wide">
              {tt("burn")}
            </p>
            <p className="text-2xl font-extrabold text-danger mt-1">
              {millions(burn, lang)}
            </p>
          </div>
          <div className="card p-5">
            <p className="text-xs font-bold text-muted uppercase tracking-wide">
              {tt("sensitivity")}
            </p>
            <div className="mt-2 space-y-1.5">
              {[-0.11, 0, 0.09].map((shift) => {
                const y3 = project(a, shift)[2];
                return (
                  <div
                    key={shift}
                    className="flex items-center justify-between text-sm gap-2"
                  >
                    <span
                      className={
                        shift === 0 ? "font-bold" : "text-muted"
                      }
                      dir="ltr"
                    >
                      {Math.round((0.66 + shift) * 100)}%
                    </span>
                    <span
                      className={shift === 0 ? "font-bold" : "text-muted"}
                    >
                      {millions(y3.gmv, lang)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-muted mt-3 leading-relaxed">
              {tt("sensitivityNote")}
            </p>
          </div>
        </div>
      </section>

      {/* The ask */}
      <section className="mt-12">
        <div className="card p-6 bg-palm-soft/50 border-palm/30">
          <h2 className="text-xl font-extrabold mb-1">{tt("askTitle")}</h2>
          <p className="text-4xl font-extrabold text-palm mt-2">
            {tt("askAmount")}
          </p>
          <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
            {tt("askSub")}
          </p>

          <h3 className="font-bold mt-6 mb-3 text-sm">{tt("milestones")}</h3>
          <ul className="space-y-2">
            {MILESTONES.map((m, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="text-palm font-bold shrink-0">
                  {i + 1}.
                </span>
                <span>{pick(m, lang)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="text-xs text-muted mt-8 leading-relaxed">{tt("caveat")}</p>
    </div>
  );
}

const PLAN_HOSTS = [180, 720, 2100];

function millions(n: number, lang: Lang): string {
  const m = n / 1_000_000;
  const s = `${m < 0 ? "−" : ""}${Math.abs(m).toFixed(1)}M`;
  return lang === "ar" ? `${s} ريال` : `SAR ${s}`;
}

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  tone = "palm",
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  tone?: "palm" | "clay";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="label !mb-0">{label}</span>
        <span
          className={`font-extrabold text-sm ${
            tone === "clay" ? "text-clay" : "text-palm"
          }`}
          dir="ltr"
        >
          {display}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: tone === "clay" ? "#BD5F39" : "#14614C" }}
      />
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
  divider,
  tone,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
  divider?: boolean;
  tone?: "palm" | "danger";
}) {
  const color =
    tone === "palm" ? "text-palm" : tone === "danger" ? "text-danger" : "";
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2 ${
        divider ? "border-t border-line mt-1 pt-3" : ""
      }`}
    >
      <span className={`text-sm ${muted ? "text-muted" : "font-semibold"}`}>
        {label}
      </span>
      <span
        className={`${bold ? "font-extrabold" : "font-semibold"} ${
          muted ? "text-muted" : ""
        } ${color}`}
      >
        {value}
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  note,
  tone = "ink",
}: {
  label: string;
  value: string;
  note?: string;
  tone?: "ink" | "palm" | "clay";
}) {
  const color =
    tone === "palm" ? "text-palm" : tone === "clay" ? "text-clay" : "text-fg";
  return (
    <div className="card p-4">
      <p className="text-[11px] font-bold text-muted uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-2xl font-extrabold mt-1 ${color}`} dir="ltr">
        {value}
      </p>
      {note && <p className="text-xs text-muted mt-0.5">{note}</p>}
    </div>
  );
}

function HostBar({
  label,
  amount,
  seats,
  max,
  seatsLabel,
  lang,
  tone,
}: {
  label: string;
  amount: number;
  seats: number;
  max: number;
  seatsLabel: string;
  lang: Lang;
  tone: "palm" | "clay";
}) {
  const pct = max > 0 ? (amount / max) * 100 : 0;
  const bg = tone === "palm" ? "bg-palm" : "bg-clay";
  const text = tone === "palm" ? "text-palm" : "text-clay";
  return (
    <div>
      <p className="text-sm font-semibold text-muted">{label}</p>
      <p className={`text-2xl font-extrabold mt-1 ${text}`}>
        {money(Math.round(amount), lang)}
      </p>
      <p className="text-xs text-muted mt-0.5">
        {Math.round(seats)} {seatsLabel}
      </p>
      <div className="h-2.5 rounded-full bg-panel-2 mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full ${bg} transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-start font-bold px-4 py-3">{children}</th>;
}

function Td({
  children,
  bold,
  tone,
}: {
  children: React.ReactNode;
  bold?: boolean;
  tone?: "palm" | "danger";
}) {
  const color =
    tone === "palm" ? "text-palm" : tone === "danger" ? "text-danger" : "";
  return (
    <td className={`px-4 py-3 ${bold ? "font-extrabold" : ""} ${color}`}>
      {children}
    </td>
  );
}
