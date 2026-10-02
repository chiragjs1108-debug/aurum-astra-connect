/*
 * Runs after `vite build`, right after generate-static-blog-pages.mjs (see
 * the "postbuild" npm script — order matters: this reads dist/index.html
 * as its template, which generate-static-blog-pages.mjs never writes to,
 * so it must run after that script, not before, or it would bake this
 * script's injected tags into every blog page's "pristine" template).
 *
 * Same idea as the blog's static-SEO-shell script: Home, Catalogue, Salon,
 * and Spa are still client-rendered, but each one gets its own real
 * title/description/canonical/OG tags baked into static HTML, for search
 * engines and link-preview bots that don't run this app's JS. Before this,
 * all four routes silently shared index.html's one generic, location-free
 * title and description.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { injectHead, writeStaticPage } from './lib/headInjection.mjs'
import { HOME_SEO, CATALOGUE_SEO, SALON_SEO, SPA_SEO } from '../src/pages/seoTags.js'
import { SITE_LOCAL_BUSINESS_SCHEMA } from '../src/pages/siteSchema.js'

const DIST_DIR = 'dist'

const template = readFileSync(join(DIST_DIR, 'index.html'), 'utf8')

const routes = [
  ['', { ...HOME_SEO, jsonLd: SITE_LOCAL_BUSINESS_SCHEMA }],
  ['catalogue', CATALOGUE_SEO],
  ['salon', SALON_SEO],
  ['spa', SPA_SEO],
]

for (const [routePath, tags] of routes) {
  writeStaticPage(DIST_DIR, routePath, injectHead(template, tags))
}

console.log(`Generated static SEO shells for / (home), /catalogue, /salon, /spa.`)
