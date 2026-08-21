/**
 * The unit-economics model behind docs/unit-economics.md.
 *
 * Kept as plain functions so the numbers on the investor page are computed,
 * not typed in — move a slider and every downstream figure follows.
 */

export interface Assumptions {
  /** Mean seat price, SAR. Demo catalogue ranges 150–450, mean 260. */
  seatPrice: number;
  /** Seats per booking. */
  partySize: number;
  /** Share of the base price taken from the host. */
  hostCommission: number;
  /** Share of the base price added as a guest service fee. */
  guestFee: number;
  /** Seat fill rate a host achieves selling by DM. */
  fillRateDm: number;
  /** Seat fill rate a host achieves on Rattib. */
  fillRateRattib: number;
  /** Blended customer acquisition cost, SAR. */
  cac: number;
  /** Bookings per customer per year. */
  bookingsPerYear: number;
}

export const BASE: Assumptions = {
  seatPrice: 260,
  partySize: 2.3,
  hostCommission: 0.15,
  guestFee: 0.1,
  fillRateDm: 0.45,
  fillRateRattib: 0.7,
  cac: 120,
  bookingsPerYear: 2.6,
};

/* ---------------------------------------------------------------- */
/* Payment processing — published Saudi gateway rates                */
/* ---------------------------------------------------------------- */

const METHOD_MIX = [
  { key: "mada", share: 0.55, rate: 0.0195, flat: 1 },
  { key: "card", share: 0.2, rate: 0.024, flat: 1 },
  { key: "stcpay", share: 0.1, rate: 0.02, flat: 1 },
  { key: "tabby", share: 0.15, rate: 0.045, flat: 1 },
];

export function processingCost(chargedToGuest: number): number {
  return METHOD_MIX.reduce(
    (sum, m) => sum + m.share * (chargedToGuest * m.rate + m.flat),
    0,
  );
}

/* ---------------------------------------------------------------- */
/* Per-booking                                                       */
/* ---------------------------------------------------------------- */

export interface BookingEconomics {
  gmv: number;
  chargedToGuest: number;
  paidToHost: number;
  hostCommission: number;
  guestFee: number;
  grossTake: number;
  processing: number;
  refunds: number;
  insurance: number;
  support: number;
  banking: number;
  totalCosts: number;
  contribution: number;
  /** Contribution as a share of net revenue. */
  contributionMargin: number;
  /** Blended take as a share of what the guest actually pays. */
  effectiveTakeRate: number;
}

export function perBooking(
  a: Assumptions,
  scale: "early" | "atScale" = "early",
): BookingEconomics {
  const gmv = a.seatPrice * a.partySize;
  const guestFee = gmv * a.guestFee;
  const chargedToGuest = gmv + guestFee;
  const hostCommission = gmv * a.hostCommission;
  const paidToHost = gmv - hostCommission;
  const grossTake = hostCommission + guestFee;

  const processing = processingCost(chargedToGuest);
  const refunds = 2;
  const insurance = scale === "early" ? 8 : 6;
  const support = scale === "early" ? 12 : 5;
  const banking = 2;
  const totalCosts = processing + refunds + insurance + support + banking;
  const contribution = grossTake - totalCosts;

  return {
    gmv,
    chargedToGuest,
    paidToHost,
    hostCommission,
    guestFee,
    grossTake,
    processing,
    refunds,
    insurance,
    support,
    banking,
    totalCosts,
    contribution,
    contributionMargin: grossTake > 0 ? contribution / grossTake : 0,
    effectiveTakeRate: chargedToGuest > 0 ? grossTake / chargedToGuest : 0,
  };
}

/* ---------------------------------------------------------------- */
/* The host case — fill rate is the whole argument                   */
/* ---------------------------------------------------------------- */

export interface HostCase {
  capacity: number;
  dmSeats: number;
  rattibSeats: number;
  dmNet: number;
  rattibNet: number;
  uplift: number;
}

export function hostCase(
  a: Assumptions,
  sessionsPerMonth = 8,
  seatsPerSession = 6,
): HostCase {
  const capacity = sessionsPerMonth * seatsPerSession;
  const dmSeats = capacity * a.fillRateDm;
  const rattibSeats = capacity * a.fillRateRattib;
  const dmNet = dmSeats * a.seatPrice;
  const rattibNet = rattibSeats * a.seatPrice * (1 - a.hostCommission);
  return {
    capacity,
    dmSeats,
    rattibSeats,
    dmNet,
    rattibNet,
    uplift: dmNet > 0 ? rattibNet / dmNet - 1 : 0,
  };
}

/* ---------------------------------------------------------------- */
/* Customer economics                                                */
/* ---------------------------------------------------------------- */

export interface CustomerEconomics {
  paybackBookings: number;
  ltv2y: number;
  ltvToCac: number;
}

export function customerEconomics(a: Assumptions): CustomerEconomics {
  const c = perBooking(a).contribution;
  const ltv2y = c * a.bookingsPerYear * 2;
  return {
    paybackBookings: c > 0 ? a.cac / c : Infinity,
    ltv2y,
    ltvToCac: a.cac > 0 ? ltv2y / a.cac : 0,
  };
}

/* ---------------------------------------------------------------- */
/* Three-year projection                                             */
/* ---------------------------------------------------------------- */

export interface YearPlan {
  year: 1 | 2 | 3;
  cities: number;
  avgActiveHosts: number;
  hostsAtYearEnd: number;
  fillRate: number;
  headcount: number;
  marketing: number;
  ga: number;
}

/** Fill rates ramp from the base case; Y1 sits below the steady state. */
export const PLAN: YearPlan[] = [
  {
    year: 1,
    cities: 1,
    avgActiveHosts: 85,
    hostsAtYearEnd: 180,
    fillRate: 0.55,
    headcount: 8,
    marketing: 1_200_000,
    ga: 600_000,
  },
  {
    year: 2,
    cities: 4,
    avgActiveHosts: 420,
    hostsAtYearEnd: 720,
    fillRate: 0.62,
    headcount: 22,
    marketing: 4_500_000,
    ga: 1_500_000,
  },
  {
    year: 3,
    cities: 8,
    avgActiveHosts: 1300,
    hostsAtYearEnd: 2100,
    fillRate: 0.66,
    headcount: 45,
    marketing: 9_000_000,
    ga: 3_000_000,
  },
];

const LOADED_COST_PER_HEAD = 350_000;
const SESSIONS_PER_HOST_MONTH = 6;
const SEATS_PER_SESSION = 6;

export interface YearResult {
  year: 1 | 2 | 3;
  cities: number;
  seats: number;
  gmv: number;
  netRevenue: number;
  contribution: number;
  opex: number;
  ebitda: number;
  headcount: number;
}

/**
 * `fillRateShift` moves every year's fill rate by the same amount, so the
 * page can show the sensitivity the docs describe.
 */
export function project(a: Assumptions, fillRateShift = 0): YearResult[] {
  return PLAN.map((p) => {
    const fill = Math.max(0.1, Math.min(0.95, p.fillRate + fillRateShift));
    const seats =
      p.avgActiveHosts * SESSIONS_PER_HOST_MONTH * SEATS_PER_SESSION * fill * 12;
    const gmv = seats * a.seatPrice;

    const bookings = seats / a.partySize;
    const unit = perBooking(a, p.year === 1 ? "early" : "atScale");
    const netRevenue = bookings * unit.grossTake;
    const contribution = bookings * unit.contribution;

    const opex = p.headcount * LOADED_COST_PER_HEAD + p.marketing + p.ga;

    return {
      year: p.year,
      cities: p.cities,
      seats,
      gmv,
      netRevenue,
      contribution,
      opex,
      ebitda: contribution - opex,
      headcount: p.headcount,
    };
  });
}

export function cumulativeBurn(results: YearResult[]): number {
  return results.reduce((sum, r) => sum + Math.min(0, r.ebitda), 0);
}
