---
name: blog-category-generator
description: Adds a new Main Category option to the Aurum Astra blog's controlled taxonomy and updates every place that lists the fixed options — the Decap CMS config, the BlogPosting JSON-LD schema builder, both architecture docs, and the live content-automation Google Sheet — so a new category is never added by hand in one spot and forgotten in the others. Use whenever the user asks to add, create, register, or introduce a new blog category, main category, taxonomy option, or service line for the blog (e.g. "add a Bridal Packages category", "we're launching a new service, need a category for it", "register 'Grooming' as a main category"). Also use this proactively, without being asked, whenever content-planning work (reading the "Aurum Astra Connect Blog Content Editorial" sheet) turns up a Main Category value on a row that isn't already in the fixed list — that's the user registering a new category by using it, not a mistake to correct or ignore.
---

# Blog Category Generator

The blog's `mainCategory` field is a **controlled vocabulary** — a fixed
list, not free text — because it drives the category pill shown across the
blog and is what a future category-filtered widget would key off (see
`docs/blog-architecture.md`'s post-fields section for the full rationale).
That list is currently repeated, by hand, in five separate places (plus a
sixth spot, `blogPostingSchema.js`, that reads it generically and normally
needs no change — see step 4). Adding a category means updating all of them
together, or the list quietly drifts —
Decap ends up offering something the content-automation pipeline doesn't
know about, or the reverse. This skill does the update mechanically, every
time, so it never drifts.

## Input

The new category name, as plain text (e.g. `Bridal Packages`). If it wasn't
given, ask for it before doing anything else.

**This skill has two ways in.** Most often it's invoked directly, with a
name in hand. But it also applies during content planning: if a row on the
Editorial sheet has a `Main Category` value that doesn't match any option
currently in `public/admin/config.yml`, that's not invalid input to reject
or silently normalize to the closest existing option — it's the user
registering a new category by using it. Run this skill with that value as
the new category name, then continue planning that row with it.

## What NOT to do

- Don't touch any post's actual `mainCategory` value in `content/blog/` —
  this only adds a new *option* to the list, it doesn't recategorize
  existing posts.
- Don't invent sub-categories for the new main category. Only the
  top-level option gets added here; sub-categories are decided per-post
  later, during content planning.
- Don't commit the changes unless asked. Leave that decision to the user,
  same as any other content-model change.

## Steps

1. **Decap CMS config** — in `public/admin/config.yml`, find the `select`
   widget named `mainCategory` and add the new category to its `options:`
   list.

2. **`docs/blog-architecture.md`** — find the "Top-level post fields"
   section, where `mainCategory`'s description names the fixed list of
   options. Append the new one there so the doc stays the accurate
   reference for future sessions on this repo.

3. **`docs/blog-content-automation-phase3.md`** — this doc explains that
   Claude decides `Main Category` during content planning and lists the
   same fixed options as a reminder of what it can choose from. Append the
   new one there too.

4. **`src/blog/seo/blogPostingSchema.js`** — its `keywords` field is built
   from `post.mainCategory` and `post.subCategories` directly (no hardcoded
   list), so a new category normally needs no change here at all. Open the
   file and confirm that's still true rather than assuming it — if a later
   change ever hardcoded the option list here too, this is where it would
   need updating.

5. **The live Editorial Google Sheet** — the spreadsheet titled
   "Aurum Astra Connect Blog Content Editorial" has a `Main Category`
   column whose header cell (row 1) carries a note listing the current
   options, for the content-automation pipeline to read. Update it:
   - If the Google Sheets connector's tools aren't already loaded, pull
     them in via `ToolSearch` (e.g. `select:mcp__Google_Sheets__get_spreadsheet,mcp__Google_Sheets__update_spreadsheet`).
   - If the spreadsheet's ID isn't already known from this session, find
     it with Google Drive's `search_files`
     (`title contains 'Aurum Astra Connect Blog Content Editorial'`).
   - Read the existing note on the `Main Category` header cell via
     `get_spreadsheet`, with a field mask that includes
     `sheets.data.rowData.values.note`, scoped to that single cell's range
     so the read stays small.
   - Rewrite the note with the new category appended, via
     `update_spreadsheet`'s `updateCells` request with `fields: "note"`
     only — that touches the note alone, leaving the cell's formatting and
     value untouched.
   - If the Sheets connector genuinely isn't available in this session
     (not just unloaded), don't block on it — finish steps 1–4, then tell
     the user this step still needs doing by hand and why.

6. **Check for drift** — grep the repo for one of the existing category
   strings (e.g. `Skin Rituals & Treatment`) before finishing. If it turns
   up anywhere beyond the places above, that's a spot the list has quietly
   spread to that this skill doesn't yet know about. Update it too, and
   mention it back to the user — future additions should account for that
   new location as well.

7. **If this ran because of an unrecognized value in the Editorial sheet**
   (see "Input" above), continue the planning work that triggered it, now
   using the newly registered category — don't stop and wait once the
   category itself is registered.

8. **Report back**: which files changed, whether the Sheet note update
   succeeded (or why it was skipped), and a reminder that nothing here was
   committed — that decision is left to the user.
