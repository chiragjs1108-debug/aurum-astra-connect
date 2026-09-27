# Aurum Astra Blog — Architecture & Content Pipeline

Reference doc for the blog system built into this repo: a block-based content
model, a Decap CMS dashboard on top of it, and the plumbing that connects a
"Publish" click to a live page. Written to be handed to a fresh Claude thread
(or any other reader) with no other context.

## 1. The big picture — two lanes, one repo

The project is deliberately split into two things that never touch each
other's files:

- **Code lane** — the site's design, components, routing, styling. Lives in
  `src/`. Changed by developers (or Claude Code) via normal commits.
- **Content lane** — the actual blog posts. Lives in `content/blog/*.md`.
  Changed by whoever is writing posts, via the Decap CMS dashboard at
  `/admin` — they never see or touch code.

Both lanes live in the same git repo and the same deploy pipeline. The CMS is
just a second, narrower "front door" into the repo, aimed at one folder.

## 2. Full lifecycle: from "Publish" to a live page

1. A writer logs into `https://connect.aurumastra.in/admin` (GitHub OAuth,
   see §6) and builds a post from content blocks (see §3).
2. On publish, Decap CMS commits a new `.md` file straight to `content/blog/`
   on the `main` branch, via the GitHub API — no server of ours involved.
3. That push triggers `.github/workflows/deploy.yml` (GitHub Actions):
   `npm install` → `npm run build` (which also runs `prebuild`, see §5) →
   FTP the built `dist/` folder to `connect.aurumastra.in`.
4. `src/blog/data/posts.js` (part of the client bundle) loads every file in
   `content/blog/` at build time and turns it into the posts the React app
   renders — see §4.
5. Live in a couple of minutes, no manual step anywhere in between.

## 3. The content model: 23 block types

A post's body is not free-text — it's an ordered list of **blocks**, each a
typed object with `type` plus its own fields. This is what lets the same
"list of items" shape render as a bullet list, a card grid, or a carousel,
purely by which block type an editor picks.

Every block also accepts an optional `id` (not shown below to save space) —
if set, a `toc` block elsewhere in the same post can link to it by matching
`anchorId`.

Rendering side: `src/blog/components/BlockRenderer.jsx` maps `type` →
component (in `src/blog/components/blocks/`). CMS side: `public/admin/
config.yml`'s `blocks` field defines the exact same 23 types as Decap
"variable types" — **the two must stay in sync**; adding a block type means
touching both, plus the new component file.

```
paragraph
  text: string

image
  src: image, alt?: string, caption?: string

bullet-list
  heading?: string
  items: [{ title: string, description?: string }]

card-grid
  heading?: string
  items: [{ title: string, description?: string, image?: image, alt?: string }]  # alt falls back to title

carousel
  heading?: string
  items: [{ title: string, description?: string, image?: image, alt?: string }]  # swipeable, alt falls back to title

quote
  text: string, attribution?: string

cta
  heading?: string, text?: string
  actions: [{ kind: 'whatsapp'|'call'|'link', label: string, message?: string, href?: string }]
  # `message` used when kind=whatsapp, `href` when kind=link

faq
  heading?: string
  items: [{ question: string, answer: string }]        # accordion

before-after
  beforeImage: image, beforeAlt?: string (falls back to beforeLabel)
  afterImage: image, afterAlt?: string (falls back to afterLabel)
  beforeLabel?: string (default "Before"), afterLabel?: string (default "After")
  caption?: string                                       # one interactive drag-to-compare slider

steps
  heading?: string
  items: [{ title: string, description?: string }]      # numbered checklist

stats
  heading?: string
  items: [{ value: string, label: string }]              # e.g. value: "4.9★"

video
  url: string (a normal YouTube watch/share URL — converted to embed automatically)
  caption?: string

callout
  tone: 'tip' | 'note' | 'warning' (default 'tip')
  text: string

divider
  (no fields other than id)

service-cards
  heading?: string, intro?: string
  items: [{
    name: string, tag?: string, image: image, description: string,
    duration: string, medium?: string,
    pressureLabel?: string, pressureLevel?: number (1-5),   # OR:
    feel?: string,                                          # for non-massage items (jacuzzi, wraps)
    whatsappMessage: string
  }]                                                        # swipeable; booking via shared WhatsApp number

timeline
  heading?: string, intro?: string
  items: [{ when: string, title: string, description: string }]

feature-list
  heading?: string, intro?: string
  items: [{ icon: 'person'|'droplet'|'shield'|'gem'|'chat'|'spark', title: string, description: string }]

testimonials
  heading?: string, intro?: string
  items: [{ stars?: number (1-5, default 5), quote: string, author: string, source?: string }]  # swipeable

promo
  badge?: string, title: string, copy?: string
  action?: { kind: 'whatsapp'|'call'|'link', label: string, message?: string, href?: string }

before-after-gallery
  heading?: string, intro?: string
  items: [{ beforeImage: image, afterImage: image, label: string }]  # grid of static pairs, not interactive

comparison
  heading?: string, intro?: string
  rows: [string]                                          # shared row labels, e.g. ["Duration", "Best for"]
  options: [{ name: string, highlight?: boolean, values: [string] }]  # values line up with `rows` by index
                                                            # swipeable cards

price-list
  heading?: string, intro?: string
  items: [{ name: string, duration?: string, price: string, note?: string }]

toc
  heading?: string (default "On this page")
  items: [{ label: string, anchorId: string }]             # anchorId must match another block's `id`
```

## 4. File anatomy: what a post file actually is

One file per post in `content/blog/`, filename (minus `.md`) = the post's
URL slug. **YAML frontmatter only — no markdown body.** The entire post,
blocks included, lives in the frontmatter:

```yaml
---
title: Which Massage Is Right For You? A Guide to Our 11 Spa Therapies
excerpt: From a firm Deep Tissue reset to a private Jacuzzi soak — a quick guide...
coverImage: /img/spa-therapy-room-hennur.webp
date: '2026-09-25'
mainCategory: Spa & Massage
subCategories:
  - Massage
metaTitle: Which Massage Is Right For You? Spa Therapy Guide | Aurum Astra
metaDescription: A guide to all 11 spa and massage therapies...
blocks:
  - type: paragraph
    text: Eleven therapies, one thing in common...
  - id: choose-therapy
    type: service-cards
    heading: Choose your therapy
    items:
      - name: Signature Body Massage
        tag: Our most-booked hour
        image: /img/signature-body-massage-in-hennur.webp
        description: Long, warm strokes from shoulders to feet...
        duration: 45–120 min
        medium: Warm oil
        pressureLabel: Medium
        pressureLevel: 3
        whatsappMessage: "Hi, I'd love to book a Signature Body Massage. What times are free?"
      # ...10 more items
---
```

Top-level post fields: `title`, `excerpt`, `coverImage`, `coverImageAlt`
(optional, falls back to `title`), `date` (`YYYY-MM-DD`), `mainCategory`
(single value, one of a fixed list — see below), `subCategories` (list of
strings, freeform), `metaTitle` (optional, falls back to `title`),
`metaDescription` (optional, falls back to `excerpt`), `blocks`.

**`mainCategory` replaced the old freeform `tags` field** (added after the
first few posts were written; those posts were migrated). It's a controlled
vocabulary — a Decap `select` widget, not free text — because it's what
drives the category pill shown on the listing page, on each post, and on
related-post cards, and it's the field a future "N posts from this category"
widget would filter on. The current options: `Spa & Massage`,
`Hair Cut & Styling`, `Hair Colour`, `Hair Treatment`,
`Skin Rituals & Treatment`, `Nails & Hands` — matching the site's real
service lines (`ServiceCategories.jsx`). Add a new option to the `select`
widget in `config.yml` before using it on a post; don't invent an off-list
value in a post's frontmatter.

`subCategories` is the finer-grained, freeform half — a specific topic
*within* that main category (e.g. `Bridal` under `Skin Rituals &
Treatment`, or `Deep Tissue` under `Spa & Massage`). `RelatedPosts.jsx`
scores matches by shared `mainCategory` first, shared `subCategories`
second.

`content/blog/CLAUDE.md` carries the same rules for any Claude Code session
that touches this folder.

## 5. How posts get from files into the running site

`src/blog/data/posts.js` — the single source every page imports from:

```js
const files = import.meta.glob(['/content/blog/*.md', '!/content/blog/CLAUDE.md'], {
  eager: true, query: '?raw', import: 'default',
})
// ...splits the `---` frontmatter fence, parses it with js-yaml, derives
// `slug` from the filename, sorts by date descending.
```

Note the explicit exclusion of `CLAUDE.md` — it lives in the same folder and
also ends in `.md`; without excluding it, it gets parsed as a blank "post".

This is the seam the whole system was built around: `BlogListPage.jsx` and
`BlogPostPage.jsx` only ever `import posts from './data/posts.js'`. Where
those posts actually come from can change (as it did — this replaced an
earlier hardcoded array) without touching either page.

## 6. Decap CMS wiring

- `public/admin/index.html` — loads the Decap runtime from
  `/admin/dist/decap-cms.js`.
- `public/admin/dist/` — **generated, not committed** (gitignored). Copied
  from `node_modules/decap-cms` by `scripts/copy-admin-assets.mjs`
  (skips sourcemaps and a duplicate legacy-named build, ~6MB instead of
  ~12MB) via `predev`/`prebuild` npm scripts. Self-hosted rather than
  pulled from the unpkg CDN, so there's no third-party runtime dependency.
- `public/admin/config.yml` — the full schema from §3, plus:
  - `backend: { name: github, repo: chiragjs1108-debug/aurum-astra-connect, branch: main, base_url: <the OAuth Worker's URL>, auth_endpoint: auth }`
  - `local_backend: true` — lets `npm run cms:local` (runs `decap-server`)
    serve real local files with zero auth, for testing without touching
    GitHub. This is how the whole block schema was validated originally.
  - `media_folder: "public/img/blog"`, `public_folder: "/img/blog"` — where
    uploaded images land and how they're referenced.

## 7. Authentication — the OAuth Worker

Decap's `github` backend needs a confidential `client_secret` to exchange an
OAuth code for an access token — that can never live in browser code, so a
small server-side proxy sits in between. `oauth-worker/worker.js` is a
Cloudflare Worker implementing that handshake:

- `GET /auth` — Decap opens this in a popup. Redirects to GitHub's OAuth
  consent screen, stashing a random `state` in a short-lived cookie.
- `GET /callback` — GitHub redirects here with a `code`. The Worker checks
  `state`, exchanges `code` for a token via GitHub's token endpoint
  (server-side, secret never reaches the browser), then returns an HTML
  page that `postMessage`s the token back to the window that opened the
  popup, in Decap's documented message format
  (`authorization:github:success:{...}`).

Deployed to Cloudflare (dashboard-pasted, not CLI) as `aurum-astra-cms-auth`,
with `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET` set as Worker secrets — never
committed to git. Backing it: a GitHub OAuth App whose Authorization
callback URL is the Worker's `/callback`. Whoever authenticates needs push
access to this repo — Decap commits using *their* GitHub permissions, there
is no shared service account.

This is live and confirmed working end-to-end (real login tested on the
production `/admin`).

## 8. Deploy pipeline

Unrelated to the blog specifically, but what actually ships everything:
`.github/workflows/deploy.yml` triggers on push to `main`, runs
`npm install && npm run build`, then FTPs `dist/` to
`connect.aurumastra.in` (`SamKirkland/FTP-Deploy-Action`). The SEO/sitemap
generation in §9 needed no changes here — it rides along inside
`npm run build` via npm's own `pre`/`post` script hooks.

## 9. SEO and sitemap ("Phase 2")

The blog is still client-side rendered, same as the rest of this React SPA
— body content is not prerendered. What *is* real, static, and baked into
the HTML on disk (not just set by JS after load) is each page's `<head>`:
title, meta description, Open Graph tags, canonical link, and `BlogPosting`
JSON-LD — the parts that matter most for search snippets and for
link-preview bots (WhatsApp, Facebook, X, etc.) that never run JavaScript.

- `src/blog/seo/siteInfo.js`, `seoTags.js`, `blogPostingSchema.js` — plain,
  framework-agnostic functions building tag values and JSON-LD from a post.
  No Vite- or browser-only APIs, deliberately, so the exact same files are
  imported both by the React app and by a plain-Node build script.
- `src/blog/seo/useSeo.js` — a hook, used by `BlogPostPage.jsx` and
  `BlogListPage.jsx`, that writes those tags into the live `<head>` on
  mount. This is what keeps tags correct across **client-side** navigation
  (post → post with no full reload) — a static file alone can't do that.
- `scripts/generate-static-blog-pages.mjs` (npm `postbuild`, runs after
  `vite build`) — covers the case a static file *does* matter: a crawler's
  or bot's very first, JS-free request. Takes the already-built
  `dist/index.html` (same JS/CSS bundle every route shares) and writes a
  copy per blog route with just the `<head>` tags swapped, to
  `dist/blog/index.html` and `dist/blog/<slug>/index.html`. Relies on the
  site's existing `.htaccess` serving a directory's `index.html`
  automatically — no server config changes needed.
- `scripts/generate-sitemap.mjs` (npm `prebuild`) — regenerates
  `public/sitemap.xml` from scratch every build: a fixed list of the site's
  static pages plus every file in `content/blog/`. A post can't go missing
  from the sitemap by someone forgetting a manual step, because there is
  no manual step.
- `scripts/lib/loadPostsFromDisk.mjs` — the one bit of real duplication:
  the same frontmatter-parsing logic as `src/blog/data/posts.js`, but
  reading via Node's `fs` instead of Vite's `import.meta.glob`, since the
  build scripts run outside Vite. Kept deliberately small.

Verified end to end: built the project, inspected the raw generated HTML
files directly (title/meta/OG/canonical/JSON-LD all correct, including
against the real "test-post" created live through the CMS), confirmed
`sitemap.xml` lists every post with its real date, and used a real browser
to confirm both a fresh direct load of a static page and client-side
navigation between blog pages keep `<head>` correct.

**What's still not built:** true static pre-rendering of post *bodies*
(a full SSG/hydration migration) — this was deliberately scoped out as
bigger and riskier than the actual SEO gap needed closing. Also not
built: an automated sitemap ping to Google/Bing after deploy (one-time
manual submission in Search Console still covers this).

## 10. Current status vs. what's not built yet

**Live and working:** the full block library, the blog pages (mobile-first,
with header/hamburger nav/footer), cross-links to the rest of the site, the
Decap CMS dashboard with real GitHub auth, the deploy pipeline, and the
per-post SEO tags/schema + sitemap from §9.

**Not built:** full static-rendering of post bodies (see §9's last
paragraph) — everything else from the original roadmap is done.

## 11. Notes for brainstorming content automation

Whatever gets designed for auto-generating and pushing posts, the one fact
that should drive the design: **the CMS is not the source of truth, `content/
blog/*.md` is.** Decap is a UI for producing exactly the file format in §4 —
nothing about automated publishing requires going through Decap's own UI or
API at all. The realistic integration points, roughly in order of how much
they reuse what already exists:

- **Write the file directly via the GitHub API/git**, in the exact YAML
  shape from §4, matching a `type` from §3, committed to `content/blog/` on
  `main` (or a branch + PR, if review-before-publish is wanted). This is
  the same thing Decap itself does — no new infrastructure, just a script
  or agent that knows the schema.
- Whatever generates content still needs to **choose which blocks to use**
  and fill them well (e.g. picking `service-cards` real therapy data vs.
  writing fresh `paragraph`/`card-grid` copy) — that's a content-modeling
  decision, not a plumbing one.
- Images referenced by any block (`image`, `coverImage`, etc.) need to
  already exist under `public/` (or `public/img/blog/` if freshly
  uploaded) — a generation pipeline either reuses existing assets or needs
  its own upload step.
- `id`/`toc` pairing (§3) is manual bookkeeping today; an automated writer
  would need to generate matching anchor IDs itself if it wants a working
  table of contents.
- SEO/sitemap (§9) needs no attention from an automation pipeline — any
  post file that shows up in `content/blog/` gets picked up by the same
  `prebuild`/`postbuild` scripts as one written by hand or through the CMS.
