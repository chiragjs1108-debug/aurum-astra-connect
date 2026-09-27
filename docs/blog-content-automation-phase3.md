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
| Blocks Plan | Claude | Which of the 23 block types this post will use, and how many |
| Image Prompts | Claude | One generation prompt per image slot the plan needs |
| Status | You (Claude only reads it) | `Idea → Planned → Drafted → Approved to Publish → Published` |

Claude never writes to `Status`. You are the only writer of that column —
Claude reads it to know what to do next, and moving a row to
`Approved to Publish` is the only thing that makes a post go live.

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
— `Page Title | URL Path | Focus Primary Keyword | Excerpt / What it's about`.

You maintain this one by hand, and it only needs to cover the site's
**static pages** (Catalogue, Salon, Spa, Spa in Hennur, policy pages) — the
small, fixed set that doesn't already carry SEO metadata anywhere else.
**Blog posts are deliberately not logged here.** Every published post's
title, excerpt, and keyword already live in its own frontmatter in
`content/blog/`, so the automation reads that list straight from the repo at
planning time — always current, nothing to keep in sync, the same principle
the sitemap already uses (Phase 2 §4). When planning a new post's internal
links, Claude checks both: this sheet for static pages, and the live repo
listing for other blog posts.

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
`generativelanguage.googleapis.com` directly (a real, authenticated API
error came back, not a network-level block), so Claude can call Google's
Imagen/Gemini image API itself — no manual round-trip through the Google AI
Studio web UI is needed.

- **Model:** Imagen (Google's text-to-image model) for fresh photographic
  images — treatment shots, product shots, interiors. Gemini's own image
  model ("Nano Banana") is kept in reserve for posts that need a visually
  consistent series (same look reused across several images in one post),
  since it's stronger at that than at fresh photorealism.
- **Prompting:** Claude writes one prompt per image slot during planning,
  grounded in the post's topic/keywords, plus a fixed style suffix (applied
  to every generation) so images read as one consistent brand rather than a
  different look per post.
- **Cost:** paid from the user's existing Google AI Studio Pro credits
  ($100 balance as of this design). Per-image cost is a few cents; exact
  current pricing should be checked against AI Studio's pricing page before
  building, since rates change.
- **API key handling:** a Gemini API key from AI Studio, stored only as a
  secret on whatever environment runs the scheduled automation — never
  committed to the repo, same rule as the Decap OAuth Worker's secrets
  (`oauth-worker/README.md`).

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

**Step 1 — Plan.** Read the Editorial sheet for rows whose `Schedule date`
has arrived and whose `Status` is empty/`Idea`. For each: decide which block
types the post needs and how many, write that into `Blocks Plan`; write one
image-generation prompt per image slot into `Image Prompts`; set
`Status → Planned`.

**Step 2 — Draft.** For rows at `Planned`: pick images per §4 (real → reuse
→ generate, archiving any newly generated image); write full post content —
frontmatter, all blocks, SEO fields — following the exact schemas in
`blog-architecture.md`, cross-referencing the Site Pages Reference sheet and
the live list of existing posts for natural internal links; create a Google
Doc in `Drafts/` containing the text and the chosen images together for
review; set `Status → Drafted`.

**Step 3 — Review.** You open the Drive draft, edit anything you want
directly in the doc.

**Step 4 — Publish.** You set `Status → Approved to Publish` in the sheet.
On the next scheduled pass (or immediately, if you give the command in
chat), the automation converts the reviewed draft into a real
`content/blog/<slug>.md` file matching Decap's exact schema, commits any
images it needs into `public/img/blog/`, commits and pushes both — which
runs the existing `prebuild`/`postbuild` scripts (sitemap regeneration,
static per-post `<head>` injection from Phase 2) and triggers the existing
GitHub Actions FTP deploy, same as a manual CMS save does today. Sets
`Status → Published`.

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
