# Aurum Astra Blog — Phase 3: Content Automation (Design)

**Status: design locked, not yet built.** This doc records the agreed design for
the automated content pipeline before any of it is implemented, so building
can start from a fixed spec instead of a moving target. Companion to
`docs/blog-architecture.md` (Phase 1 — the block system, content model, and
Decap CMS) and `docs/blog-seo-phase2.md` (Phase 2 — per-post SEO/schema and
the sitemap). Read this doc on its own; it doesn't repeat Phase 1/2 content,
only points at it where relevant.

## 1. The problem this phase solves

Writing a post block-by-block in the Decap CMS dashboard doesn't scale once
the goal is many posts a day. Phase 3 replaces the manual-assembly step with
an automated pipeline, while keeping a human review gate before anything
goes live — the goal is speed, not removing editorial control.

## 2. The principle this pipeline relies on

From Phase 1 (`blog-architecture.md` §11): **`content/blog/*.md` is the
actual source of truth, not Decap's dashboard.** Decap is one way to produce
a correctly-shaped file and commit it; it is not the only way. Any process —
including this automation — that writes a file in the same shape and pushes
it to the repo publishes identically to using the CMS UI. Nothing about this
pipeline needs Decap's API or its OAuth flow; it only needs to produce files
Decap itself would have produced, and commit them the same way.

## 3. The control surface: three Google Sheets + two Drive folders

Everything the automation reads or writes lives inside one Drive folder:
[Aurum Astra Connect Blog Content](https://drive.google.com/drive/folders/1bkhZ5higEWh50Z_yEGr7sF-Ov87kO4jx).

```
Aurum Astra Connect Blog Content/
├── 1 Aurum Astra Connect Blog Content Editorial   (Sheet — content pipeline)
├── 2 Aurum Astra Connect Media Library            (Sheet — asset index)
├── 3 Aurum Astra Connect Site Pages Reference     (Sheet — internal-linking map)
├── 1 Drafts/                                       (Folder — per-post review docs)
├── 2 Aurum Astra Connect Media Library/            (Folder — AI-generated images, reusable)
└── 3. Real Media Library/                          (Folder — real photos/videos/creatives)
```

### 3.1 Blog Content Editorial (the pipeline)

[Sheet link](https://docs.google.com/spreadsheets/d/1E6HERRmUcthqkwaXQVvebHUBAjffZQCrU4cjVT6ugLE/edit)
— one row per planned post, moving left to right as it fills in, top to
bottom as its `Status` advances.

| Column | Who writes it | Purpose |
|---|---|---|
| Schedule date | You | When this post should be drafted |
| Topic Title | You | The post's subject |
| Meta details | You | Notes on angle, tone, anything the writer should know |
| Primary/Secondary Keywords | You | SEO targets for this post |
| Internal-linking directions | You | Specific pages you want linked, if any |
| Related directions | You | Any other constraints or ideas |
| Main Category | Claude | One of the site's fixed categories (see below) |
| Sub Categories | Claude | Specific topics within that category |
| Blocks Plan | Claude | Which of the 23 block types this post will use, how many of each, and which need images |
| Image Prompts | Claude | A numbered list, one line per image slot the post needs (see §4.2) |
| Status | You (Claude only reads it) | `Idea → Planned → Drafted → Approved to Publish → Published` |

Claude never writes to `Status`. You are the only writer of that column —
Claude reads it to know what to do next, and moving a row to
`Approved to Publish` is the only thing that makes a post go live.

**`Internal-linking directions` changed ownership.** It was originally a
column you'd fill in as an instruction. It's now primarily Claude's: since
Claude is the one writing the content, deciding which internal links
actually serve the post's SEO is Claude's judgment call, made by
cross-referencing the post's keywords against the Site Pages Reference sheet
(§3.3) and the live list of existing posts. If you write something in this
cell before planning runs, Claude treats it as a hard requirement and links
it in addition to whatever else it decides. Either way, Claude overwrites
the cell with the actual set of pages it linked, so the row documents what
happened, not just what was asked for.

**`Related directions` is unchanged** — still your free-form notes, read but
never written by Claude.

**`Main Category` / `Sub Categories`** are the post's place in the site's
taxonomy (`docs/blog-architecture.md`'s post-fields section has the full
design — this replaced the old freeform `tags` field). Claude decides both
during planning from the topic, the same "honors a pre-filled requirement,
otherwise decides itself" pattern as internal linking: if you name a
category here beforehand, Claude uses it; otherwise it picks the best-fitting
one of the six fixed options (`Spa & Massage`, `Hair Cut & Styling`,
`Hair Colour`, `Hair Treatment`, `Skin Rituals & Treatment`,
`Nails & Hands`) and adds specific sub-category topics. This is what makes a
future "N posts from this category" widget possible without a manual tagging
pass — every post is categorized at the moment it's planned, not after the
fact.

### 3.2 Media Library (the asset index)

[Sheet link](https://docs.google.com/spreadsheets/d/1HAqw5v4Vo3G7XldoTq7W6pEoltoo-wyoQ9bVoD5Oay8/edit)
— describes every file in both media folders below, so Claude can search by
description rather than having to open and look at every image.

| Column | Who writes it |
|---|---|
| Filename | You (real assets) / Claude (AI-generated) |
| Source (Real / AI-generated) | You / Claude |
| What it shows | You / Claude |
| Size/Dimensions | You / Claude |
| Type | You / Claude |
| Intended Use (Blog/GMB/Instagram/Offer/General) | You / Claude |

Claude appends a row here itself every time it generates and archives a new
AI image — this is fully supported now that the Google Sheets connector is
live (`append_values`/`update_values`), so the library documents itself
without you doing anything for the AI-generated half. For real assets, you
add the row yourself when you upload something new to the Real Media Library
folder — not a daily task, only when you actually have something new.

### 3.3 Site Pages Reference (the internal-linking map)

[Sheet link](https://docs.google.com/spreadsheets/d/1kv5R8LUdul14vKwm_PGDSqXhn322nk2Hhk0wd4xa8QY/edit)
— `Page Title | URL Path | Focus Primary Keyword | Excerpt / What it's about | Added By`.

Two kinds of rows, two owners:

- **Static pages** (Catalogue, Salon, Spa, Spa in Hennur, policy pages) —
  you maintain these by hand, same as before. `Added By: You`.
- **Blog posts** — Claude's responsibility, in two ways:
  1. **At publish time** (§6, Step 4), the moment Claude commits a new post,
     it appends that post's row here directly — Title and Excerpt from the
     post itself, URL Path from its slug, Focus Primary Keyword carried over
     from that row's own `Primary/Secondary Keywords` cell on the Editorial
     sheet. `Added By: Claude — published`.
  2. **Periodic reconciliation** (§6, Step 0), run at the start of every
     automation pass: list every file in `content/blog/`, compare against
     the URL Paths already logged here, and add a row for any post that's
     live but missing — a post published through Decap directly, or by a
     different thread working on the same repo. Its Focus Primary Keyword is
     inferred from the post's own tags/title, since no Editorial row exists
     for it. `Added By: Claude — reconciled`.

Reconciliation only ever **adds** a missing row; it never edits or removes
one that's already there, so a static-page row you wrote is never touched by
it. This sheet is now the single place to see every page on the site, static
or blog, rather than splitting the answer between a sheet and a live repo
read — but the underlying data for blog rows still ultimately comes from the
repo, the same source-of-truth principle as everywhere else in this
pipeline.

### 3.4 The two media folders

- [2 Aurum Astra Connect Media Library](https://drive.google.com/drive/folders/1FvrxJbu0_HKriipdCyyQngYAoGHSPwKj)
  — AI-generated images land here, building up a reusable stock library over
  time. A generated image is never used once and discarded; it stays
  available for a future post on a similar topic.
- [3. Real Media Library](https://drive.google.com/drive/folders/1SzamNcrCjjNZWVcSOXH5FEe322UTugfA)
  — your actual photos, videos, and other creative assets (including ones
  made for GMB, Instagram, or offers that aren't for the blog at all —
  the Media Library sheet's `Intended Use` column is what filters those out
  when the automation is picking specifically for a blog post).
- [1 Drafts](https://drive.google.com/drive/folders/1-z-KEmxeQbeY34shkLqhD05CAxfYhX7e)
  — one Google Doc per post, created at drafting time, for your review
  before anything is approved.

## 4. Image sourcing: real first, reuse second, generate last

For every image slot a post's block plan calls for, in this order:

1. **Check the Real Media Library** (via the Media Library sheet's
   descriptions, filtered to entries whose `Source` is Real) for a real photo
   or video that genuinely fits the topic. A real photo of the actual salon
   beats a generated one whenever one exists.
2. **If nothing real fits, check the AI-generated Media Library** for an
   already-generated image close enough to reuse — saves API cost and, over
   time, gives posts a consistent visual identity instead of every image
   looking like a one-off.
3. **Only if neither fits, generate a new image** and archive it into the
   AI-generated folder plus a new row in the Media Library sheet
   (`Source: AI-generated`), so it's available for the next post that needs
   something similar.

### 4.1 How generation actually happens

Confirmed this session: this environment can reach
`generativelanguage.googleapis.com` directly, so Claude can call Google's
Gemini image API itself — no manual round-trip through the Google AI Studio
web UI is needed. The model landscape moved since this design was first
written, so this section reflects what was actually verified working, not
the original plan:

- **There's no separate "Imagen" model any more.** Image generation is
  built directly into Gemini's own models, branded "Nano Banana" —
  `gemini-3.1-flash-image` is the current stable one, called through
  `generateContent` rather than the older `:predict` endpoint Imagen used.
- **Two-tier fallback, verified for real:**
  1. **Gemini (paid)** — works once the project's billing is actually
     funded. Tested and confirmed 402 (`RESOURCE_EXHAUSTED`,
     "prepayment credits are depleted") when the billing account's balance
     was ₹0, which is expected, not a bug.
  2. **Canva** — free, already connected, no billing dependency on the
     Gemini project at all. Tested end-to-end (prompt → generated image)
     and produced a genuinely usable, on-brief result with zero setup.
  A free-tier Gemini key is **not** a usable third tier: tested directly,
  both current image models return a flat `limit: 0` for
  `generate_content_free_tier_requests` — a product-tier restriction, not
  a quota that clears with time. Free-tier Gemini keys are fine for other
  things; they cannot generate images at all.
- **Prompting:** Claude writes one prompt per image slot during planning,
  grounded in the post's topic/keywords, plus a fixed style suffix (applied
  to every generation) so images read as one consistent brand rather than a
  different look per post.
- **Cost:** the paid tier draws from the user's Google Cloud billing
  account (Mahaguru-Core project); the Canva tier is free within the user's
  Canva plan limits. Per-image cost on the Gemini side is a few cents;
  check current pricing before relying on volume estimates, since rates
  change.
- **API key handling:** the paid Gemini key is stored only as a secret
  (`GEMINI_API_KEY`) on whatever environment runs the scheduled automation
  — never committed to the repo, same rule as the Decap OAuth Worker's
  secrets (`oauth-worker/README.md`). Canva needs no key at all, just the
  connector enabled.

### 4.2 A post needs more than one image

`Image Prompts` is a numbered list, one line per image slot the post
actually needs, each labeled with the block it belongs to — not a single
prompt for the whole post. A post with a cover image, a 4-item card-grid,
and a before/after block has 6 slots, for example:

```
1. Cover — [prompt]
2. Card-grid item 1 (Hair Spa Oil) — [prompt]
3. Card-grid item 2 (Head Massage) — [prompt]
4. Card-grid item 3 (Scalp Treatment) — [prompt]
5. Before/after, before — [prompt]
6. Before/after, after — [prompt]
```

The numbers match the slots named in `Blocks Plan`. At drafting time (§6,
Step 2), Claude works through this list slot by slot, running the real →
reuse → generate decision (§4) independently for each one — a post's cover
might come from the Real Media Library while its card-grid items are freshly
generated, all in the same pass.

## 5. Where images actually land

Confirmed from the live repo: Decap's media folder is `public/img/blog`
(`public_folder: "/img/blog"` in `public/admin/config.yml`), and every
existing post already references images as `/img/blog/<filename>`
(`coverImage`, block `image` fields). Generated and real images both need to
end up as files at that path before a post can reference them.

**Images are only committed into the repo at actual publish time**, not the
moment they're uploaded to Drive or generated by Imagen. Until then they're
staged in Drive. This keeps `public/img/blog/` free of anything that isn't
actually part of a live post — no orphaned raw uploads or generated images
accumulating in the production folder. At publish time, the automation
downloads the chosen file(s) from Drive, converts to `.webp` if needed
(matching the site's existing image convention), and commits them alongside
the post's markdown file.

## 6. The automation flow

A scheduled Claude Code session (cron-triggered) runs the following, plus
the same logic is available on demand via a manual chat command for
anything that shouldn't wait for the next scheduled run.

**Step 0 — Reconcile.** Before anything else, list `content/blog/*.md` in
the repo and compare against the Site Pages Reference sheet's URL Paths.
Append a row for any post that's live but not yet listed (§3.3) —
`Added By: Claude — reconciled`. This runs every pass, so a post published
outside this pipeline never stays untracked for long.

**Step 1 — Plan.** Read the Editorial sheet for rows whose `Schedule date`
has arrived and whose `Status` is empty/`Idea`. For each:
- Decide `Main Category` (one of the fixed options) and `Sub Categories`
  from the topic, honoring anything pre-filled as a requirement. If a
  pre-filled `Main Category` doesn't match any current option, that's not
  invalid input — it's the user registering a new category by using it.
  Run the `/blog-category-generator` skill with that value before
  continuing, which registers it everywhere the list is kept (CMS config,
  both architecture docs, this sheet's own column note), then proceed with
  the row using the newly added category.
- Decide which block types the post needs, how many of each, and which need
  images; write that into `Blocks Plan`.
- Write the full numbered image-slot list into `Image Prompts` (§4.2) — one
  entry per image the post's blocks actually need, not one per post.
- Decide internal links: cross-reference the post's keywords against the
  Site Pages Reference sheet (both static and blog rows). If
  `Internal-linking directions` already has something in it, treat it as a
  requirement and build around it; otherwise decide entirely from SEO
  judgment. Overwrite the cell with the actual pages chosen.
- Set `Status → Planned`.

**Step 2 — Draft.** For rows at `Planned`: work through every slot in
`Image Prompts` in order, running the real → reuse → generate decision (§4)
independently for each one; write full post content — frontmatter, all
blocks, SEO fields, and the internal links decided in Step 1 — following the
exact schemas in `blog-architecture.md`; create a Google Doc in `Drafts/`
containing the text and every chosen image together for review; set
`Status → Drafted`.

**Step 3 — Review.** You open the Drive draft, edit anything you want
directly in the doc.

**Step 4 — Publish.** You set `Status → Approved to Publish` in the sheet.
On the next scheduled pass (or immediately, if you give the command in
chat), the automation converts the reviewed draft into a real
`content/blog/<slug>.md` file matching Decap's exact schema, commits any
images it needs into `public/img/blog/`, commits and pushes both — which
runs the existing `prebuild`/`postbuild` scripts (sitemap regeneration,
static per-post `<head>` injection from Phase 2) and triggers the existing
GitHub Actions FTP deploy, same as a manual CMS save does today. Appends the
new post's row to Site Pages Reference (§3.3, `Added By: Claude —
published`). Sets `Status → Published`.

**Manual override, either direction:** you can always say "draft row N now"
or "publish row N now" in chat to act outside the schedule, without waiting
for the next cron pass.

## 7. What's confirmed vs. what's still needed before building

Confirmed this session:
- Google Drive connector: read/download/create/search all work; no
  in-place content edit (irrelevant now that Sheets has its own connector).
- Google Sheets connector: full read/write, including appending rows —
  live and tested (used to create and format all three sheets above).
- Network path to Google's Imagen/Gemini API is open from this environment.
- All three sheets and both media folders exist, with headers set and
  verified.

Still needed before the automation can actually run:
- A Gemini API key from AI Studio, to be stored as a secret on the
  scheduled environment.
- The cron schedule itself (how often the automation checks the sheets).
- The actual build: the scripts/prompting that carry out Steps 1–4 above.

## 8. Quick links

- [Aurum Astra Connect Blog Content](https://drive.google.com/drive/folders/1bkhZ5higEWh50Z_yEGr7sF-Ov87kO4jx) (root folder)
- [Blog Content Editorial](https://docs.google.com/spreadsheets/d/1E6HERRmUcthqkwaXQVvebHUBAjffZQCrU4cjVT6ugLE/edit)
- [Media Library sheet](https://docs.google.com/spreadsheets/d/1HAqw5v4Vo3G7XldoTq7W6pEoltoo-wyoQ9bVoD5Oay8/edit)
- [Site Pages Reference](https://docs.google.com/spreadsheets/d/1kv5R8LUdul14vKwm_PGDSqXhn322nk2Hhk0wd4xa8QY/edit)
- [Drafts folder](https://drive.google.com/drive/folders/1-z-KEmxeQbeY34shkLqhD05CAxfYhX7e)
- [AI-generated Media Library folder](https://drive.google.com/drive/folders/1FvrxJbu0_HKriipdCyyQngYAoGHSPwKj)
- [Real Media Library folder](https://drive.google.com/drive/folders/1SzamNcrCjjNZWVcSOXH5FEe322UTugfA)
