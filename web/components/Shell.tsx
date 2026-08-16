"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useDemo } from "@/lib/store";
import { t } from "@/lib/i18n";
import { PageTransition } from "./motion";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`relative px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        active ? "text-brass" : "text-muted hover:text-fg"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-3 -bottom-px h-px bg-brass transition-transform duration-300 origin-center ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  tone = "brass",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  tone?: "brass" | "rose";
}) {
  const on = tone === "rose" ? "bg-rose text-white" : "bg-brass text-[#16120a]";
  return (
    <div className="hidden sm:flex items-center rounded-xl border border-line bg-panel p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            value === o.value ? on : "text-muted hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const {
    lang,
    setLang,
    persona,
    setPersona,
    viewerGender,
    setViewerGender,
    session,
    signOut,
    verifyIdentity,
  } = useDemo();

  const [menu, setMenu] = useState(false);

  const nav = (
    <>
      <NavLink href="/explore" label={t("navExplore", lang)} />
      {persona === "customer" ? (
        <NavLink href="/bookings" label={t("navBookings", lang)} />
      ) : (
        <NavLink href="/expert" label={t("navExpert", lang)} />
      )}
      <NavLink href="/market" label={t("navMarket", lang)} />
      <NavLink href="/economics" label={t("navEconomics", lang)} />
    </>
  );

  return (
    <>
      <div className="bg-base-2 text-faint text-[11px] text-center py-1.5 px-4 border-b border-line-soft">
        {t("demoBanner", lang)}
      </div>

      <header className="sticky top-0 z-40 bg-base/80 backdrop-blur-xl border-b border-line">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-brass text-[#16120a] font-extrabold text-lg leading-none transition-transform duration-300 group-hover:rotate-6">
              ر
            </span>
            <span className="font-extrabold text-lg">{t("brand", lang)}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">{nav}</nav>

          <div className="ms-auto flex items-center gap-2">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setMenu((m) => !m)}
                  className="flex items-center gap-2 rounded-xl border border-line bg-panel ps-1 pe-2.5 py-1 hover:border-brass transition-colors"
                >
                  <span
                    className={`grid place-items-center w-7 h-7 rounded-lg text-xs font-bold ${
                      session.role === "expert"
                        ? "bg-brass text-[#16120a]"
                        : "bg-panel-2 text-fg"
                    }`}
                  >
                    {session.name.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold max-w-[7rem] truncate">
                    {session.name}
                  </span>
                </button>

                {menu && (
                  <div
                    className="absolute end-0 mt-2 w-60 card p-3 z-50"
                    onMouseLeave={() => setMenu(false)}
                  >
                    <p className="text-xs text-muted">
                      {t(session.role === "expert" ? "expert" : "customer", lang)}
                    </p>
                    <p className="font-semibold text-sm truncate" dir="ltr">
                      {session.contact}
                    </p>

                    <div className="mt-3 pt-3 hairline">
                      {session.identityVerified ? (
                        <span className="chip bg-palm-soft text-palm">
                          ✓ {t("identityVerified", lang)}
                        </span>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <span className="chip bg-panel-2 text-muted">
                            {t("notVerified", lang)}
                          </span>
                          <button
                            onClick={verifyIdentity}
                            className="btn !py-1 !px-2.5 !text-[11px] bg-verify text-white"
                          >
                            {t("verifyNow", lang)}
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        signOut();
                        setMenu(false);
                      }}
                      className="btn btn-ghost w-full mt-3 !py-1.5 !text-xs"
                    >
                      {t("signOut", lang)}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Signed out, the demo switchers stand in for accounts. */}
                <Segmented
                  value={persona}
                  onChange={setPersona}
                  options={[
                    { value: "customer" as const, label: t("customer", lang) },
                    { value: "expert" as const, label: t("expert", lang) },
                  ]}
                />
                {persona === "customer" && (
                  <Segmented
                    tone="rose"
                    value={viewerGender}
                    onChange={setViewerGender}
                    options={[
                      { value: "female" as const, label: t("female", lang) },
                      { value: "male" as const, label: t("male", lang) },
                    ]}
                  />
                )}
                <Link
                  href="/auth"
                  className="btn btn-primary !py-1.5 !px-3 !text-xs"
                >
                  {t("signIn", lang)}
                </Link>
              </>
            )}

            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="btn btn-ghost !py-1.5 !px-3 !text-xs"
              aria-label="Toggle language"
            >
              {lang === "ar" ? "EN" : "عربي"}
            </button>
          </div>
        </div>

        <div className="md:hidden border-t border-line-soft px-4 py-2 flex gap-1 overflow-x-auto">
          {nav}
        </div>
      </header>

      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>

      <footer className="border-t border-line mt-20">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-faint flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            {t("brand", lang)} · {t("tagline", lang)}
          </span>
          <span dir="ltr" className="tnum">
            Gregorian · Asia/Riyadh · SAR
          </span>
        </div>
      </footer>
    </>
  );
}
