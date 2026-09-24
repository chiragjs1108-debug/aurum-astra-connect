# /img — spa-in-hennur landing page assets

Images referenced by `public/spa-in-hennur.html`. Until a file below is added,
its `<img>` shows the page's built-in placeholder (see `SHOW_PLACEHOLDERS` in
the page's CONFIG block) and `onerror` keeps the layout intact.

## Present

- `hero-bg.webp` — hero background (landscape, 2400px+ wide recommended)
- `hero-bg.jpg` — hero background fallback for browsers without WebP support
- `oil.webp` — close-up: warm oil poured into a bowl, soft glow, rolled linen

### Therapy card photos

Used as the banner image at the top of the matching card in the "Choose your
therapy" section (`.c-photo`). Cards without a matching photo below show the
icon-only layout, unchanged. All converted to WebP and renamed with the
service name + "hennur" for local-SEO filename/alt-text consistency.

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

Still without a photo: **Sports Massage** — add e.g.
`sports-massage-in-hennur.webp` and reference it in that card's
`<article class="card" id="t-sports">` to add one later.

Three extra uploads didn't get used since each duplicates a card already
covered above — kept in this folder in case you want to swap one in instead:
`Ayurvedic Massage in Hennur .webp`, `Balinese Massage in Hennur Bande.webp`,
`Best Thai Massage In Hennur.png` (also still needs PNG&rarr;WebP conversion
if it's ever used).

## Still to come

- `band.webp` — wide, atmospheric — terrace garden lounge at dusk
- `room.webp` — 1200×1500, portrait 4:5 — private therapy room, wider angle, lights dimmed
- `jacuzzi.webp` — 1200×900, landscape 4:3 — jacuzzi with warm light and rising steam
- `couple-suite.webp` — 1200×900, landscape 4:3 — couple's suite, both beds prepared, warm low light
- `terrace.webp` — 1200×900, landscape 4:3 — terrace garden lounge at dusk
- `shower.webp` — 1200×900, landscape 4:3 — in-room shower, robe and towels laid out, warm light
- `entrance.webp` — 1600×1000, landscape 16:10 — AM Plaza entrance from Hennur–Bagalur Main Road, signage visible
- `og.jpg` — 1200×630 — social-share preview image (WhatsApp/Facebook link previews)
- `logo.png` — brand logo, used in structured data
- `favicon.png` — page favicon
