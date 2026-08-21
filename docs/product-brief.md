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

### 2.2 Expert eligibility — CR or freelance certificate ✅ new

**Rule: no expert transacts without an economic identity — a Commercial Registration (CR) or, at minimum, a freelance certificate (وثيقة العمل الحر).**

This is the right floor, and the **freelance certificate should be the default**, not the CR. Reasons:

- It is issued by MHRSD through **freelance.sa**, is **free and effectively instant**, requires **no commercial registration**, and lets the holder operate under their personal name.
- It covers **160+ approved activities** across eight programmes — and four of them are our host base almost exactly: **handicrafts, productive families, rural development, and specialized services**.
- It is explicitly a valid basis for **regular e-commerce activity** (the rule is CR *or* freelance certificate), and it unlocks a **dedicated commercial bank account** — which is what we actually need for payouts.

Requiring a CR as the floor would kill the long tail: the home baker currently selling by Instagram DM will not register a company to teach four people on a Thursday. Requiring a freelance certificate costs her twenty minutes and nothing else. **CR stays as an upgrade path** — needed once a host hires staff, takes partners, approaches the VAT threshold, or wants limited liability.

#### But it is necessary, not sufficient

A CR or freelance certificate establishes *who you are as an economic actor*. It does **not** grant the right to practise a **regulated activity**. Those are separate, sector-issued licences, and which one applies depends on the category. So model eligibility as three layers, not one field:

| Layer | What it proves | Examples |
|---|---|---|
| **1. Economic identity** — always required | Legal counterparty, can invoice, can be paid | CR **or** freelance certificate |
| **2. Activity licence** — category-dependent | Right to practise this specific activity | Abde'a Crafts Practitioner licence (Ministry of Culture / Heritage Commission); municipal craft licence (Balady) for premises; municipal food & health permits for culinary; MT tourism licence and individual tourist-guide licence for guiding and excursions |
| **3. Rattib trust layer** — always | Safety and quality, ours to enforce | Nafath identity, first-session QA, insurance, ratings, incident history |

#### Why this shapes the whole category roadmap

Whether an experience is a *tourism activity* at all is category-dependent, and that distinction is the unlock. The Ministry of Tourism regime bites hardest on **guiding, excursions, transport and accommodation**. A pottery workshop sold to Riyadh residents is much closer to a craft or training service — covered by the Abde'a Crafts Practitioner licence, which explicitly permits citizens to work in and sell handmade craft fields.

That argues for launching with **crafts and culinary** and deferring **guided outdoor and heritage-site tours**, which is exactly the sequencing the market research recommends on risk grounds. The legal and commercial arguments point the same way.

One firm data point: the individual **tourist-guide licence** exists (Saudi national, 18+, medically fit, accredited training and assessment, General vs. Area Guide) — but guides operate **through registered travel and tourism service providers**. For the tourism-regulated categories, the clean structure is therefore Rattib as the registered operator with licensed individuals working under it.

#### Product implications

- `HostCredential` is a first-class entity with type, number, issuing body, issue and expiry dates, verification state, and evidence document.
- A **category → required-credential matrix** is configuration, not code. It will change as regulation does.
- **Gate at publish, not at signup.** Let an expert build the listing, then require credentials before it goes live — this keeps onboarding drop-off low while keeping unlicensed supply off the map.
- **Expiry is an event.** On expiry, the listing auto-pauses after a grace period and the host is warned ahead of time. A verified-once model rots.
- Show a **verification badge** on the expert profile — the credential is a trust asset for the customer, not just a compliance checkbox.
- Onboarding should **link hosts straight to freelance.sa** and to the Abde'a platform. Removing that friction is a supply-acquisition tactic, not just a legal step.

### 2.3 Calendar — Gregorian only ✅ new

- **Gregorian throughout** — UI, API, and database. No Hijri calendar, no dual display, no Hijri toggle.
- Store all timestamps in **UTC**, render in **Asia/Riyadh**.
- **No prayer-time features.** No prayer schedule display, no prayer-aware slot generation, no automatic blackout windows. Dropped entirely.
- Hosts control their own availability. If a host wants a gap in their day for any reason, they block it manually — the platform does not infer religious scheduling on their behalf.
- Ramadan and Eid are handled as **ordinary host-defined availability plus optional seasonal tags** (e.g. an evening-only Ramadan session), never as calendar logic in code.

---

## 3. Core flows

### 3.1 Expert publishes
1. Sign up → **verification**: Nafath identity, then `host_credentials` per the three-layer model in §2.2 — always a CR or freelance certificate, plus whatever activity licence the category requires. Credentials carry expiry dates and are re-checked.
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
HostCredential  expert_id, layer(identity|activity), number, issuing_body, issued_at, expires_at,
                type(cr | freelance_doc                      -- layer 1, one required
                    |abdea_craft | municipal_craft | food_health
                    |mt_tourism | tour_guide),               -- layer 2, category-dependent
                verification_state(pending|verified|rejected|expired), evidence_doc
CategoryRule    category, required_credential_types[], notes   -- config, not code
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

`CategoryRule` drives publish-time gating: an `Experience` cannot leave `in_review` unless the expert holds every credential its category requires, and it auto-transitions to `paused` when one expires.

---

## 5. Open questions

1. **Licensing structure** — partially settled by §2.2: every expert holds a CR or freelance certificate, and category-specific activity licences on top. Still open, and still blocking for the tourism-regulated categories: does Rattib hold the MT tourism licence and contract experts under it (marketplace-of-record), or does each expert hold their own? See market research §6.1 and §9.
2. **Category → credential matrix** — needs confirming with counsel per category. Specifically: is a paid craft or cooking workshop for residents a regulated *tourism* activity, or a craft/training service? The launch scope depends on the answer.
3. **Take rate** — what commission do hosts accept versus selling by DM at 0%?
4. **Nafath integration scope** — required for all bookings, or only gender-locked ones? Required for all *hosts* regardless.
4. **PSP choice** — which licensed provider supports marketplace split payouts with mada + Apple Pay + STC Pay + Tabby.
5. **Launch city and category cluster** — proposed: Riyadh, crafts + culinary.

---

## 6. Suggested sequencing

**Phase 0 — validate (no platform).** Answer the licensing question. Source 30 Riyadh hosts. Run 20 real sessions via a landing page and WhatsApp concierge. Measure fill rate, no-show rate, and how many hosts require women-only to participate at all.

**Phase 1 — MVP.** One city. Expert portal (publish + availability + accept/reject), customer app (map, detail, book, pay), audience policy end to end, request-to-book with SLA timeout, payments via PSP, reviews.

**Phase 2 — liquidity.** Today/tonight listings, search and ranking, host payouts dashboard, ZATCA invoicing, referrals, Arabic/English.

**Phase 3 — scale.** More cities, instant book, gifting and group buyouts, corporate and team bookings, inbound-tourist surface (multi-language, international cards), possible distribution partnerships with STA or airline channels.
