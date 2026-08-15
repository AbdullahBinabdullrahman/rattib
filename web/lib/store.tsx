"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  CREDENTIALS,
  DEMO_EXPERT_ID,
  EXPERIENCES,
  EXPERTS,
  buildSlots,
} from "./seed";
import type {
  Booking,
  Experience,
  Expert,
  Gender,
  Guest,
  HostCredential,
  Lang,
  PaymentMethod,
  Persona,
  Slot,
} from "./types";

const SERVICE_FEE_RATE = 0.12;

interface DemoState {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";

  persona: Persona;
  setPersona: (p: Persona) => void;

  /** The signed-in customer's verified gender — drives audience filtering. */
  viewerGender: Gender;
  setViewerGender: (g: Gender) => void;

  experts: Expert[];
  experiences: Experience[];
  slots: Slot[];
  credentials: HostCredential[];
  bookings: Booking[];

  /** Stable "now" that ticks each minute, so SLA countdowns move. */
  now: Date;
  mounted: boolean;

  expertById: (id: string) => Expert | undefined;
  experienceById: (id: string) => Experience | undefined;
  slotById: (id: string) => Slot | undefined;
  slotsFor: (experienceId: string) => Slot[];

  createBooking: (input: {
    slotId: string;
    guests: Guest[];
    method: PaymentMethod;
  }) => Booking;
  respondToBooking: (bookingId: string, accept: boolean) => void;
  cancelBooking: (bookingId: string) => void;

  addCredential: (type: HostCredential["type"]) => void;
  publishExperience: (exp: Experience) => void;
  serviceFeeRate: number;
}

const Ctx = createContext<DemoState | null>(null);

/**
 * Two inbound booking requests waiting on the demo expert, so the portal
 * opens with a live SLA clock rather than an empty state. Both sit against
 * her women-only pottery listing.
 */
function seedRequests(slots: Slot[]): Booking[] {
  const target = slots.filter((s) => s.experienceId === "x1").slice(0, 2);
  const exp = EXPERIENCES.find((e) => e.id === "x1")!;
  const now = Date.now();

  const parties: { guests: Guest[]; agoMin: number }[] = [
    {
      guests: [
        { name: "Reem A.", gender: "female", verified: true },
        { name: "Dana K.", gender: "female", verified: true },
      ],
      agoMin: 95,
    },
    {
      guests: [{ name: "Aisha M.", gender: "female", verified: true }],
      agoMin: 20,
    },
  ];

  return target.map((slot, i) => {
    const p = parties[i] ?? parties[0];
    const requestedAt = new Date(now - p.agoMin * 60_000);
    return {
      id: `seed-${i}`,
      slotId: slot.id,
      experienceId: exp.id,
      seats: p.guests.length,
      guests: p.guests,
      amount: exp.pricePerSeat * p.guests.length,
      serviceFee: Math.round(exp.pricePerSeat * p.guests.length * SERVICE_FEE_RATE),
      status: "pending",
      method: "mada",
      requestedAt: requestedAt.toISOString(),
      respondBy: new Date(
        requestedAt.getTime() + exp.responseSlaHours * 3600_000,
      ).toISOString(),
      checkinCode: i === 0 ? "K7QP" : "M2WD",
    };
  });
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [persona, setPersona] = useState<Persona>("customer");
  const [viewerGender, setViewerGender] = useState<Gender>("female");
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const [experiences, setExperiences] = useState<Experience[]>(EXPERIENCES);
  const [credentials, setCredentials] = useState<HostCredential[]>(CREDENTIALS);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Slots are time-relative, so they are built after mount to keep the
  // server and client markup identical. Two inbound requests are seeded
  // against them so the expert portal has something to act on.
  useEffect(() => {
    const built = buildSlots(new Date());
    setSlots(built);
    setBookings(seedRequests(built));
    setMounted(true);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // Requests that blow through their SLA window auto-expire and refund.
  useEffect(() => {
    setBookings((prev) => {
      let changed = false;
      const next = prev.map((b) => {
        if (b.status === "pending" && new Date(b.respondBy) <= now) {
          changed = true;
          return { ...b, status: "expired" as const };
        }
        return b;
      });
      return changed ? next : prev;
    });
  }, [now]);

  const expertById = useCallback(
    (id: string) => EXPERTS.find((e) => e.id === id),
    [],
  );
  const experienceById = useCallback(
    (id: string) => experiences.find((e) => e.id === id),
    [experiences],
  );
  const slotById = useCallback(
    (id: string) => slots.find((s) => s.id === id),
    [slots],
  );
  const slotsFor = useCallback(
    (experienceId: string) => slots.filter((s) => s.experienceId === experienceId),
    [slots],
  );

  const createBooking = useCallback(
    ({
      slotId,
      guests,
      method,
    }: {
      slotId: string;
      guests: Guest[];
      method: PaymentMethod;
    }) => {
      const slot = slots.find((s) => s.id === slotId)!;
      const exp = experiences.find((e) => e.id === slot.experienceId)!;
      const seats = guests.length;
      const amount = exp.pricePerSeat * seats;
      const serviceFee = Math.round(amount * SERVICE_FEE_RATE);
      const at = new Date();

      const booking: Booking = {
        id: `b${Math.random().toString(36).slice(2, 8)}`,
        slotId,
        experienceId: exp.id,
        seats,
        guests,
        amount,
        serviceFee,
        status: exp.bookingMode === "instant" ? "accepted" : "pending",
        method,
        requestedAt: at.toISOString(),
        respondBy: new Date(
          at.getTime() + exp.responseSlaHours * 3600_000,
        ).toISOString(),
        respondedAt:
          exp.bookingMode === "instant" ? at.toISOString() : undefined,
        checkinCode: Math.random().toString(36).slice(2, 6).toUpperCase(),
      };

      setBookings((prev) => [booking, ...prev]);
      setSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, seatsTaken: s.seatsTaken + seats } : s,
        ),
      );
      return booking;
    },
    [slots, experiences],
  );

  const respondToBooking = useCallback((bookingId: string, accept: boolean) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: accept ? "accepted" : "rejected",
              respondedAt: new Date().toISOString(),
              rejectionReason: accept
                ? undefined
                : {
                    ar: "المقاعد لم تعد متاحة في هذا الموعد",
                    en: "The seats are no longer available at this time",
                  },
            }
          : b,
      ),
    );
    if (!accept) {
      setBookings((prev) => {
        const b = prev.find((x) => x.id === bookingId);
        if (b) {
          setSlots((s) =>
            s.map((slot) =>
              slot.id === b.slotId
                ? { ...slot, seatsTaken: Math.max(0, slot.seatsTaken - b.seats) }
                : slot,
            ),
          );
        }
        return prev;
      });
    }
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: "cancelled" } : b)),
    );
  }, []);

  const addCredential = useCallback((type: HostCredential["type"]) => {
    setCredentials((prev) => {
      if (prev.some((c) => c.type === type && c.state === "verified")) return prev;
      const cred: HostCredential = {
        id: `c${Math.random().toString(36).slice(2, 7)}`,
        expertId: DEMO_EXPERT_ID,
        type,
        layer: type === "cr" || type === "freelance_doc" ? "identity" : "activity",
        number: `NEW-${Math.floor(Math.random() * 90000 + 10000)}`,
        issuingBody: { ar: "جهة الإصدار", en: "Issuing body" },
        issuedAt: new Date().toISOString().slice(0, 10),
        expiresAt: new Date(Date.now() + 730 * 86_400_000)
          .toISOString()
          .slice(0, 10),
        state: "verified",
      };
      return [...prev.filter((c) => !(c.type === type)), cred];
    });

    // A newly held licence unblocks anything that was gated on it.
    setExperiences((prev) =>
      prev.map((e) =>
        e.status === "blocked" && e.blockedOn === type
          ? { ...e, status: "in_review", blockedOn: undefined }
          : e,
      ),
    );
  }, []);

  const publishExperience = useCallback((exp: Experience) => {
    setExperiences((prev) => [exp, ...prev]);
  }, []);

  const value = useMemo<DemoState>(
    () => ({
      lang,
      setLang,
      dir,
      persona,
      setPersona,
      viewerGender,
      setViewerGender,
      experts: EXPERTS,
      experiences,
      slots,
      credentials,
      bookings,
      now,
      mounted,
      expertById,
      experienceById,
      slotById,
      slotsFor,
      createBooking,
      respondToBooking,
      cancelBooking,
      addCredential,
      publishExperience,
      serviceFeeRate: SERVICE_FEE_RATE,
    }),
    [
      lang,
      dir,
      persona,
      viewerGender,
      experiences,
      slots,
      credentials,
      bookings,
      now,
      mounted,
      expertById,
      experienceById,
      slotById,
      slotsFor,
      createBooking,
      respondToBooking,
      cancelBooking,
      addCredential,
      publishExperience,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo(): DemoState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useDemo must be used inside <DemoProvider>");
  return ctx;
}
