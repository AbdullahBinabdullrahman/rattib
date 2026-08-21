"use client";

import Link from "next/link";
import { useDemo } from "@/lib/store";
import { CREDENTIAL_LABEL, pick, t } from "@/lib/i18n";
import { DEMO_EXPERT_ID } from "@/lib/seed";
import type { CredentialType, HostCredential, Lang } from "@/lib/types";
import { IDENTITY_CREDENTIALS } from "@/lib/eligibility";

const ACTIVITY_CREDENTIALS: CredentialType[] = [
  "abdea_craft",
  "municipal_craft",
  "food_health",
  "mt_tourism",
  "tour_guide",
];

export default function Credentials() {
  const { lang, credentials, addCredential } = useDemo();
  const mine = credentials.filter((c) => c.expertId === DEMO_EXPERT_ID);

  const held = (type: CredentialType) => mine.find((c) => c.type === type);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/expert"
        className="text-sm text-muted hover:text-fg font-semibold"
      >
        ← {t("backTo", lang)} {t("expertDash", lang)}
      </Link>

      <h1 className="text-3xl font-extrabold tracking-tight mt-4 mb-2">
        {t("myCredentials", lang)}
      </h1>
      <p className="text-sm text-muted mb-8 leading-relaxed max-w-xl">
        {t("gateExplainer", lang)}
      </p>

      <Layer
        title={t("credLayer1", lang)}
        note={t("credLayer1Note", lang)}
        types={IDENTITY_CREDENTIALS}
        held={held}
        add={addCredential}
        lang={lang}
        tone="palm"
      />

      <div className="rounded-xl bg-palm-soft text-palm p-4 text-sm font-semibold my-6">
        {t("getFreelanceDoc", lang)}
      </div>

      <Layer
        title={t("credLayer2", lang)}
        note={t("credLayer2Note", lang)}
        types={ACTIVITY_CREDENTIALS}
        held={held}
        add={addCredential}
        lang={lang}
        tone="brass"
      />
    </div>
  );
}

function Layer({
  title,
  note,
  types,
  held,
  add,
  lang,
  tone,
}: {
  title: string;
  note: string;
  types: CredentialType[];
  held: (t: CredentialType) => HostCredential | undefined;
  add: (t: CredentialType) => void;
  lang: Lang;
  tone: "palm" | "brass";
}) {
  return (
    <section className="mb-8">
      <div className="flex items-baseline gap-3 flex-wrap mb-1">
        <h2 className="font-extrabold text-lg">{title}</h2>
      </div>
      <p className="text-sm text-muted mb-4">{note}</p>

      <div className="space-y-2">
        {types.map((type) => {
          const cred = held(type);
          const verified = cred?.state === "verified";
          const expired = cred?.state === "expired";

          return (
            <div
              key={type}
              className={`card p-4 flex items-center justify-between gap-3 flex-wrap ${
                expired ? "border-danger-line bg-danger-soft" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">
                    {pick(CREDENTIAL_LABEL[type], lang)}
                  </span>
                  {verified && (
                    <span className="chip bg-palm-soft text-palm">
                      ✓ {lang === "ar" ? "موثّق" : "Verified"}
                    </span>
                  )}
                  {expired && (
                    <span className="chip bg-danger-soft text-danger">
                      {lang === "ar" ? "منتهية" : "Expired"}
                    </span>
                  )}
                </div>
                {cred && (
                  <p className="text-xs text-muted mt-1">
                    <span dir="ltr">{cred.number}</span> ·{" "}
                    {pick(cred.issuingBody, lang)} · {t("expiresOn", lang)}{" "}
                    <span dir="ltr">{cred.expiresAt}</span>
                  </p>
                )}
              </div>

              {!verified && (
                <button
                  onClick={() => add(type)}
                  className={`btn !py-1.5 !px-3 !text-xs ${
                    tone === "palm" ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {expired
                    ? lang === "ar"
                      ? "تجديد"
                      : "Renew"
                    : t("addCredential", lang)}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
