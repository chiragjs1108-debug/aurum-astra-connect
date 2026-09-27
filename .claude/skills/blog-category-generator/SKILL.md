---
name: blog-category-generator
description: Adds a new Main Category option to the Aurum Astra blog's controlled taxonomy and updates every place that lists the fixed options — the Decap CMS config, both architecture docs, and the live content-automation Google Sheet — so a new category is never added by hand in one spot and forgotten in the others. Use whenever the user asks to add, create, register, or introduce a new blog category, main category, taxonomy option, or service line for the blog (e.g. "add a Bridal Packages category", "we're launching a new service, need a category for it", "register 'Grooming' as a main category").
---

# Blog Category Generator

The blog's `mainCategory` field is a **controlled vocabulary** — a fixed
list, not free text — because it drives the category pill shown across the
blog and is what a future category-filtered widget would key off (see
`docs/blog-architecture.md`'s post-fields section for the full rationale).
That list is currently repeated, by hand, in four separate places. Adding a
category means updating all four together, or the list quietly drifts —
Decap ends up offering something the content-automation pipeline doesn't
know about, or the reverse. This skill does the update mechanically, every
time, so it never drifts.

## Input

The new category name, as plain text (e.g. `Bridal Packages`). If it wasn't
given, ask for it before doing anything else.

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

4. **The live Editorial Google Sheet** — the spreadsheet titled
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
     (not just unloaded), don't block on it — finish steps 1–3, then tell
     the user this step still needs doing by hand and why.

5. **Check for drift** — grep the repo for one of the existing category
   strings (e.g. `Skin Rituals & Treatment`) before finishing. If it turns
   up anywhere beyond the four places above, that's a fifth place the list
   has quietly spread to. Update it too, and mention it back to the user —
   it means the list has drifted from this skill's own picture of where it
   lives, and future additions should account for that new location as
   well.

6. **Report back**: which files changed, whether the Sheet note update
   succeeded (or why it was skipped), and a reminder that nothing here was
   committed — that decision is left to the user.
