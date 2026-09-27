# content/blog/

This folder is CMS-managed. Decap CMS (`/admin`) writes post files here directly — treat files in this folder as data, not code to refactor.

- Never hand-edit a post file's structure beyond fixing a typo or swapping sample content. If you need to change what fields a post *can* have, that's a schema change — it belongs in `public/admin/config.yml`, and every existing block type it touches lives in `src/blog/components/blocks/`.
- Each file is YAML frontmatter only (no markdown body). The whole post — title, SEO fields, and the `blocks` array — lives in that frontmatter. `src/blog/data/posts.js` loads every file in this folder automatically; adding a new `.md` file here is enough, nothing else needs to change.
- A post's URL slug is its filename (minus `.md`), not a field inside the file.
- Block `type` values (`paragraph`, `service-cards`, `toc`, etc.) must exactly match a key in `src/blog/components/BlockRenderer.jsx`'s `BLOCK_COMPONENTS` map and a `name` in `config.yml`'s block `types:` list. Renaming or adding a block type means updating both of those plus the block's own component in `src/blog/components/blocks/`.
- A block's optional `id` field is an anchor target for a `toc` block elsewhere in the same post — it must match a `toc` item's `anchorId` exactly.
