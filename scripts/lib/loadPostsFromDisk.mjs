/*
 * Node-side mirror of src/blog/data/posts.js's loading logic — same
 * frontmatter format, same slug-from-filename rule, same CLAUDE.md
 * exclusion — but reading from disk with fs instead of Vite's
 * import.meta.glob, since these build scripts run in plain Node, not
 * through Vite.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import * as yaml from 'js-yaml'

const CONTENT_DIR = 'content/blog'

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return {}
  return yaml.load(match[1]) || {}
}

export function loadPostsFromDisk() {
  return readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith('.md') && name !== 'CLAUDE.md')
    .map((name) => {
      const raw = readFileSync(join(CONTENT_DIR, name), 'utf8')
      const slug = name.replace(/\.md$/, '')
      return { slug, ...parseFrontmatter(raw) }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}
