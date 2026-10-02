import { SITE_URL, absoluteUrl } from '../blog/seo/siteInfo.js'

/*
 * Per-route <head> tags for the four main app pages. Mirrors the pattern
 * already used for the blog (src/blog/seo/seoTags.js) — read via useSeo()
 * for client-side navigation, and baked into static HTML at build time by
 * scripts/generate-static-site-pages.mjs for the first, JS-free request a
 * crawler or link-preview bot makes.
 *
 * Every title/description below deliberately carries "Hennur" or
 * "Bengaluru" — before this, all four pages inherited the same generic,
 * location-free title and description from index.html, which is why none
 * of them were distinguishable to Google for a local "<service> Hennur"
 * search.
 */

const OG_IMAGE = absoluteUrl('/img/og.jpg')

export const HOME_SEO = {
  title: 'Aurum Astra | Unisex Salon & Luxury Spa in Hennur, Bengaluru',
  description:
    'Premium unisex salon & luxury spa in Hennur, Bengaluru. Hair, skin, bridal styling and spa therapies by expert stylists and trained therapists. Book now.',
  canonicalUrl: `${SITE_URL}/`,
  ogImage: OG_IMAGE,
}

export const CATALOGUE_SEO = {
  title: 'Salon & Spa Price Menu in Hennur, Bengaluru | Aurum Astra',
  description:
    'Browse the full Aurum Astra menu — haircuts, colour, hair spa, facials, waxing, nails, bridal makeup and massage therapies, with prices, in Hennur, Bengaluru.',
  canonicalUrl: `${SITE_URL}/catalogue`,
  ogImage: OG_IMAGE,
}

export const SALON_SEO = {
  title: 'Unisex Salon Menu & Prices in Hennur, Bengaluru | Aurum Astra',
  description:
    "Haircuts, hair colour, keratin treatments, hair spa, facials, waxing, nail care and bridal makeup — every salon service and price at Aurum Astra, Hennur.",
  canonicalUrl: `${SITE_URL}/salon`,
  ogImage: OG_IMAGE,
}

export const SPA_SEO = {
  title: 'Spa & Massage Menu with Prices in Hennur | Aurum Astra',
  description:
    "Swedish, deep tissue, Thai, Balinese, Ayurvedic and couple's massage, wraps and jacuzzi — the full spa ritual menu and prices at Aurum Astra, Hennur.",
  canonicalUrl: `${SITE_URL}/spa`,
  ogImage: OG_IMAGE,
}
