# Aurum Astra Blog — Phase 2: SEO, Schema & Sitemap

Companion to `docs/blog-architecture.md` (which covers the block system,
content model, and Decap CMS wiring in full). This doc is self-contained
for anyone — or any Claude thread — picking up SEO/schema work specifically,
without needing that other doc open.

## 1. The problem this phase solved

Before this phase, every blog page — the listing and every post — inherited
the exact same generic tags from the site's single `index.html`: one
`<title>`, one meta description, no canonical URL, no Open Graph tags, no
structured data, and no sitemap entry. Fine for a small marketing SPA;
actively bad for a blog meant to rank in search and look right when shared.

## 2. The two things "SEO" actually meant here, and why they're separate

**Body content** (the actual paragraphs, cards, etc. a post is made of) is
still client-side rendered, same as the rest of this React SPA. This phase
deliberately did **not** attempt full static-site generation of post bodies
— that's a much bigger, riskier change (router/entry-point migration,
hydration correctness) for a benefit search engines mostly already get for
free, since Google's crawler executes JavaScript reliably today.

**Per-page `<head>` metadata** (title, description, OG tags, canonical,
JSON-LD) is the part that genuinely can't wait for JavaScript — it's what
search snippets are built from, and it's *all* that link-preview bots
(WhatsApp, Facebook, X/Twitter, etc.) ever see, since none of them execute
JS. This is the actual gap that mattered, and it's fully solved: real,
correct, per-URL `<head>` content sitting in the raw HTML on disk.

## 3. How it works — two runtimes, one shared source of logic

The same tag-building logic runs in two different places, and it's
literally the same files doing it — not two implementations kept in sync
by hand:

```
src/blog/seo/siteInfo.js          — SITE_URL, SITE_NAME, SITE_LOGO, absoluteUrl()
src/blog/seo/seoTags.js           — buildPostSeoTags(post), BLOG_LIST_SEO
src/blog/seo/blogPostingSchema.js — buildBlogPostingSchema(post)
```

These three files are plain functions and constants — no `import.meta.glob`,
no browser-only APIs, nothing Vite-specific. That's deliberate: it's what
lets both of the following import them unmodified.

**Runtime (browser, via Vite):**

```
src/blog/seo/useSeo.js
```

A hook called by both `BlogPostPage.jsx` and `BlogListPage.jsx`. On mount
(and whenever the post being viewed changes), it writes `document.title`
and upserts `<meta>`/`<link rel="canonical">`/`<script type="application/
ld+json">` tags into the live `<head>`. This is what keeps tags correct
during **client-side navigation** — clicking from one post to another
without a full page reload, which a static file alone could never handle.

**Build time (plain Node, after `vite build`):**

```
scripts/generate-static-blog-pages.mjs   (npm "postbuild")
scripts/lib/loadPostsFromDisk.mjs        (shared loader, see §5)
```

Imports the exact same `seoTags.js`/`blogPostingSchema.js` functions
directly — Node can load them as plain ES modules with zero build step,
same as Vite does. For each post (plus `/blog` itself), it takes the
already-built `dist/index.html` — the one file with the correct hashed
`<script>`/`<link>` tags for that build's JS/CSS bundle — and writes a copy
with just the `<head>` swapped in:

```
dist/blog/index.html
dist/blog/<slug>/index.html      (one per post)
```

The site's existing `.htaccess` already serves a directory's `index.html`
automatically for any request that isn't an existing file, so a fresh
request to `/blog/<slug>` gets this real static HTML — no server config
changes were needed.

## 4. The sitemap

```
scripts/generate-sitemap.mjs   (npm "prebuild")
```

Regenerates `public/sitemap.xml` from scratch on every build: a fixed list
of the site's static pages (`/`, `/catalogue`, `/salon`, `/spa`,
`/spa-in-hennur`, the policy pages) plus one `<url>` entry per file
currently in `content/blog/`, using that post's own `date` as `<lastmod>`.
A post cannot go missing from the sitemap by someone forgetting a manual
step, because there is no manual step — add a post, rebuild, it's in there.

`robots.txt` already pointed at `/sitemap.xml` from before this phase; no
change needed there.

## 5. The one real duplication, and why it's there

```
scripts/lib/loadPostsFromDisk.mjs
```

Mirrors `src/blog/data/posts.js`'s frontmatter-parsing logic (same `---`
fence regex, same `js-yaml` parse, same slug-from-filename rule, same
`CLAUDE.md` exclusion) — but reads via Node's `fs` instead of Vite's
`import.meta.glob`, since the build scripts run outside Vite entirely and
can't use a Vite-only API. This ~15-line duplication was a deliberate,
contained tradeoff rather than adding a build step to make the two
runtimes share a loader too.

## 6. Where each SEO field actually comes from (the writer's-eye view)

Everything below is either a field you fill in the Decap dashboard, or
generated automatically — nothing sits in between:

| Field | Entered where | Automatic? |
|---|---|---|
| Meta description | "SEO Description" on the post | You write it (falls back to Excerpt) |
| Cover image alt text | "Cover Image Alt Text" on the post | You write it (falls back to Title) |
| Card/carousel image alt text | "Image Alt Text" on each item | You write it (falls back to that item's Title) |
| Before/after image alt text | "Before/After Image Alt Text" | You write it (falls back to the Before/After label) |
| `og:title`, `og:description`, `og:image`, `og:url` | — no field | Fully automatic — built from Title/SEO Title, Excerpt/SEO Description, Cover Image |
| Canonical URL | — no field | Fully automatic — derived from the post's filename/slug |
| `BlogPosting` JSON-LD | — no field | Fully automatic — built from Title, SEO Description/Excerpt, Cover Image, Publish Date, plus the fixed business name/logo in `siteInfo.js` |

The fields with no CMS field at all is deliberate, not a gap: canonical
URLs and JSON-LD are exactly the kind of thing that's actively harmful if
hand-typed and wrong (a stale canonical, malformed schema), and there is no
legitimate case where they should say anything other than what the post's
own fields already say.

## 7. Verification actually performed

Not just written and assumed correct:

- Built the project and read the raw generated HTML files directly
  (`dist/blog/<slug>/index.html`) — confirmed correct title, meta
  description, OG tags, canonical link, and JSON-LD, including against the
  real `test-post` created live through the CMS (not just the hand-written
  sample posts).
- Read the generated `sitemap.xml` — confirmed every post present with its
  real `date`, alongside all static pages.
- Used a real browser (Playwright) to confirm: a fresh direct load of a
  static per-post URL renders the full app correctly with zero console
  errors; client-side navigation from the blog list into a post updates
  title/canonical/JSON-LD live; navigating away to Home resets the title
  to the sitewide default; Home/Catalogue/Salon/Spa are all unaffected.
- Verified the alt-text fallback behavior (§6) against an existing,
  unmodified post — confirmed every image falls back to sensible text
  with zero content migration required.

## 8. Extending this later

- **New site-wide fact** (changed business name, new logo, etc.) →
  `src/blog/seo/siteInfo.js` is the single place; both runtimes pick it up
  automatically.
- **Change what's in the JSON-LD** → `blogPostingSchema.js` only; no need
  to touch the build script or the React hook.
- **A static page outside `content/blog/` changes meaningfully** → update
  its `lastmod` in the `STATIC_ROUTES` array in `generate-sitemap.mjs` by
  hand — those aren't derived from anything on disk.
- **Full body prerendering**, if ever wanted — this phase deliberately
  stopped short of it (see §2). It would mean adopting something like
  `vite-react-ssg` or an actual headless-browser snapshot step, migrating
  the router/entry point, and dealing with hydration correctness. A much
  larger project than this one, not a quick follow-on.
