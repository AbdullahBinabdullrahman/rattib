/**
 * Minimal stand-ins for the Next.js APIs the pages use, so the whole app can
 * be bundled into one self-contained HTML file with no server.
 *
 * Routing moves to the URL hash (#/explore, #/experience/x1) because a single
 * static file has no server to resolve real paths against.
 *
 * esbuild aliases "next/link" and "next/navigation" to this module.
 */

import {
  createContext,
  createElement,
  useContext,
  useSyncExternalStore,
  type AnchorHTMLAttributes,
  type ReactNode,
} from "react";

/* ---------------------------------------------------------------- */
/* Path store                                                        */
/* ---------------------------------------------------------------- */

const listeners = new Set<() => void>();

function readHash(): string {
  if (typeof window === "undefined") return "/";
  const h = window.location.hash.replace(/^#/, "");
  return h.startsWith("/") ? h : "/";
}

let snapshot = readHash();

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    snapshot = readHash();
    for (const l of listeners) l();
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return snapshot;
}

export function usePathname(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function navigate(path: string) {
  window.location.hash = path;
  // Each route change starts at the top, matching normal page navigation.
  window.scrollTo({ top: 0, behavior: "auto" });
}

export function useRouter() {
  return {
    push: navigate,
    replace: navigate,
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  };
}

/* ---------------------------------------------------------------- */
/* Route params                                                      */
/* ---------------------------------------------------------------- */

export const ParamsContext = createContext<Record<string, string>>({});

export function useParams<T = Record<string, string>>(): T {
  return useContext(ParamsContext) as T;
}

export function useSearchParams() {
  return new URLSearchParams();
}

/* ---------------------------------------------------------------- */
/* Link                                                              */
/* ---------------------------------------------------------------- */

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
};

function Link({ href, children, prefetch, replace, scroll, ...rest }: LinkProps) {
  return createElement(
    "a",
    {
      ...rest,
      href: `#${href}`,
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        rest.onClick?.(e);
        if (e.defaultPrevented) return;
        // Let the hash change happen, then reset scroll position.
        requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
      },
    },
    children,
  );
}

export default Link;
