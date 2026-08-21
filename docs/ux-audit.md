# Rattib — UX audit

Journeys driven end to end in a real browser against the built app, not
reviewed by eye. Re-runnable: the script lives outside the repo, but every
check below is described precisely enough to redo.

## Journeys covered

| # | Journey | Result |
|---|---|---|
| J1 | Signed-out visitor browses, opens a women-only session, is stopped at the gate | pass |
| J2 | Sign up → pick a slot → verify identity → pay → see the booking | pass |
| J2b | Session survives a page refresh | **was failing** — fixed |
| J3 | Phone viewport (390×844) across five routes: horizontal overflow, tap-target size | **was failing** — fixed |
| J4 | Language flip mid-flow: direction, and no untranslated strings left behind | pass |

## Defects found and fixed

**Signing in did not survive a refresh.** The account, language and side of
the marketplace lived only in memory, so a reload dropped you back to a
signed-out Arabic visitor — mid-booking, on a demo people are meant to poke
at. Now persisted to local storage and restored after mount, so server and
client markup still match. Wrapped in try/catch: private browsing and
blocked storage degrade to the old behaviour rather than erroring.

**Tap targets below the standard.** Explore had 22 controls under 32px tall
and the expert dashboard 10 — filter pills and the small text buttons. Fine
for a mouse, not for a thumb. Controls now take a 44px minimum on coarse
pointers and narrow viewports. Non-interactive chips — badges, statuses —
are deliberately excluded, since padding them out would just bloat the
cards.

**Expert dashboard heading squeezed on a phone.** The action buttons shared
a row with the title, compressing it to three wrapped lines. The buttons now
drop to their own row below the phone breakpoint.

## Checked and already correct

- The audience lock cannot be walked around by typing a `/book/...` URL
  directly — the gate is on the page, not only on the button.
- A signed-out visitor sees **all twelve** experiences, including men-only
  ones. Browsing is open; the lock is enforced at booking, which is the only
  point where identity can actually be checked.
- Payment stays disabled until every guest in the party passes the policy,
  and verifying releases it.
- No horizontal scrolling on any route at 390px.
- No console errors or unhandled rejections across the journeys.
- Flipping to English leaves no Arabic strings stranded in the interface.

## Not covered

Keyboard-only traversal and screen-reader semantics were not driven
automatically. Focus styling exists (`:focus-visible` against the accent) but
tab order through the booking flow has not been walked, and the map is not
keyboard-operable — Leaflet's own controls are, the pins are not. Worth a
pass before this is put in front of real users.
