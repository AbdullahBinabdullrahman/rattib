# Rattib — demo prototype

A working prototype of the marketplace described in [`../docs/product-brief.md`](../docs/product-brief.md), built for partner and investor demos.

```bash
cd web
npm install
npm run dev      # http://localhost:3000
```

No database, no API keys, no external services — the whole demo runs from seeded data in the browser, so it works offline and starts instantly.

## Shareable single-file build

```bash
npm run build:standalone   # → standalone/out/rattib.html
```

Bundles the entire app — JS and CSS inlined, no external requests — into one HTML file you can host anywhere or send to someone directly. Useful for partner and investor demos, where asking the audience to install Node is not an option.

Because a static file has no server to resolve paths against, routing moves to the URL hash (`#/explore`, `#/experience/x1`). That is the only difference: `standalone/next-shims.tsx` stands in for `next/link` and `next/navigation`, so **no page component changes** and both builds compile from identical source.

## What to show, in order

1. **Home** — the pitch, and what's bookable in Riyadh today.
2. **Explore** — map-first discovery on a real Leaflet map: pan, zoom, click a pin. Pins are colour-coded by audience policy — rose is women-only, brass is everything else. Filter by category, audience, price, and "today only". **Streets** toggles OpenStreetMap tiles on; without them the map still draws Riyadh's built-up area, Wadi Hanifah, the main arteries and district labels from local geometry.
3. **Experience detail** — description, what's included, host profile with the licences they hold, terms, and the slot picker.
4. **Booking** — pick a women-only session and try to book it. Every guest must have a verified identity and must match the policy; payment stays disabled until the whole party passes. Switch the header toggle to **Male** and the same experience disappears from Explore entirely.
5. **My bookings** — the reservation lifecycle: pending with a live SLA countdown, then accepted with a check-in code, or rejected/expired with a full refund.
6. **Expert portal** (switch persona in the header) — incoming requests with the SLA clock, accept/reject, and the listing set.
7. **Edit an experience** — **Edit** on any listing opens a single form: bilingual content side by side, pricing, audience policy, and status. Changes save immediately and show on the public page. Pause a listing and it leaves the map.
8. **Credentials** — the three-layer model. Note the **At-Turaif heritage walk** is blocked because guided tours need a tourism licence this expert doesn't hold. Add the licence and the listing unblocks.
9. **New experience** — the publish wizard. Pick the "Guided tours" category and the credential gate blocks submission at the review step.
10. **Market** — the investor slide: market size, the inbound/domestic divergence, competitors, and differentiation.

## Accounts

**Sign in** (header) opens signup and login for both roles. Role is chosen at signup because it decides which portal you land in. Accounts start unverified; identity verification is a separate step from the account menu, and it is only needed to book an audience-locked experience.

Identity verification is deliberately **provider-neutral** — the app calls a generic verify step rather than naming a provider, so a national identity service can be attached behind it later without touching the eligibility engine.

Signed out, the demo stays fully usable and the header shows two switches instead:

- **Customer / Expert** — which side of the marketplace you're on.
- **Female / Male** — the viewer's verified gender, which drives audience filtering.

**EN / عربي** toggles the full bilingual UI with RTL. Arabic is the default.

## Deliberate decisions

- **Gregorian only.** No Hijri calendar and no prayer-time features. Timestamps are stored in UTC and rendered in `Asia/Riyadh`; `ar-SA` is pinned to `ca-gregory` because it would otherwise default to the Islamic calendar.
- **Audience policy is a first-class field**, not a boolean — `mixed`, `women_only`, `men_only`, `families_only`, `private_buyout`. One eligibility engine in [`lib/eligibility.ts`](lib/eligibility.ts) checks both guests and hosts.
- **Credentials gate at publish, not signup**, and listings auto-pause on expiry. The category → credential matrix is configuration, because regulation changes.
- **Leaflet, not MapLibre.** MapLibre parses vector sources in a Web Worker, which does not survive this bundler and cannot exist inside a single self-contained HTML file. Leaflet needs no worker and no WebGL, so one component serves both builds — and it is a fifth of the size.
- **The map works with no network.** Riyadh's geometry is inline; tiles are opt-in via the Streets toggle, so the shared build makes no external request unless the viewer asks for one.
- **Hosts see party composition, never guest identities** — a PDPL-minded default.

## Structure

```
app/                    routes
  explore/              map + filters + list
  experience/[id]/      detail and slot picker
  book/[slotId]/        booking, guest eligibility, payment
  bookings/             customer reservation lifecycle
  expert/               dashboard, credentials, publish wizard, edit form
  auth/                 signup and login for both roles
  market/               market research, investor-facing
  economics/            live unit-economics model
components/
  RiyadhMap.tsx         Leaflet map, local geometry + optional tiles
  ExperienceCard.tsx
  Shell.tsx             header, nav, account menu, demo switches
  motion.tsx            scroll reveals, route transitions, counters
  ui.tsx                badges, artwork, avatars, chips
lib/
  types.ts              domain model
  eligibility.ts        guest + host eligibility rules
  seed.ts               experts, experiences, credentials, slot generation
  i18n.ts               AR/EN dictionary and domain labels
  format.ts             Gregorian/Riyadh/SAR formatting
  store.tsx             in-memory demo state
```

## Not built

This is a demo, not the product. Accounts are real screens over in-memory state — there is no backend, no password is stored, and verification only flips a flag. Also absent by design: a database, a payment gateway, ZATCA invoicing, host payouts, messaging, search ranking, reviews capture, and moderation tooling.
