---
name: blog-content-pipeline
description: Runs the Aurum Astra blog's automated content pipeline end to end — reconciling the Site Pages Reference sheet against the live repo, planning new posts from the Blog Content Editorial sheet, drafting them (sourcing or generating images) into Drive for human review, and publishing posts marked Approved to Publish as real commits. This is the scheduled automation designed in docs/blog-content-automation-phase3.md; read that doc first if anything here is unclear on the "why". Use whenever asked to run, check, advance, or "process" the blog content pipeline or editorial sheet, and every time a scheduled Routine fires for this purpose.
---

# Blog Content Pipeline

Full design rationale lives in `docs/blog-content-automation-phase3.md` —
read it if something here needs more context. This file is the operational
version: concrete tool calls, in order. Run every step below on every
firing; a given run may have work at some steps and nothing at others.

**Load the Google Sheets and Google Drive connectors** at the start if
their tools aren't already available (`ToolSearch` for
`mcp__Google_Sheets__*` and `mcp__Google_Drive__*`), and read
`docs/blog-architecture.md` for the exact frontmatter/block schemas before
writing any post content — Step 2 depends on getting that shape exactly
right.

Known spreadsheet/folder IDs (skip the Drive search if these still resolve;
re-search by title if a call reports the ID unknown):

| What | ID |
|---|---|
| Blog Content Editorial (sheet) | `1E6HERRmUcthqkwaXQVvebHUBAjffZQCrU4cjVT6ugLE` |
| Media Library (sheet) | `1HAqw5v4Vo3G7XldoTq7W6pEoltoo-wyoQ9bVoD5Oay8` |
| Site Pages Reference (sheet) | `1kv5R8LUdul14vKwm_PGDSqXhn322nk2Hhk0wd4xa8QY` |
| Drafts (Drive folder) | `1-z-KEmxeQbeY34shkLqhD05CAxfYhX7e` |
| AI-generated Media Library (Drive folder) | `1FvrxJbu0_HKriipdCyyQngYAoGHSPwKj` |
| Real Media Library (Drive folder) | `1SzamNcrCjjNZWVcSOXH5FEe322UTugfA` |

## Step 0 — Reconcile Site Pages Reference

1. List `content/blog/*.md` (exclude `CLAUDE.md`) and derive each post's URL
   path (`/blog/<filename-without-.md>`).
2. Read the Site Pages Reference sheet's `URL Path` column
   (`get_values`, range `Sheet1!B:B`).
3. For any post URL not already present, read that post's frontmatter
   (title, excerpt) and append a row: Title, URL Path, Focus Primary
   Keyword (best guess from the post's `mainCategory`/`subCategories` if no
   Editorial row exists for it — see step 1.4 below for the normal case),
   Excerpt, `Added By: Claude — reconciled`. Use `append_values` so you
   never have to know the current last row.
4. Never edit or remove a row that's already there — this step only adds
   missing ones.

## Step 1 — Plan

1. Read the Editorial sheet (`get_values`, `Sheet1!A:K`) for rows whose
   `Schedule date` has arrived and whose `Status` is blank or `Idea`.
2. For each such row:
   - **Category.** If `Main Category` is already filled with a value that
     matches an option in `public/admin/config.yml`'s `mainCategory`
     field, use it. If it's filled with something that *doesn't* match,
     that's the user registering a new category by using it — run the
     `blog-category-generator` skill with that value first, then continue.
     If it's blank, decide the best-fitting option yourself from the
     topic. Fill in `Sub Categories` either way.
   - **Internal links.** Cross-reference `Primary/Secondary Keywords`
     against the Site Pages Reference sheet (all rows, both static and
     blog) and the live post list from Step 0. If
     `Internal-linking directions` already has something, treat it as a
     requirement and build around it; otherwise decide from your own
     judgment of what's genuinely relevant. Overwrite the cell with what
     you actually chose, not what was asked for.
   - **Blocks.** Decide which of the 23 block types (see
     `blog-architecture.md`) this post needs and how many of each, and
     which ones need images. Write it into `Blocks Plan`.
   - **Images.** Write `Image Prompts` as a numbered list, one line per
     image slot across all blocks (see the Phase 3 doc §4.2 for the exact
     format) — a post with a cover, a 4-item card-grid, and a before/after
     block needs 6 numbered entries, not one.
   - Write all of the above back to the row (`update_values` on that row's
     range) and set `Status` to `Planned`.

## Step 2 — Draft

For each row at `Planned`:

1. **Source every image slot**, in order, real → reuse → generate:
   - Read the Media Library sheet. For a real match: filter to
     `Source = Real`, compare each row's `What it shows` against the
     slot's needed subject; if one fits, note its filename (it lives in
     the Real Media Library folder).
   - No real match: filter to `Source = AI-generated`, same comparison
     against past-generated images.
   - No match at all: generate one (see "Generating an image" below), then
     append a new Media Library row for it
     (`Source: AI-generated`, `Intended Use: Blog`) via `append_values`.
2. **Write the full post.** Frontmatter + `blocks` array matching
   `public/admin/config.yml`'s schema exactly (every field Decap defines,
   including `mainCategory`, `subCategories`, alt-text fields, `metaTitle`/
   `metaDescription`) — this is the same shape a human would produce
   through the CMS, just assembled by hand. Weave in the internal links
   decided in Step 1 naturally within the copy, not as a bolted-on list.
3. **Stage the draft for review** in its own subfolder under Drafts
   (`create_file` a folder named after the post's slug inside the Drafts
   folder), containing:
   - A Google Doc with the full post text (title, excerpt, every block's
     content) and, for each image slot, a line naming which file fills it.
   - A copy of every image file the post uses, placed in the same folder,
     so opening the folder shows the whole post — text and images
     together — without depending on inline-image embedding in the Doc
     (untested and fetches from a public URL, which a private Drive file
     usually isn't).
4. Set `Status` to `Drafted`.

### Generating an image

**Read `docs/brand-guidelines.md` before generating anything** and append
its fixed style suffix to every prompt — including its Indian-ethnicity
rule whenever a person appears in the image. This is a hard requirement,
not a stylistic default: the business is based in Bengaluru, and a
generated face defaulting to a non-Indian appearance misrepresents the
actual clientele.

Two tiers, in order — try the first, fall back to the second, and only fall
back to a placeholder if both are unavailable:

**1. Gemini (paid), authenticated automatically — no key handling needed
in the command at all.** The Gemini key lives as this environment's API
credential (Edit cloud environment → API credentials → `GEMINI_API_KEY`,
scoped to `generativelanguage.googleapis.com`), which injects the
`x-goog-api-key` header into any outbound call to that host transparently.
Verified directly: a call with zero auth handling and no
`GEMINI_API_KEY` env var present still reached Google authenticated as the
right project (confirmed via a `402` billing error, which only happens
*after* successful auth — an actually-unauthenticated call gets a `403`
instead). So: just call the API plainly, nothing to read or pass.

There is no separate "Imagen" model any more — image generation is built
into Gemini's own models, called through `generateContent` (not the older
`:predict` endpoint). The current stable model is `gemini-3.1-flash-image`:

```bash
curl -s -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent" \
  -H "Content-Type: application/json" \
  -d "{\"contents\":[{\"parts\":[{\"text\":\"<the slot's prompt>, <docs/brand-guidelines.md fixed style suffix, plus the Indian-ethnicity line if a person is in the shot>\"}]}]}"
```

If that model name 404s (Google renames/versions these), call
`GET https://generativelanguage.googleapis.com/v1beta/models` (same,
no key needed) and pick a current model whose name contains `image` from
the list, rather than guessing further names. A `402`/`429` billing or
quota error means this tier is unavailable right now (as of this writing,
this is exactly the state it's in — the underlying billing account's
prepay balance is still settling) — move to tier 2, don't retry in a loop.

The result's `candidates[0].content.parts[]` contains a part with
`inlineData.data` — a base64 PNG. Decode it to a file, then convert to
`.webp` with the repo's own converter, since every existing image on the
site is `.webp`:

```bash
node scripts/convert-to-webp.mjs /tmp/generated.png /tmp/generated.webp
```

**2. Canva — good for preview and quality, confirmed NOT usable for
automated publish-quality output.** `generate-image` produces genuinely
good, on-brief results (verified against real Aurum Astra prompts, not
just generically) — but there is no way, through any Canva tool available
in this pipeline, to pull the full-resolution file back out:

- `get-assets` only ever returns a small, signed, capped thumbnail
  (200×112), regardless of the real image's resolution (confirmed against
  a 1680×944 source) and regardless of account tier (confirmed on a Canva
  Pro account) or network access (confirmed with `canva.com` and
  `media.canva.com` both allowed).
- `export-design` needs an actual design (`D...` id) — a generated image
  is a MEDIA asset, not a design, and no available tool faithfully wraps
  one into a design without risking Canva regenerating or altering it.

So: **do not treat Canva as an automated fallback for images actually
committed to the site.** It's useful for showing the user a preview of
what a prompt would look like, or for the user to manually open the
"Open generated image" link and download full-resolution through Canva's
own web UI themselves — but the pipeline's only real automated path for a
publish-quality image is tier 1 (Gemini). If Gemini is unavailable, skip
straight to the placeholder-note fallback below; don't burn a generation
call on Canva expecting a usable file to come out of it.

Once a usable full-resolution image is actually in hand (from Gemini, or
a human-downloaded Canva file placed manually into the Real Media
Library), convert it to `.webp` the same way.

**Free-tier Gemini keys cannot do either of the above — don't try them.**
Verified directly: both `gemini-3.1-flash-image` and
`gemini-2.5-flash-image` return `429` with `limit: 0` for
`generate_content_free_tier_requests` on a free-tier key. This is a flat
product-tier restriction, not a rate limit that clears with time, so a free
key belongs nowhere in this fallback chain for images specifically (it's
fine for other things, just not this).

**If both tiers are unavailable** (no `GEMINI_API_KEY` and Canva's tools
can't be loaded or fail), skip generation for that slot, leave a clear
placeholder note in the draft instead, and say so plainly in your final
report — don't block the whole row on one missing image.

Either way, upload the result to the AI-generated Media Library Drive
folder (`create_file` with `base64Content`), then log it in the Media
Library sheet as described above.

## Step 3 — Review

No action. A human reviews the Drive draft and edits it directly if
wanted. This step exists only so Steps 0, 1, 2, and 4 all make sense as one
list — there's nothing to do here on any given run.

## Step 4 — Publish

For each row at `Approved to Publish`:

1. Read the reviewed draft (text may have changed since Step 2 — always
   re-read, never republish what you drafted from memory).
2. Write `content/blog/<slug>.md` with the final frontmatter + blocks.
3. Download each image file from the draft's Drafts subfolder and write it
   to `public/img/blog/<filename>` (already `.webp` from Step 2, or convert
   now if the user swapped in something else during review).
4. Commit and push directly to `main` — the CMS itself has no PR gate for
   a human's save, and this post already passed its human review in Drive
   during Step 3, so requiring a second review here would just add
   friction without adding safety. Use plain `git add` / `commit` / `push`
   from a checkout of this repo (or the GitHub MCP tools if no local
   checkout is available in this session). This is exactly what triggers
   the existing `prebuild`/`postbuild` scripts and the GitHub Actions FTP
   deploy — nothing extra to do for SEO, sitemap, or the deploy itself.
5. Append the new post to Site Pages Reference (`Added By: Claude —
   published`), same as Step 0 does for a reconciled post.
6. Set `Status` to `Published`.

## Setup this pipeline needs once

- **A *paid* Gemini key** (a free-tier key can't generate images at all —
  see above), added as this environment's API credential (Edit cloud
  environment → API credentials → name it `GEMINI_API_KEY`, allowed website
  `generativelanguage.googleapis.com`, custom header `x-goog-api-key` with
  no prefix) — verified working this way: calls authenticate with no key
  handling in the command at all. This is the only real automated image
  source — see §Generating an image above for why Canva isn't a usable
  substitute for it, whatever the account tier.
- **A scheduled Routine** pointed at this skill (`create_trigger`,
  `create_new_session_on_fire: true`, prompt: run this pipeline) is what
  makes this actually recurring rather than something run by hand.

## Report back

At the end of a run, summarize plainly: how many rows moved at each step
(reconciled / planned / drafted / published), any image slot that had to
skip generation, and anything that needed a judgment call worth flagging
back to the user.
