/** Core domain types for the Rattib demo. Mirrors docs/product-brief.md §4. */

export type Lang = "ar" | "en";

/** Bilingual string. Every piece of user-facing content carries both. */
export type Bi = { ar: string; en: string };

export type Persona = "customer" | "expert";

/**
 * Who an experience is open to. Not a boolean — see product brief §2.1.
 * Gender lock is a supply-side unlock: many hosts list only if a
 * women-only room is guaranteed.
 */
export type AudiencePolicy =
  | "mixed"
  | "women_only"
  | "men_only"
  | "families_only"
  | "private_buyout";

export type Gender = "female" | "male";

export type CategoryId =
  | "pottery"
  | "bakery"
  | "sadu"
  | "coffee"
  | "calligraphy"
  | "perfume"
  | "poetry"
  | "khoos"
  | "tours";

/** Credential layers — see product brief §2.2. */
export type CredentialLayer = "identity" | "activity";

export type CredentialType =
  // layer 1 — economic identity, one of these is always required
  | "cr"
  | "freelance_doc"
  // layer 2 — activity licence, depends on category
  | "abdea_craft"
  | "municipal_craft"
  | "food_health"
  | "mt_tourism"
  | "tour_guide";

export type VerificationState = "pending" | "verified" | "rejected" | "expired";

export interface HostCredential {
  id: string;
  expertId: string;
  type: CredentialType;
  layer: CredentialLayer;
  number: string;
  issuingBody: Bi;
  issuedAt: string;
  expiresAt: string;
  state: VerificationState;
}

export interface Expert {
  id: string;
  name: Bi;
  initials: string;
  bio: Bi;
  gender: Gender;
  district: Bi;
  languages: Lang[];
  rating: number;
  reviewCount: number;
  sessionsHosted: number;
  hostingSince: number;
  nafathVerified: boolean;
  responseMinutes: number;
}

export type ExperienceStatus =
  | "draft"
  | "blocked"
  | "in_review"
  | "published"
  | "paused";

export interface Experience {
  id: string;
  expertId: string;
  title: Bi;
  tagline: Bi;
  description: Bi;
  category: CategoryId;
  district: Bi;
  lat: number;
  lon: number;
  durationMin: number;
  seatsMin: number;
  seatsMax: number;
  pricePerSeat: number;
  audiencePolicy: AudiencePolicy;
  minAge: number;
  toolsProvided: Bi[];
  toolsRequired: Bi[];
  /** Response window for request-to-book, in hours. */
  responseSlaHours: number;
  /** Full refund if cancelled at least this many hours ahead. */
  freeCancelHours: number;
  bookingMode: "instant" | "request";
  status: ExperienceStatus;
  /** Set when status is `blocked` — the credential the host is missing. */
  blockedOn?: CredentialType;
}

export interface Slot {
  id: string;
  experienceId: string;
  startsAt: string;
  seatsTotal: number;
  seatsTaken: number;
}

export type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled"
  | "completed";

export interface Guest {
  name: string;
  gender: Gender;
  verified: boolean;
}

export type PaymentMethod = "mada" | "applepay" | "stcpay" | "tabby";

export interface Booking {
  id: string;
  slotId: string;
  experienceId: string;
  seats: number;
  guests: Guest[];
  amount: number;
  serviceFee: number;
  status: BookingStatus;
  method: PaymentMethod;
  requestedAt: string;
  /** Deadline for the expert to respond, derived from responseSlaHours. */
  respondBy: string;
  respondedAt?: string;
  checkinCode: string;
  /** Set when the expert rejects, shown to the customer. */
  rejectionReason?: Bi;
}
