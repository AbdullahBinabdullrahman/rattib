# Rattib — Product Brief

An Airbnb-style marketplace for Saudi experiences: pottery, bakery, weaving, coffee roasting, calligraphy, nabati poetry majlis, and everything else a local expert can teach in an afternoon — discovered on a map, city by city.

See [`market-research.md`](./market-research.md) for market sizing, competitors and validation.

---

## 1. The two sides

**Expert (service provider)** — publishes an experience through the expert portal: description, category, location, seats, tools provided vs. required, price, duration, SLA, media, and **audience policy**. After review it goes live and appears on the map.

**Customer** — browses the map or list, opens an experience, checks details, price, expert profile and rating, then reserves and pays. The reservation is either instantly confirmed or pending the expert's acceptance, and the customer can track that state.

---

## 2. Decisions locked in this round

### 2.1 Audience policy — gender-locked experiences ✅ new

Not a boolean. An experience carries an `audience_policy`:

| Value | Meaning |
|---|---|
| `mixed` | Open to everyone (default) |
| `women_only` | Female guests only |
| `men_only` | Male guests only |
| `families_only` | Families and women; no unaccompanied men — a real and distinct Saudi category |
| `private_buyout` | Whole session sold to one group; the booker sets their own composition |

**Why this matters more than it looks.** The obvious benefit is demand-side: women can filter for women-only sessions. The larger benefit is **supply-side** — a large population of skilled women (home bakers, weavers, henna artists, perfumers) will list *only* if a women-only room is guaranteed. Without the guarantee they never become hosts at all. Supply is the hard side of a marketplace, so this is a moat, not a checkbox. The market data backs it: 44% of 2024 travellers to Saudi were women, and 45% of the tourism workforce is female.

**Rules to enforce:**

- **Host eligibility.** A `women_only` experience requires a female host, or a female co-host present for the whole session. Enforced at publish time, not by trust.
- **Guest verification.** Booking a gender-locked experience requires **Nafath**-verified identity, so the gender attribute is authoritative. Self-declared gender is acceptable for `mixed` experiences only. Without this, a booking of 4 seats by one woman can seat any group.
- **Party composition.** When N seats are booked on a locked experience, every guest in the party must satisfy the policy — capture per-guest identity, not just the booker's. `families_only` needs a group-composition check rather than a per-person one.
- **Discovery.** Locked experiences are *surfaced*, never hidden: a verified female user sees women-only sessions promoted in her feed and badged on the map, and can filter to them. A male user simply does not see them as bookable.
- **Privacy (PDPL).** Gender is personal data. Store the minimum, never expose one guest's identity or gender to another, and show the host aggregate composition plus only what they need to run the session.
- **Venue attributes**, modelled separately from policy: `private_entrance`, `women_section`, `family_section`, `female_staff_only`.

The same machinery covers `min_age`, `max_age` and `child_policy` — build it once as an eligibility engine, not as a gender special case.

### 2.2 Calendar — Gregorian only ✅ new

- **Gregorian throughout** — UI, API, and database. No Hijri calendar, no dual display, no Hijri toggle.
- Store all timestamps in **UTC**, render in **Asia/Riyadh**.
- **No prayer-time features.** No prayer schedule display, no prayer-aware slot generation, no automatic blackout windows. Dropped entirely.
- Hosts control their own availability. If a host wants a gap in their day for any reason, they block it manually — the platform does not infer religious scheduling on their behalf.
- Ramadan and Eid are handled as **ordinary host-defined availability plus optional seasonal tags** (e.g. an evening-only Ramadan session), never as calendar logic in code.

---

## 3. Core flows

### 3.1 Expert publishes
1. Sign up → **verification**: identity (Nafath), and `host_credentials` — MT tourism licence, Heritage Commission *Ibda'a* artisan licence, freelance certificate, or CR, depending on category. Credentials carry expiry dates and are re-checked.
2. Create experience: title, category, description, media, **city + precise pin**, duration, seats (min/max), price per seat, tools & materials provided vs. what the guest must bring, prerequisites, accessibility, **audience policy**, cancellation policy.
3. Set the **SLA**: response window for booking requests, cancellation and refund terms, no-show handling.
4. Submit → moderation (content, safety, credentials, pricing sanity) → **published, appears on the map**.

### 3.2 Availability
Two shapes, both needed:
- **Scheduled slots** — the expert opens seats hours or days in advance on a recurring or one-off basis.
- **Today / tonight** — a live, same-day listing. This is the spontaneity mode Instagram hosts already sell into, and no competitor does it well.

### 3.3 Customer books
1. Discover: map-first, with list and search. Filters for city, category, date, price, duration, language, and **audience policy**.
2. Detail page: photos, description, what's included, what to bring, exact-ish location, expert profile and rating, reviews, cancellation terms.
3. Reserve → **pay at booking** (funds held, not released).
4. **Instant book** or **request to book**. On request-to-book the expert must respond within the SLA window; on accept, the booking is confirmed; on reject or timeout, it auto-cancels and refunds in full. The customer sees this state live: `pending → accepted | rejected | expired | cancelled`.
5. Attend — check-in via a code shown to the host.
6. Review, both directions.
7. **Payout to the expert** after completion plus a hold period.

---

## 4. Data model sketch

```
User            id, nafath_verified, gender(verified|self_declared), locale, phone
Expert          user_id, bio, languages, rating, payout_account, status
HostCredential  expert_id, type(mt_licence|ibdaa|freelance|cr), number, issued, expires, verified_at
Experience      expert_id, title, description, category, city, geo_point,
                duration_min, seats_min, seats_max, price_per_seat, currency,
                audience_policy, min_age, max_age, tools_provided[], tools_required[],
                cancellation_policy, response_sla_hours, booking_mode(instant|request),
                status(draft|in_review|published|paused|rejected), media[]
Slot            experience_id, starts_at(UTC), ends_at(UTC), seats_total, seats_taken, status
Booking         slot_id, customer_id, seats, guests[], amount, status
                (pending|accepted|rejected|expired|cancelled|completed|refunded),
                requested_at, responded_at, checkin_code
Payment         booking_id, psp_ref, method(mada|applepay|stcpay|tabby|card), status, held_until
Payout          expert_id, booking_id, amount, commission, status, zatca_invoice_ref
Review          booking_id, author(customer|expert), rating, body
```

`audience_policy` lives on `Experience` and is evaluated against every guest at booking time by a single eligibility service — the same one that checks age.

---

## 5. Open questions

1. **Licensing structure** — do we operate as marketplace-of-record under our own tourism licence, or require each expert to hold one? This is blocking; see market research §6.1 and §9.
2. **Take rate** — what commission do hosts accept versus selling by DM at 0%?
3. **Nafath integration scope** — required for all bookings, or only gender-locked ones? Required for all *hosts* regardless.
4. **PSP choice** — which licensed provider supports marketplace split payouts with mada + Apple Pay + STC Pay + Tabby.
5. **Launch city and category cluster** — proposed: Riyadh, crafts + culinary.

---

## 6. Suggested sequencing

**Phase 0 — validate (no platform).** Answer the licensing question. Source 30 Riyadh hosts. Run 20 real sessions via a landing page and WhatsApp concierge. Measure fill rate, no-show rate, and how many hosts require women-only to participate at all.

**Phase 1 — MVP.** One city. Expert portal (publish + availability + accept/reject), customer app (map, detail, book, pay), audience policy end to end, request-to-book with SLA timeout, payments via PSP, reviews.

**Phase 2 — liquidity.** Today/tonight listings, search and ranking, host payouts dashboard, ZATCA invoicing, referrals, Arabic/English.

**Phase 3 — scale.** More cities, instant book, gifting and group buyouts, corporate and team bookings, inbound-tourist surface (multi-language, international cards), possible distribution partnerships with STA or airline channels.
