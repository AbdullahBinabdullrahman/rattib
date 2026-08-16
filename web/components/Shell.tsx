"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useDemo } from "@/lib/store";
import { t } from "@/lib/i18n";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
        active
          ? "bg-palm-soft text-palm"
          : "text-muted hover:text-ink hover:bg-sand-deep"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { lang, setLang, persona, setPersona, viewerGender, setViewerGender } =
    useDemo();

  return (
    <>
      <div className="bg-palm-deep text-white/85 text-[11px] text-center py-1.5 px-4">
        {t("demoBanner", lang)}
      </div>

      <header className="sticky top-0 z-40 bg-sand/85 backdrop-blur border-b border-line">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-palm text-white font-bold text-lg leading-none">
              ر
            </span>
            <span className="font-extrabold text-lg tracking-tight">
              {t("brand", lang)}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/explore" label={t("navExplore", lang)} />
            {persona === "customer" ? (
              <NavLink href="/bookings" label={t("navBookings", lang)} />
            ) : (
              <NavLink href="/expert" label={t("navExpert", lang)} />
            )}
            <NavLink href="/market" label={t("navMarket", lang)} />
            <NavLink href="/economics" label={t("navEconomics", lang)} />
          </nav>

          <div className="ms-auto flex items-center gap-2">
            {/* Persona switcher — the demo has no auth. */}
            <div className="hidden sm:flex items-center rounded-xl border border-line bg-surface p-0.5">
              {(["customer", "expert"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPersona(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    persona === p
                      ? "bg-palm text-white"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {t(p === "customer" ? "customer" : "expert", lang)}
                </button>
              ))}
            </div>

            {/* The viewer's verified gender drives audience-policy filtering. */}
            {persona === "customer" && (
              <div className="hidden sm:flex items-center rounded-xl border border-line bg-surface p-0.5">
                {(["female", "male"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setViewerGender(g)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      viewerGender === g
                        ? "bg-rose text-white"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {t(g === "female" ? "female" : "male", lang)}
                  </button>
                ))}
              </div>
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

        {/* Mobile nav */}
        <div className="md:hidden border-t border-line px-4 py-2 flex gap-1 overflow-x-auto">
          <NavLink href="/explore" label={t("navExplore", lang)} />
          {persona === "customer" ? (
            <NavLink href="/bookings" label={t("navBookings", lang)} />
          ) : (
            <NavLink href="/expert" label={t("navExpert", lang)} />
          )}
          <NavLink href="/market" label={t("navMarket", lang)} />
          <NavLink href="/economics" label={t("navEconomics", lang)} />
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between">
          <span>
            {t("brand", lang)} · {t("tagline", lang)}
          </span>
          <span dir="ltr">Gregorian · Asia/Riyadh · SAR</span>
        </div>
      </footer>
    </>
  );
}
