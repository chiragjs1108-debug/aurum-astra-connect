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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadPostsFromDisk } from './lib/loadPostsFromDisk.mjs'
import { injectHead, writeStaticPage } from './lib/headInjection.mjs'
import { buildPostSeoTags, BLOG_LIST_SEO } from '../src/blog/seo/seoTags.js'
import { buildBlogPostingSchema } from '../src/blog/seo/blogPostingSchema.js'

const DIST_DIR = 'dist'

const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8')
const posts = loadPostsFromDisk()

writeStaticPage(DIST_DIR, 'blog', injectHead(template, BLOG_LIST_SEO))

for (const post of posts) {
  const tags = buildPostSeoTags(post)
  const jsonLd = buildBlogPostingSchema(post)
  writeStaticPage(DIST_DIR, `blog/${post.slug}`, injectHead(template, { ...tags, jsonLd }))
}

console.log(`Generated static SEO shells for /blog + ${posts.length} post${posts.length === 1 ? '' : 's'}.`)
