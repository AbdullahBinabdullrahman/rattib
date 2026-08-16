/**
 * Entry point for the single-file build. Mirrors app/layout.tsx (provider +
 * shell) and replaces the Next.js file-system router with a small matcher
 * over the same route table.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { DemoProvider } from "@/lib/store";
import Shell from "@/components/Shell";
import { ParamsContext, usePathname } from "./next-shims";

import Home from "@/app/page";
import Explore from "@/app/explore/page";
import ExperienceDetail from "@/app/experience/[id]/page";
import BookPage from "@/app/book/[slotId]/page";
import Bookings from "@/app/bookings/page";
import ExpertDashboard from "@/app/expert/page";
import Credentials from "@/app/expert/credentials/page";
import NewExperience from "@/app/expert/new/page";
import Market from "@/app/market/page";
import Economics from "@/app/economics/page";
import Auth from "@/app/auth/page";

type Route = { pattern: string; component: React.ComponentType };

/** Static routes are listed first so /expert never shadows /expert/new. */
const ROUTES: Route[] = [
  { pattern: "/", component: Home },
  { pattern: "/explore", component: Explore },
  { pattern: "/bookings", component: Bookings },
  { pattern: "/market", component: Market },
  { pattern: "/economics", component: Economics },
  { pattern: "/auth", component: Auth },
  { pattern: "/expert", component: ExpertDashboard },
  { pattern: "/expert/credentials", component: Credentials },
  { pattern: "/expert/new", component: NewExperience },
  { pattern: "/experience/:id", component: ExperienceDetail },
  { pattern: "/book/:slotId", component: BookPage },
];

function match(
  path: string,
): { component: React.ComponentType; params: Record<string, string> } | null {
  const segments = path.split("/").filter(Boolean);

  for (const route of ROUTES) {
    const patternSegments = route.pattern.split("/").filter(Boolean);
    if (patternSegments.length !== segments.length) continue;

    const params: Record<string, string> = {};
    let ok = true;

    for (let i = 0; i < patternSegments.length; i++) {
      const p = patternSegments[i];
      if (p.startsWith(":")) {
        params[p.slice(1)] = decodeURIComponent(segments[i]);
      } else if (p !== segments[i]) {
        ok = false;
        break;
      }
    }

    if (ok) return { component: route.component, params };
  }
  return null;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24 text-center">
      <p className="text-muted">
        Page not found ·{" "}
        <a href="#/explore" className="text-palm font-semibold">
          Explore
        </a>
      </p>
    </div>
  );
}

function Router() {
  const pathname = usePathname();
  const matched = match(pathname);

  if (!matched) {
    return (
      <ParamsContext.Provider value={{}}>
        <NotFound />
      </ParamsContext.Provider>
    );
  }

  const Page = matched.component;
  return (
    <ParamsContext.Provider value={matched.params}>
      <Page />
    </ParamsContext.Provider>
  );
}

function App() {
  return (
    <DemoProvider>
      <Shell>
        <Router />
      </Shell>
    </DemoProvider>
  );
}

const container = document.getElementById("rattib-root");
if (container) {
  // Ensure there is always a hash, so the first render resolves to "/".
  if (!window.location.hash) window.location.hash = "/";
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
