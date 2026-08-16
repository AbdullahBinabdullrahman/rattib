# Rattib — Trust, Safety and Liability

The gap that gets skipped until someone is hurt. Kilns, ovens, blades, essential oils, strangers' premises, and minors — all in the launch catalogue.

Companion docs: [`product-brief.md`](./product-brief.md), [`unit-economics.md`](./unit-economics.md), [`market-research.md`](./market-research.md).

---

## 1. Why this is a licensing problem, not just an insurance one

Saudi tourism regulation already treats safety as a licensing condition, which means a safety failure is also a compliance failure:

- **Insurance documents form part of the Ministry of Tourism licence application** where applicable, alongside the CR, manager ID, lease and National Address.
- **For high-risk activities or crowded venues, service providers must carry cooperative insurance against third-party risks.**
- **A bank guarantee is required for several categories**, explicitly to protect tourists' rights — it covers fines after 45 days, tourists' financial rights after 24 hours, and compensation for damages arising from the service. AlUla, for example, requires **SAR 50,000** for tour operators.
- Enforcement is real: unlicensed hospitality operation carries fines up to **SAR 1 million**, and the Ministry has shut unlicensed travel offices.

**Consequence for the model.** If Rattib operates as marketplace-of-record (product brief §2.2), the guarantee, the insurance and the liability all sit with **us**, not the host. That is a balance-sheet item and a per-booking cost, and it must be priced into the raise.

---

## 2. Category risk tiers

Risk tiering drives what we launch, what we insure, and what we inspect. It maps almost exactly onto the licensing sequencing — which is the useful part: one decision covers legal exposure, insurance cost and go-to-market scope.

| Tier | Categories | Hazards | Launch? |
|---|---|---|---|
| **Low** | Calligraphy, Nabati poetry, coffee cupping, palm frond (khoos) | Minimal — seated, indoor, hand tools | ✅ Launch |
| **Medium** | Pottery (wheels, kilns), bakery (ovens, tannour), coffee roasting (open flame), perfume blending (solvents, skin sensitivity), Sadu (looms) | Burns, cuts, chemical exposure, allergens | ✅ Launch, with controls |
| **High** | Guided outdoor tours, desert excursions, anything with transport, water or wilderness | Vehicle, environmental, remoteness, rescue | ❌ Defer |

Deferring the high tier is the same call the licensing analysis reached independently. It also removes the most expensive insurance line before we have the volume to negotiate a premium.

---

## 3. The controls

### Before publish
- **Category safety checklist**, completed by the host and stored against the listing — extinguisher and first-aid kit for kiln and oven categories, ventilation for solvent work, allergen declaration for anything with food.
- **Allergen and ingredient disclosure** is mandatory for bakery, coffee and perfume, and surfaces on the listing.
- **Venue attributes** captured (already in the model): private entrance, women's section, family section.
- **First-session QA** for every medium-tier host — an ops visit or a video walkthrough of the space before the second booking is accepted.

### At booking
- Minimum age enforced by the same eligibility engine that enforces audience policy — it is already generic over age, so this is configuration, not new code.
- **Guardian consent** required for guests under 16; the guardian must be in the party.
- Guest-facing **"what to expect and what to be careful of"** shown before payment, acknowledged at checkout.

### During and after
- **In-app incident report** from either side, with photo upload.
- **24-hour triage SLA**, insurer notified inside 72 hours where a claim is plausible.
- **Automatic payout hold** on the affected booking pending review — this is why funds are held to T+24h after the session rather than released at booking.
- **Host suspension pending review** for any injury report; listings auto-pause, consistent with the credential-expiry behaviour.

---

## 4. Insurance design

**A platform-level public liability policy covering every booked session**, rather than requiring each host to carry their own.

Three reasons, in order of importance:

1. **It is a supply-acquisition tool.** A home baker will not buy commercial liability cover to teach four people. Requiring it kills the long tail — the exact asset that differentiates us from flynas and webook.
2. **It is cheaper.** One pooled policy across thousands of sessions prices far better than thousands of individual ones.
3. **It is consistent with marketplace-of-record.** If we hold the tourism licence, the liability follows us regardless of what the host carries.

Modelled at **SAR 6–8 per booking**. This is an **assumption pending a broker quote** and is the single largest uncertainty in the contribution margin — a premium at double the estimate would take roughly SAR 7 off a SAR 109 contribution.

Cover to specify: public/third-party liability, product liability for food and cosmetics categories, and property damage at host premises. Named-insured structure should extend to hosts acting within the scope of a booked session.

**Deliberately excluded from v1:** medical expenses cover for guests, and host property/contents insurance. Both are worth revisiting once claims data exists.

---

## 5. Content, conduct and identity

- **Nafath identity for every host**, and for every guest on a gender-locked booking. Already implemented.
- **Two-way reviews**, published only after both sides submit or the window closes — prevents retaliatory rating.
- **Photo moderation** at publish; listing photos must depict the actual venue.
- **Prohibited-content policy**: no medical, therapeutic or investment claims; no unlicensed cosmetic procedures.
- **Off-platform payment is a suspension offence** for hosts. Enforced by making on-platform cheaper and easier, not only by policy — the fill-rate uplift in [`unit-economics.md`](./unit-economics.md) §3 is the real deterrent.
- **Guest identities are never exposed to other guests**, and hosts see party composition, not identities. PDPL minimisation, already built.

---

## 6. Data protection (PDPL)

- Gender is personal data; it is stored only where audience policy requires it and never shown to other guests.
- Nafath verification results should be stored as **attributes and a verification timestamp**, not as a copy of the national ID.
- Data residency: Saudi cloud-computing rules point to in-Kingdom hosting. **Decide before building the backend** — it constrains infrastructure choice and is expensive to retrofit.
- Retention policy needed for incident reports and identity attributes; not yet drafted.

---

## 7. Open items

| Item | Owner | Blocking? |
|---|---|---|
| Broker quote for platform liability cover | Founders | Blocks the margin model |
| Bank guarantee amount for our categories and cities | Legal counsel | Blocks the raise sizing |
| Whether MT requires insurance for crafts and culinary specifically | Licensing consultant | Blocks launch scope |
| Data residency decision | Engineering | Blocks backend build |
| Incident and claims runbook | Ops | Before first booking |
| Retention and deletion policy | Legal | Before first booking |

---

## Sources

- [Essential guide to the Saudi tourism licence process and requirements (TASC Outsourcing)](https://tascoutsourcing.sa/en/insights/saudi-tourism-licence-requirements-in-2026)
- [Tourism license Saudi Arabia compliance guide 2026 (Saudi Tourism Consulting)](https://sauditourismconsulting.com/insights/articles/tourism-license-saudi-arabia-a-clear-stress-free-compliance-guide-for-operators)
- [Tourist rights in Saudi Arabia (Saudipedia)](https://saudipedia.com/en/tourist-rights-in-saudi-arabia)
- [Conditions for opening a tourism company in Saudi Arabia (HR360)](https://hr360s.com/en/conditions-for-opening-a-tourism-company-in-saudi-arabia/)
- [Saudi Arabia: SR1 million fine for unlicensed hospitality businesses (Gulf News)](https://gulfnews.com/world/gulf/saudi/saudi-arabia-sr1-million-fine-for-unlicensed-hospitality-businesses-1.500007124)
