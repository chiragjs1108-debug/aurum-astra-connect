/*
 * Runs after `vite build` (via the "postbuild" npm script). The blog is
 * still client-rendered like the rest of this SPA — this script does NOT
 * prerender post bodies. What it does do: give every blog URL its own real
 * <head> (title, meta description, OG tags, canonical link, BlogPosting
 * JSON-LD) baked into static HTML, for the two audiences that matter most
 * and never run our JS: search engine snippet generation and social-media
 * link-preview bots (WhatsApp, Facebook, Twitter/X, etc).
 *
 * Approach: take the already-built dist/index.html (same JS/CSS bundle
 * every route uses) and write a copy per blog route with just the <head>
 * tags swapped, at dist/blog/index.html and dist/blog/<slug>/index.html.
 * The site's .htaccess serves a directory's index.html automatically, so
 * these need no server config changes.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { loadPostsFromDisk } from './lib/loadPostsFromDisk.mjs'
import { buildPostSeoTags, BLOG_LIST_SEO } from '../src/blog/seo/seoTags.js'
import { buildBlogPostingSchema } from '../src/blog/seo/blogPostingSchema.js'

const DIST_DIR = 'dist'

function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(value || '').replace(/[&<>"']/g, (char) => map[char])
}

function injectHead(template, { title, description, canonicalUrl, ogImage, jsonLd }) {
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  )

  const extraTags = [
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    description && `<meta property="og:description" content="${escapeHtml(description)}" />`,
    ogImage && `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    jsonLd && `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return html.replace('</head>', `    ${extraTags}\n  </head>`)
}

function writeStaticPage(routePath, html) {
  const outDir = join(DIST_DIR, routePath)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
}

const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8')
const posts = loadPostsFromDisk()

writeStaticPage('blog', injectHead(template, BLOG_LIST_SEO))

for (const post of posts) {
  const tags = buildPostSeoTags(post)
  const jsonLd = buildBlogPostingSchema(post)
  writeStaticPage(`blog/${post.slug}`, injectHead(template, { ...tags, jsonLd }))
}

console.log(`Generated static SEO shells for /blog + ${posts.length} post${posts.length === 1 ? '' : 's'}.`)
