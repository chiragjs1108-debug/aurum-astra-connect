/*
 * Shared by every postbuild script that bakes route-specific <head> tags
 * into a copy of dist/index.html (see generate-static-blog-pages.mjs and
 * generate-static-site-pages.mjs). Strips any og:*, twitter:card,
 * canonical link, and ld+json block already in the template before
 * appending the new ones — without this, running more than one of these
 * scripts against the same already-written file would pile up duplicate
 * canonical/og tags instead of replacing them.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
  return String(value || '').replace(/[&<>"']/g, (char) => map[char])
}

export function injectHead(template, { title, description, canonicalUrl, ogImage, ogType = 'website', jsonLd }) {
  let html = template.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`)

  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  )

  // Drop any previously-injected tags so re-running against an
  // already-written file replaces them instead of stacking duplicates.
  html = html
    .replace(/\s*<meta property="og:[^"]*" content="[^"]*"\s*\/>/g, '')
    .replace(/\s*<meta name="twitter:card" content="[^"]*"\s*\/>/g, '')
    .replace(/\s*<link rel="canonical" href="[^"]*"\s*\/?>/g, '')
    .replace(/\s*<script type="application\/ld\+json">.*?<\/script>/gs, '')

  const extraTags = [
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    description && `<meta property="og:description" content="${escapeHtml(description)}" />`,
    ogImage && `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:type" content="${escapeHtml(ogType)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    jsonLd && `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join('\n    ')

  return html.replace('</head>', `    ${extraTags}\n  </head>`)
}

export function writeStaticPage(distDir, routePath, html) {
  const outDir = join(distDir, routePath)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html, 'utf8')
}
