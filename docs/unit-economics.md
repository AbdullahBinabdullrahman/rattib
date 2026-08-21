# Rattib — Unit Economics and Financial Model

Every number here is either sourced (marked with a link at the bottom), derived from the seeded catalogue in the demo, or an explicit assumption flagged **[assumption]**. Nothing is quietly invented.

Companion docs: [`product-brief.md`](./product-brief.md), [`market-research.md`](./market-research.md), [`trust-and-safety.md`](./trust-and-safety.md).

---

## 1. The take rate decision

Global benchmarks for experience marketplaces:

| Platform | Commission |
|---|---|
| Airbnb Experiences | **20% flat**, host-side, deducted on payout |
| Viator | 20–30%, ~25% typical; "Accelerate" promoted placement pushes effective rates to 30–35% |
| GetYourGuide | 20–30%, varies by country and volume |
| **Instagram DM + bank transfer** | **0%** |

That last row is the one that matters. Our hosts are not switching from Viator — they are switching from free. A 20% host-side commission out of the gate invites disintermediation on the second booking.

**Recommendation: split the take.**

| | Rate | On a SAR 598 booking |
|---|---|---|
| Host commission | **15%** | SAR 90 |
| Guest service fee | **10%** | SAR 60 |
| **Blended take** | **25% of base** (22.7% of the SAR 658 the guest pays) | **SAR 150** |

The host sees 15%, not 25% — meaningfully below the 20% Airbnb anchor, which is the number a sophisticated host will compare against. The guest fee is visible and normal; every OTA charges one.

---

## 2. Per-booking economics

**Basket assumptions.** Average seat price **SAR 260** — the mean of the twelve live listings in the demo catalogue, which range SAR 150–450. Average party **2.3 seats [assumption]**, giving **GMV of SAR 598 per booking** and **SAR 658** charged to the guest.

> Every figure in this document is computed by [`web/lib/economics.ts`](../web/lib/economics.ts) and rendered live at `/economics` in the demo, where the assumptions are sliders. If a number here disagrees with the app, the app is right.

### Payment processing

Published Saudi gateway rates, blended across our expected method mix:

| Method | Mix **[assumption]** | Rate | Cost on SAR 658 |
|---|---|---|---|
| mada | 55% | 1.95% + SAR 1 (Moyasar) | SAR 7.63 |
| Card / Apple Pay | 20% | 2.40% + SAR 1 | SAR 3.37 |
| STC Pay | 10% | ~2.0% + SAR 1 **[assumption]** | SAR 1.42 |
| Tabby (BNPL) | 15% | ~4.5% + SAR 1 (range 2.79–5.99%) | SAR 4.61 |
| **Blended** | | **~2.6%** | **SAR 17** |

Tabby is expensive but earns its place: it lifts conversion on the SAR 400+ listings, which are our highest-margin inventory. Worth an A/B test before committing.

### Contribution margin

| Line | Early (Y1) | At scale (Y3) |
|---|---|---|
| Guest pays | SAR 658 | SAR 658 |
| Paid to host (85% of 598) | (508) | (508) |
| **Gross take** | **150** | **150** |
| Payment processing | (17) | (17) |
| Refunds and chargebacks (~4% of bookings) **[assumption]** | (2) | (2) |
| Liability insurance per session **[assumption — needs a broker quote]** | (8) | (6) |
| Support and ops | (12) | (5) |
| Payouts and banking | (2) | (2) |
| **Contribution per booking** | **SAR 109** | **SAR 118** |
| **Contribution margin** (of net revenue) | **73%** | **79%** |
| **Contribution** (of GMV) | 18.2% | 19.7% |

VAT at 15% applies to our commission and to the experience, but it is collected and remitted, not a margin line. ZATCA e-invoicing (Fatoora phase 2) is a compliance cost, sitting in G&A.

---

## 3. The host case — the most important slide

This answers "why wouldn't the host just keep using Instagram?" It is not loyalty. It is fill rate.

A representative craft host: **8 sessions/month, 6 seats each, SAR 260/seat** — 48 seats of monthly capacity.

| | Selling by DM | On Rattib |
|---|---|---|
| Fill rate | 45% **[assumption]** | 70% **[assumption]** |
| Seats sold / month | 21.6 | 33.6 |
| Gross | SAR 5,616 | SAR 8,736 |
| Commission (15%) | — | (1,310) |
| **Net to host** | **SAR 5,616** | **SAR 7,426** |
| | | **+32%** |

The host gives up SAR 90 a booking and gets back a third more income, plus payment protection, no-show handling, and no scheduling admin. That trade holds as long as we genuinely deliver the fill-rate uplift — which makes **fill rate the single metric the company lives or dies on**, not GMV.

**This is also the honest fragility of the model.** If we only get hosts from 45% to 55%, the host nets SAR 5,834 — a 4% gain, and not enough to hold them. The two fill-rate numbers above are the assumptions most urgently needing validation in the Phase 0 concierge test.

---

## 4. Customer economics

| Metric | Y1 | Y3 |
|---|---|---|
| Blended CAC **[assumption]** | SAR 120 | SAR 85 |
| Contribution per booking | SAR 109 | SAR 118 |
| **Payback** | 1.1 bookings | 0.7 bookings |
| Bookings per customer per year **[assumption]** | 2.6 | 3.2 |
| 2-year LTV | SAR 564 | SAR 755 |
| **LTV : CAC** | **4.7×** | **8.9×** |

CAC falls as the map itself becomes the acquisition channel — a marketplace with 500 Riyadh pins is a destination people return to without being bought. Paid social carries Y1; referral, SEO and repeat carry Y3.

**Fragility:** the whole LTV rests on 2.6 bookings/customer/year. If experiences turn out to be a once-a-year novelty rather than a leisure habit, LTV drops to SAR 218 and LTV:CAC to 1.8× — viable but not venture-shaped. Measure repeat rate before scaling spend.

---

## 5. Three-year projection

Driver model: **active hosts → sessions/month → seats → fill rate → GMV**. Supply is the constraint, so hosts are the primary driver.

| | **Y1** Riyadh | **Y2** +Jeddah, Dammam, AlUla | **Y3** 8 cities |
|---|---|---|---|
| Active hosts (year end) | 180 | 720 | 2,100 |
| Average active hosts | 85 | 420 | 1,300 |
| Sessions / host / month | 6 | 6 | 6 |
| Seats / session | 6 | 6 | 6 |
| Fill rate | 55% | 62% | 66% |
| **Seats sold** | 20,200 | 112,400 | 371,300 |
| **GMV** | **SAR 5.3M** | **SAR 29.2M** | **SAR 96.4M** |
| Net revenue (25%) | SAR 1.3M | SAR 7.3M | SAR 24.1M |
| Contribution | SAR 1.0M | SAR 5.6M | SAR 19.1M |
| Headcount (year end) | 8 | 22 | 45 |
| Opex (people @ SAR 350k loaded, marketing, G&A) | SAR 4.6M | SAR 13.7M | SAR 27.8M |
| **EBITDA** | **(SAR 3.6M)** | **(SAR 8.0M)** | **(SAR 8.8M)** |

**Cumulative burn to end of Y3: ~SAR 20.4M (~USD 5.4M).**

**Break-even** needs contribution to cover roughly SAR 28M of opex: net revenue ~SAR 35M, GMV ~SAR 140M, ~540k seats a year. On this trajectory that lands in **Y4**.

Sensitivity — GMV is close to linear in fill rate, so it is the highest-leverage variable:

| Y3 fill rate | Y3 GMV | Y3 EBITDA |
|---|---|---|
| 55% | SAR 80.3M | (SAR 12.0M) |
| 66% (base) | SAR 96.4M | (SAR 8.8M) |
| 75% | SAR 109.5M | (SAR 6.1M) |

---

## 6. The ask

Do **not** raise three years at once. Raise to the next proof point.

**Seed: SAR 7.5M (~USD 2M), 18 months of runway.**

| Use of funds | Share |
|---|---|
| Product and engineering (5 people) | 40% |
| Supply acquisition and host success (Riyadh, then city two) | 25% |
| Demand marketing | 20% |
| Licensing, legal, compliance, bank guarantee | 10% |
| G&A | 5% |

**What the seed buys — the milestones that de-risk a Series A:**

1. Licensing structure settled and operating (marketplace-of-record, or per-host).
2. 180 active Riyadh hosts, with the credential engine running.
3. **Fill rate proven at 65%+**, and the host income uplift confirmed at 25%+.
4. Repeat rate above 2.5 bookings/customer/year.
5. City two launched, proving the playbook transfers.

Note that milestone 3 is the one worth raising on. GMV at this stage proves demand exists; fill rate proves *we* are the reason it converts.

---

## 7. What would make this model wrong

Stated plainly, because an investor will find these anyway:

- **Fill rate uplift is assumed, not observed.** The entire host case rests on 45% → 70%. Untested.
- **Repeat rate is assumed.** If experiences are annual novelty rather than habit, LTV:CAC falls to ~1.8×.
- **Insurance cost is a placeholder.** SAR 6–8 per booking needs a broker quote; a materially higher premium compresses contribution.
- **The 15/10 take split is untested against real hosts.** Saudi hosts currently pay zero; the acceptable ceiling is unknown.
- **Licensing could force marketplace-of-record**, which adds compliance headcount and a bank guarantee not fully priced here.
- **Average party size of 2.3** is derived from nothing but judgement about how these sessions sell.

---

## Sources

- [Airbnb Experiences host commission — 20% flat (SambaHQ)](https://www.sambahq.com/ota-supplier-guide/airbnb-experiences-supplier)
- [Tour OTA commission rates 2026: Viator, GetYourGuide, Klook (SambaHQ)](https://www.sambahq.com/ota-supplier-guide/ota-commission-rates)
- [OTA commission rates 2026: what tour operators actually pay (Travelity)](https://travelity.app/blog/ota-commission-rates/)
- [Viator supplier guide 2026: commissions (TicketingHub)](https://www.ticketinghub.com/en-US/blog/viator-supplier-faqs)
- [Payment gateway fees in Saudi Arabia 2026 — Moyasar and Tap mada/Visa rates (GulfSaaSReview)](https://gulfsaasreview.com/article/payment-gateway-fees-saudi-arabia-2026)
- [Moyasar — payment gateway for Saudi Arabia](https://moyasar.com/en/)
- [Tamara vs Tabby merchant fees and MDR rates, Saudi Arabia 2026 (Logio Legion)](https://logiolegion.com/blogs/tamara-vs-tabby-merchant-fees-mdr-rates-saudi-arabia-2026)
- [Tabby merchant FAQs (Tap)](https://support.tap.company/en/support/solutions/articles/153000140167-tabby-faqs-%E2%81%89%EF%B8%8F)
