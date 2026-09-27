/*
 * Regenerates public/sitemap.xml on every build, so it can never go stale
 * as posts are added — the failure mode this replaces (a hand-maintained
 * sitemap someone forgets to update). Runs via the "prebuild" npm script.
 */
import { writeFileSync } from 'node:fs'
import { loadPostsFromDisk } from './lib/loadPostsFromDisk.mjs'

const SITE_URL = 'https://connect.aurumastra.in'

// Mirrors the site's existing static pages. These aren't derived from
// anything on disk, so if one of these pages' own content changes
// meaningfully, update its lastmod here too.
const STATIC_ROUTES = [
  { path: '/', lastmod: '2026-09-25', changefreq: 'weekly', priority: '1.0' },
  { path: '/catalogue', lastmod: '2026-09-25', changefreq: 'weekly', priority: '0.9' },
  { path: '/salon', lastmod: '2026-09-25', changefreq: 'weekly', priority: '0.8' },
  { path: '/spa', lastmod: '2026-09-25', changefreq: 'weekly', priority: '0.8' },
  { path: '/spa-in-hennur', lastmod: '2026-09-25', changefreq: 'monthly', priority: '0.9' },
  { path: '/terms-and-conditions', lastmod: '2026-09-25', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy-policy', lastmod: '2026-09-25', changefreq: 'yearly', priority: '0.3' },
  { path: '/refund-policy', lastmod: '2026-09-25', changefreq: 'yearly', priority: '0.3' },
]

const posts = loadPostsFromDisk()
const today = new Date().toISOString().slice(0, 10)

const blogRoutes = [
  { path: '/blog', lastmod: posts[0]?.date || today, changefreq: 'weekly', priority: '0.8' },
  ...posts.map((post) => ({
    path: `/blog/${post.slug}`,
    lastmod: post.date,
    changefreq: 'monthly',
    priority: '0.7',
  })),
]

const allRoutes = [...STATIC_ROUTES, ...blogRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync('public/sitemap.xml', xml, 'utf8')
console.log(`Generated sitemap.xml — ${allRoutes.length} URLs (${posts.length} blog post${posts.length === 1 ? '' : 's'}).`)
