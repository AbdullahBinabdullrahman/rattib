/**
 * The eligibility engine. Two jobs, deliberately in one place:
 *
 *  1. Guest eligibility  — can this party sit in this experience?
 *     (audience policy + age, per product brief §2.1)
 *  2. Host eligibility   — may this experience be published at all?
 *     (three-layer credential model, per product brief §2.2)
 */

import type {
  AudiencePolicy,
  Bi,
  CategoryId,
  CredentialType,
  Gender,
  Guest,
  HostCredential,
} from "./types";

/* ------------------------------------------------------------------ */
/* 1. Guest eligibility                                                */
/* ------------------------------------------------------------------ */

/** Policies that constrain who may sit in the room. */
export const LOCKED_POLICIES: AudiencePolicy[] = [
  "women_only",
  "men_only",
  "families_only",
];

export function isLocked(policy: AudiencePolicy): boolean {
  return LOCKED_POLICIES.includes(policy);
}

/**
 * A locked experience requires a verified identity, otherwise one
 * verified woman could book four seats for any group at all.
 */
export function requiresVerifiedIdentity(policy: AudiencePolicy): boolean {
  return isLocked(policy);
}

export type GuestCheck = { ok: true } | { ok: false; reason: Bi };

/** Checks a single guest against the policy. */
export function checkGuest(
  policy: AudiencePolicy,
  guest: Guest,
): GuestCheck {
  if (requiresVerifiedIdentity(policy) && !guest.verified) {
    return {
      ok: false,
      reason: {
        ar: "يتطلب التحقق من الهوية",
        en: "Requires a verified identity",
      },
    };
  }

  switch (policy) {
    case "women_only":
      return guest.gender === "female"
        ? { ok: true }
        : {
            ok: false,
            reason: {
              ar: "هذه التجربة للنساء فقط",
              en: "This experience is for women only",
            },
          };
    case "men_only":
      return guest.gender === "male"
        ? { ok: true }
        : {
            ok: false,
            reason: {
              ar: "هذه التجربة للرجال فقط",
              en: "This experience is for men only",
            },
          };
    default:
      return { ok: true };
  }
}

/**
 * Checks the whole party. `families_only` is a group-composition rule
 * rather than a per-person one: women and mixed family groups are
 * welcome, a group of only men is not.
 */
export function checkParty(
  policy: AudiencePolicy,
  guests: Guest[],
): GuestCheck {
  if (guests.length === 0) {
    return {
      ok: false,
      reason: { ar: "أضف ضيفًا واحدًا على الأقل", en: "Add at least one guest" },
    };
  }

  if (policy === "families_only") {
    if (requiresVerifiedIdentity(policy) && guests.some((g) => !g.verified)) {
      return {
        ok: false,
        reason: {
          ar: "يتطلب التحقق من الهوية",
          en: "Requires a verified identity",
        },
      };
    }
    const allMen = guests.every((g) => g.gender === "male");
    return allMen
      ? {
          ok: false,
          reason: {
            ar: "قسم العائلات — لا يُسمح بدخول الرجال بمفردهم",
            en: "Families section — unaccompanied men are not admitted",
          },
        }
      : { ok: true };
  }

  for (const guest of guests) {
    const result = checkGuest(policy, guest);
    if (!result.ok) return result;
  }
  return { ok: true };
}

/**
 * Should this experience appear to this viewer?
 *
 * A null gender means nobody is signed in. Browsing then stays open — the
 * lock is enforced at booking, where identity is actually checked — so a
 * visitor is never asked to declare a gender just to look around.
 */
export function canBrowserBook(
  policy: AudiencePolicy,
  gender: Gender | null,
): boolean {
  if (gender === null) return true;
  if (policy === "women_only") return gender === "female";
  if (policy === "men_only") return gender === "male";
  return true;
}

/* ------------------------------------------------------------------ */
/* 2. Host eligibility — the credential matrix                         */
/* ------------------------------------------------------------------ */

/**
 * Category → required activity credentials.
 *
 * Held as configuration precisely because it will change as regulation
 * does. Layer 1 (CR or freelance certificate) is required for every
 * category and is checked separately.
 */
export const CATEGORY_RULES: Record<CategoryId, CredentialType[]> = {
  pottery: ["abdea_craft"],
  sadu: ["abdea_craft"],
  khoos: ["abdea_craft"],
  calligraphy: ["abdea_craft"],
  perfume: ["abdea_craft"],
  poetry: [],
  bakery: ["food_health"],
  coffee: ["food_health"],
  // Guided tours are the heavy end of the regime — deliberately gated.
  tours: ["mt_tourism", "tour_guide"],
};

export const IDENTITY_CREDENTIALS: CredentialType[] = ["cr", "freelance_doc"];

export interface HostEligibility {
  ok: boolean;
  /** Layer 1 satisfied — the host is a legal economic counterparty. */
  hasIdentity: boolean;
  /** Layer 2 credentials still missing for this category. */
  missing: CredentialType[];
  /** Held but lapsed — listing auto-pauses rather than staying live. */
  expired: CredentialType[];
}

export function checkHost(
  category: CategoryId,
  credentials: HostCredential[],
): HostEligibility {
  const usable = credentials.filter((c) => c.state === "verified");
  const held = new Set(usable.map((c) => c.type));

  const hasIdentity = IDENTITY_CREDENTIALS.some((t) => held.has(t));
  const required = CATEGORY_RULES[category] ?? [];
  const missing = required.filter((t) => !held.has(t));

  const expired = credentials
    .filter(
      (c) =>
        c.state === "expired" &&
        (IDENTITY_CREDENTIALS.includes(c.type) || required.includes(c.type)),
    )
    .map((c) => c.type);

  return {
    ok: hasIdentity && missing.length === 0 && expired.length === 0,
    hasIdentity,
    missing,
    expired,
  };
}
