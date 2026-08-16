"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDemo } from "@/lib/store";
import { t } from "@/lib/i18n";
import type { Gender, Persona } from "@/lib/types";

/**
 * Sign in and sign up for both sides of the marketplace.
 *
 * Demo-only: no backend, no password is stored, and "Nafath" simply flips a
 * verified flag. The flow is modelled faithfully though — role is chosen at
 * signup because it determines which portal you land in, and identity
 * verification is deliberately separate from having an account, since only
 * audience-locked bookings require it.
 */
export default function Auth() {
  const router = useRouter();
  const { lang, signIn } = useDemo();

  const [mode, setMode] = useState<"in" | "up">("up");
  const [role, setRole] = useState<Persona>("customer");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender>("female");
  const [busy, setBusy] = useState(false);

  const complete =
    contact.trim().length > 2 &&
    password.length > 0 &&
    (mode === "in" || name.trim().length > 1);

  const finish = (nafathVerified: boolean) => {
    setBusy(true);
    setTimeout(() => {
      signIn({
        name: name.trim() || (lang === "ar" ? "ضيف" : "Guest"),
        role,
        gender,
        nafathVerified,
        contact: contact.trim() || "—",
      });
      router.push(role === "expert" ? "/expert" : "/explore");
    }, 550);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center mb-8">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brass text-[#16120a] font-extrabold text-2xl mx-auto mb-5">
          ر
        </span>
        <h1 className="text-3xl font-extrabold">
          {t(mode === "in" ? "authTitleIn" : "authTitleUp", lang)}
        </h1>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          {t(mode === "in" ? "authSubIn" : "authSubUp", lang)}
        </p>
      </div>

      {/* Role — chosen first, because it decides which portal you land in. */}
      {mode === "up" && (
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {(
            [
              { value: "customer", title: "iAmCustomer", note: "iAmCustomerNote", icon: "◍" },
              { value: "expert", title: "iAmExpert", note: "iAmExpertNote", icon: "✦" },
            ] as const
          ).map((r) => (
            <button
              key={r.value}
              onClick={() => setRole(r.value)}
              className={`card card-hover p-4 text-start ${
                role === r.value ? "!border-brass" : ""
              }`}
            >
              <span
                className={`grid place-items-center w-9 h-9 rounded-xl text-lg ${
                  role === r.value
                    ? "bg-brass text-[#16120a]"
                    : "bg-panel-2 text-muted"
                }`}
              >
                {r.icon}
              </span>
              <span className="font-bold block mt-3">{t(r.title, lang)}</span>
              <span className="text-xs text-muted block mt-1 leading-relaxed">
                {t(r.note, lang)}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="card p-6">
        {/* Nafath first — it is how Saudi services actually authenticate. */}
        <button
          onClick={() => finish(true)}
          disabled={busy}
          className="btn w-full !py-3 bg-nafath text-white hover:brightness-110"
        >
          {t("nafathSignIn", lang)}
        </button>
        <p className="text-[11px] text-muted mt-2.5 leading-relaxed">
          {t("nafathNote", lang)}
        </p>

        <div className="flex items-center gap-3 my-6">
          <span className="h-px bg-line flex-1" />
          <span className="text-[11px] text-faint font-semibold">
            {t("orUse", lang)}
          </span>
          <span className="h-px bg-line flex-1" />
        </div>

        <div className="space-y-4">
          {mode === "up" && (
            <div>
              <span className="label">{t("fullName", lang)}</span>
              <input
                className="field"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}

          <div>
            <span className="label">{t("emailOrPhone", lang)}</span>
            <input
              className="field"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              autoComplete="username"
              dir="ltr"
            />
          </div>

          <div>
            <span className="label">{t("password", lang)}</span>
            <input
              className="field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
              dir="ltr"
            />
          </div>

          {mode === "up" && role === "customer" && (
            <div>
              <span className="label">{t("genderField", lang)}</span>
              <div className="flex rounded-xl border border-line overflow-hidden w-fit">
                {(["female", "male"] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`px-5 py-2 text-sm font-semibold transition-colors ${
                      gender === g
                        ? g === "female"
                          ? "bg-rose text-white"
                          : "bg-palm text-[#08130f]"
                        : "bg-panel text-muted hover:text-fg"
                    }`}
                  >
                    {t(g === "female" ? "female" : "male", lang)}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted mt-2 leading-relaxed">
                {t("genderWhy", lang)}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => finish(false)}
          disabled={!complete || busy}
          className="btn btn-ghost w-full mt-6 !py-3"
        >
          {busy ? "…" : t(mode === "in" ? "signIn" : "signUp", lang)}
        </button>

        {mode === "up" && role === "expert" && (
          <p className="text-xs text-brass mt-4 leading-relaxed">
            {t("expertNextStep", lang)}
          </p>
        )}
      </div>

      <p className="text-center text-sm text-muted mt-6">
        {t(mode === "in" ? "noAccount" : "haveAccount", lang)}{" "}
        <button
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="text-brass font-bold hover:underline"
        >
          {t(mode === "in" ? "signUp" : "signIn", lang)}
        </button>
      </p>

      <p className="text-center text-[11px] text-faint mt-8 leading-relaxed">
        {t("demoModeNote", lang)}{" "}
        <Link href="/explore" className="underline hover:text-muted">
          {t("navExplore", lang)}
        </Link>
      </p>
    </div>
  );
}
