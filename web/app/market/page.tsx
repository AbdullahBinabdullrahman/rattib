"use client";

import { useDemo } from "@/lib/store";
import { pick, t } from "@/lib/i18n";
import type { Bi } from "@/lib/types";

const STATS: { value: string; label: Bi; note: Bi }[] = [
  {
    value: "93.3M",
    label: { ar: "سائح محلي في 2025", en: "Domestic tourists in 2025" },
    note: { ar: "بنمو 8.3٪ عن 2024", en: "up 8.3% on 2024" },
  },
  {
    value: "SAR 127.1B",
    label: { ar: "إنفاق السياحة الداخلية", en: "Domestic tourism spend" },
    note: { ar: "من إجمالي 304 مليار ريال", en: "of SAR 304B total" },
  },
  {
    value: "78%",
    label: {
      ar: "حصة السياحة الداخلية من الزوار",
      en: "Domestic share of visitors",
    },
    note: { ar: "الربع الأول 2026", en: "Q1 2026" },
  },
  {
    value: "44%",
    label: { ar: "من الزوار نساء", en: "of travellers are women" },
    note: { ar: "أكثر من 13 مليون امرأة", en: "over 13 million women" },
  },
];

const DIVERGENCE: { label: Bi; value: string; tone: "up" | "down" }[] = [
  {
    label: { ar: "السياحة الوافدة — الربع الأول 2026", en: "Inbound — Q1 2026" },
    value: "−13%",
    tone: "down",
  },
  {
    label: { ar: "السياحة الداخلية — الربع الأول 2026", en: "Domestic — Q1 2026" },
    value: "+16%",
    tone: "up",
  },
];

const COMPETITORS: {
  name: string | Bi;
  what: Bi;
  gap: Bi;
}[] = [
  {
    name: "flynas × STA — Saudi Experiences",
    what: {
      ar: "أُطلقت يوليو 2026 · 150+ نشاطًا في 15 وجهة",
      en: "Launched July 2026 · 150+ activities across 15 destinations",
    },
    gap: {
      ar: "كتالوج منسّق للزائر الدولي — بلا بوابة خبير ولا ذيل طويل",
      en: "A curated catalogue for inbound visitors — no host portal, no long tail",
    },
  },
  {
    name: "webook.com",
    what: {
      ar: "التطبيق الشامل للفعاليات والتذاكر في السعودية",
      en: "The Saudi super app for events and ticketing",
    },
    gap: {
      ar: "مبني للفعاليات الكبيرة لا للجلسات الصغيرة مع مضيف باسمه",
      en: "Built for large ticketed events, not 8-seat sessions with a named host",
    },
  },
  {
    name: "Airbnb · GetYourGuide · Viator",
    what: {
      ar: "منصات عالمية قوية في السياحة الوافدة",
      en: "Global platforms, strong on inbound",
    },
    gap: {
      ar: "عرض سعودي ضحل، وتجربة غير عربية أولًا، وبلا سياسة حضور",
      en: "Thin Saudi supply, not Arabic-first, no audience policy",
    },
  },
  {
    name: {
      ar: "إنستقرام وواتساب",
      en: "Instagram and WhatsApp",
    },
    what: {
      ar: "المنافس الحقيقي — هنا تُباع هذه الجلسات اليوم",
      en: "The real incumbent — where these sessions actually sell today",
    },
    gap: {
      ar: "بلا إدارة مواعيد ولا حماية دفع ولا تقييمات ولا اكتشاف",
      en: "No availability management, no payment protection, no reviews, no discovery",
    },
  },
];

const DIFFERENTIATORS: { title: Bi; body: Bi }[] = [
  {
    title: { ar: "محليًا أولًا", en: "Domestic-first" },
    body: {
      ar: "السوق الداخلي هو القاعدة الصامدة: نما 16٪ في الربع الذي تراجعت فيه السياحة الوافدة 13٪. نبني للمقيم في الرياض لا للزائر العابر.",
      en: "Domestic is the resilient base: it grew 16% in the quarter inbound fell 13%. We build for the Riyadh resident, not the passing visitor.",
    },
  },
  {
    title: { ar: "قفل الحضور كأصل في المنتج", en: "Audience lock as a primitive" },
    body: {
      ar: "ليست تصفية بل فتح لجانب العرض: كثير من الحرفيات لن ينشرن تجربة إلا بضمان قاعة للنساء فقط. لا منافس يعرّف سياسة الحضور ككائن أساسي.",
      en: "Not a filter but a supply unlock: many skilled women will only list with a women-only room guaranteed. No competitor models audience policy as a first-class object.",
    },
  },
  {
    title: { ar: "محرّك التراخيص", en: "The credential engine" },
    body: {
      ar: "ثلاث طبقات: الهوية الاقتصادية (سجل تجاري أو وثيقة عمل حر)، رخصة النشاط حسب الفئة، ثم طبقة الثقة لدينا. التحقق عند النشر، والتعليق التلقائي عند انتهاء الصلاحية.",
      en: "Three layers: economic identity (CR or freelance certificate), a category-specific activity licence, then our own trust layer. Verified at publish, auto-paused on expiry.",
    },
  },
  {
    title: { ar: "عرض طويل الذيل", en: "Long-tail supply" },
    body: {
      ar: "هيئة التراث رخّصت أكثر من 4800 حرفي عبر منصة أبدع في 2025 — قائمة استقطاب جاهزة وشهادة تحقق في آنٍ واحد.",
      en: "The Heritage Commission licensed 4,800+ artisans through the Abde'a platform in 2025 — a warm acquisition list and a ready-made verification credential.",
    },
  },
];

export default function Market() {
  const { lang } = useDemo();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">
        {t("marketTitle", lang)}
      </h1>
      <p className="text-lg text-muted mt-2">{t("marketSub", lang)}</p>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
        {STATS.map((s) => (
          <div key={s.value} className="card p-5">
            <p className="text-2xl font-extrabold text-palm" dir="ltr">
              {s.value}
            </p>
            <p className="text-sm font-semibold mt-1.5 leading-snug">
              {pick(s.label, lang)}
            </p>
            <p className="text-xs text-muted mt-1">{pick(s.note, lang)}</p>
          </div>
        ))}
      </div>

      {/* The divergence that sets the strategy */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-1">
          {lang === "ar"
            ? "الانقسام الذي يحدد الاستراتيجية"
            : "The divergence that sets the strategy"}
        </h2>
        <p className="text-sm text-muted mb-4 max-w-2xl leading-relaxed">
          {lang === "ar"
            ? "منصة تعتمد على الزائر الدولي كانت ستفقد جزءًا من سوقها في ربع واحد دون أي خطأ منها."
            : "A platform depending on international arrivals would have lost part of its market in a single quarter through no fault of its own."}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DIVERGENCE.map((d) => (
            <div
              key={d.tone}
              className={`card p-5 ${
                d.tone === "up"
                  ? "border-palm/30 bg-palm-soft/40"
                  : "border-[#e4c6c6] bg-[#fdf7f7]"
              }`}
            >
              <p className="text-sm font-semibold">{pick(d.label, lang)}</p>
              <p
                className={`text-3xl font-extrabold mt-1 ${
                  d.tone === "up" ? "text-palm" : "text-[#a33a3a]"
                }`}
                dir="ltr"
              >
                {d.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Competitors */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-4">
          {lang === "ar" ? "المشهد التنافسي" : "The competitive set"}
        </h2>
        <div className="space-y-3">
          {COMPETITORS.map((c, i) => (
            <div key={i} className="card p-5">
              <h3
                className="font-bold"
                dir={typeof c.name === "string" ? "ltr" : undefined}
              >
                {typeof c.name === "string" ? c.name : pick(c.name, lang)}
              </h3>
              <p className="text-sm mt-1.5">{pick(c.what, lang)}</p>
              <p className="text-sm text-muted mt-1.5">
                <span className="font-semibold text-clay">
                  {lang === "ar" ? "الفجوة: " : "Gap: "}
                </span>
                {pick(c.gap, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiators */}
      <section className="mt-12">
        <h2 className="text-xl font-extrabold mb-4">
          {lang === "ar" ? "لماذا نحن" : "Why us"}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {DIFFERENTIATORS.map((d) => (
            <div key={d.title.en} className="card p-5">
              <h3 className="font-bold mb-2">{pick(d.title, lang)}</h3>
              <p className="text-sm text-muted leading-relaxed">
                {pick(d.body, lang)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-muted mt-12 leading-relaxed">
        {lang === "ar"
          ? "المصادر: التقرير الإحصائي السنوي 2025 لوزارة السياحة، وبيانات الربع الأول 2026، وهيئة التراث، ومنصة أبدع. التفاصيل الكاملة في docs/market-research.md."
          : "Sources: Ministry of Tourism 2025 Annual Statistical Report, Q1 2026 data, Heritage Commission, Abde'a platform. Full detail in docs/market-research.md."}
      </p>
    </div>
  );
}
