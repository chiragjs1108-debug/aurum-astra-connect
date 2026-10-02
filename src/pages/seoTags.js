import { SITE_URL, absoluteUrl } from '../blog/seo/siteInfo.js'
import { buildPageSchema } from './siteSchema.js'

/*
 * Per-route <head> tags for the four main app pages. Mirrors the pattern
 * already used for the blog (src/blog/seo/seoTags.js) — read via useSeo()
 * for client-side navigation, and baked into static HTML at build time by
 * scripts/generate-static-site-pages.mjs for the first, JS-free request a
 * crawler or link-preview bot makes.
 *
 * Titles follow a "Best <service> Near Me ... in Hennur" pattern — this
 * mirrors how people actually search locally ("spa near me", "salon near
 * me in Hennur") rather than just naming the service. Catalogue/Salon/Spa
 * each lean on a different angle (menu/prices vs. relaxation) so they
 * don't cannibalize each other, or spa-in-hennur.html's own booking-intent
 * targeting of the same location.
 */

const OG_IMAGE = absoluteUrl('/img/og.jpg')

const HOME_URL = `${SITE_URL}/`
const CATALOGUE_URL = `${SITE_URL}/catalogue`
const SALON_URL = `${SITE_URL}/salon`
const SPA_URL = `${SITE_URL}/spa`

export const HOME_SEO = {
  title: 'Best Salon & Spa Near Me in Hennur, Bengaluru | Aurum Astra',
  description:
    'Looking for the best salon & spa near me in Hennur? Aurum Astra offers premium hair, skin, bridal styling and spa therapies by expert stylists. Book now.',
  canonicalUrl: HOME_URL,
  ogImage: OG_IMAGE,
}

export const CATALOGUE_SEO = {
  title: 'Best Salon & Spa Services Near Me in Hennur | Aurum Astra',
  description:
    'The best salon & spa services near me in Hennur — haircuts, colour, hair spa, facials, waxing, nails, bridal makeup and massage therapies, with prices.',
  canonicalUrl: CATALOGUE_URL,
  ogImage: OG_IMAGE,
  jsonLd: buildPageSchema([
    { name: 'Home', url: HOME_URL },
    { name: 'Explore The Menu', url: CATALOGUE_URL },
  ]),
}

export const SALON_SEO = {
  title: 'Best Unisex Salon Near Me in Hennur, Bengaluru | Aurum Astra',
  description:
    'The best unisex salon near me in Hennur — haircuts, hair colour, keratin treatments, hair spa, facials, waxing, nails and bridal makeup, with prices.',
  canonicalUrl: SALON_URL,
  ogImage: OG_IMAGE,
  jsonLd: buildPageSchema([
    { name: 'Home', url: HOME_URL },
    { name: 'Explore The Menu', url: CATALOGUE_URL },
    { name: 'Salon Menu', url: SALON_URL },
  ]),
}

export const SPA_SEO = {
  title: 'Best Spa Near Me for Relaxation in Hennur | Aurum Astra',
  description:
    "The best spa near me for relaxation in Hennur — Swedish, deep tissue, Thai, Balinese and Ayurvedic massage, couple's therapy, wraps and jacuzzi, with prices.",
  canonicalUrl: SPA_URL,
  ogImage: OG_IMAGE,
  jsonLd: buildPageSchema([
    { name: 'Home', url: HOME_URL },
    { name: 'Explore The Menu', url: CATALOGUE_URL },
    { name: 'Spa Rituals', url: SPA_URL },
  ]),
}
