/*
 * Loads every post from `content/blog/*.md` — the folder Decap CMS writes
 * to. Each file is YAML frontmatter only (no markdown body): the entire
 * post, including its `blocks` array, lives in the frontmatter. Adding a
 * new file here (by hand, or via the CMS) is enough; nothing else in the
 * blog module needs to change.
 */
import * as yaml from 'js-yaml'

// The `!` exclusion matters: this folder also holds CLAUDE.md (scoped
// instructions for future Claude Code sessions), which is not a post.
const files = import.meta.glob(['/content/blog/*.md', '!/content/blog/CLAUDE.md'], {
  eager: true,
  query: '?raw',
  import: 'default',
})

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return {}
  return yaml.load(match[1]) || {}
}

function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

const posts = Object.entries(files)
  .map(([path, raw]) => ({ slug: slugFromPath(path), ...parseFrontmatter(raw) }))
  .sort((a, b) => new Date(b.date) - new Date(a.date))

export default posts
