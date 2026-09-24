# /img — spa-in-hennur landing page assets

Images referenced by `public/spa-in-hennur.html`. Until a file below is added,
its `<img>` shows the page's built-in placeholder (see `SHOW_PLACEHOLDERS` in
the page's CONFIG block) and `onerror` keeps the layout intact.

## Present

- `hero-bg.webp` — hero background (landscape, 2400px+ wide recommended)
- `hero-bg.jpg` — hero background fallback for browsers without WebP support
- `oil.webp` — close-up: warm oil poured into a bowl, soft glow, rolled linen
- `favicon.png` — 512×512, transparent background, gold "A" mark — page favicon

### Therapy card photos

Used as the banner image at the top of the matching card in the "Choose your
therapy" section (`.c-photo`). All 11 cards now have a photo. All converted
to WebP and renamed with the service name + "hennur" for local-SEO
filename/alt-text consistency.

- `signature-body-massage-in-hennur.webp` — Signature Body Massage card
- `couple-massage-in-hennur.webp` — Couple's Massage card
- `swedish-massage-in-hennur.webp` — Swedish Massage card
- `ayurvedic-abhyanga-massage-in-hennur.webp` — Ayurvedic Abhyanga card
- `balinese-massage-in-hennur.webp` — Balinese Massage card
- `chocolate-wine-therapy-in-hennur.webp` — Chocolate & Wine Therapy card
- `deep-tissue-massage-in-hennur.webp` — Deep Tissue Massage card
- `aromatherapy-massage-in-hennur.webp` — Aromatherapy Massage card
- `thai-massage-in-hennur.webp` — Thai Massage card
- `jacuzzi-hydro-jet-bath-in-hennur.webp` — Jacuzzi & Hydro Jet Bath card
- `sports-massage-in-hennur.webp` — Sports Massage card

### Gallery / "Inside Aurum Astra" photos

Used in the `figure[data-slot]` gallery grid and the full-width photo band,
plus the structured-data `image` array. All 5 slots are now filled — no
placeholders left in this section. All converted to WebP and renamed.

- `spa-entrance-hennur.webp` — slot 2, "Find us" section
- `spa-corridor-terrace-hennur.webp` — full-width photo band
- `spa-therapy-room-hennur.webp` — slot 4, large gallery photo
- `private-jacuzzi-hennur.webp` — slot 5
- `couples-massage-suite-hennur.webp` — slots 6 and 9 (reused in both)
- `spa-shower-hennur.webp` — slot 7 (originally the terrace slot; repurposed
  since a terrace photo was never uploaded)
- `spa-waiting-lounge-hennur.webp` — slot 8 (re-added to the page after being
  removed for the shower photo — now shows the waiting lounge instead)

Three extra uploads didn't get used — kept in this folder in case you want to
use one instead: `Ayurvedic Massage in Hennur .webp`, `Balinese Massage in
Hennur Bande.webp`, `Best Thai Massage In Hennur.png` (still needs
PNG&rarr;WebP conversion if it's ever used).

## Still to come

- `og.jpg` — 1200×630 — social-share preview image (WhatsApp/Facebook link previews)
- `logo.png` — brand logo, used in structured data (wordmark provided, but only
  as an inline-pasted image with no accessible file path yet — save it into
  `public/img/` or re-share as a file attachment to unblock this)
