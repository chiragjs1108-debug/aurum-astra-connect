import { SITE_URL } from '../blog/seo/siteInfo.js'

/*
 * Structured data for the main app pages. Reuses the same @id values as
 * public/spa-in-hennur.html's own JSON-LD ("https://aurumastra.in/#org",
 * "#spa") so Google reads every page as describing the same business
 * rather than competing listings — spa-in-hennur.html's own copy stays
 * as its dedicated landing-page entry, unchanged.
 *
 * ORG_NODE/WEBSITE_NODE/SPA_NODE are exported individually (not just as
 * one combined object) so each page can compose its own @graph: the
 * homepage gets the full Organization + WebSite + Spa declaration,
 * while Catalogue/Salon/Spa each add their own BreadcrumbList on top of
 * just the Spa entity — deliberately lighter, since one full Organization
 * declaration per site is what matters, not one copy per page.
 */
export const ORG_NODE = {
  '@type': 'Organization',
  '@id': 'https://aurumastra.in/#org',
  name: 'Aurum Astra',
  legalName: 'Aurum Astra Pvt Ltd',
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/img/logo.png`,
  },
  slogan: 'The Dawn of Stellar Luxury',
  sameAs: [
    'https://instagram.com/aurumastra',
    'https://share.google/CDx5BmvKrQvMxn8Zn',
    'https://maps.app.goo.gl/1UoDa68v2FxfZRhf6',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-93536-39507',
    contactType: 'reservations',
    areaServed: 'IN',
    availableLanguage: ['English', 'Kannada', 'Hindi'],
  },
}

export const WEBSITE_NODE = {
  '@type': 'WebSite',
  '@id': 'https://aurumastra.in/#website',
  url: `${SITE_URL}/`,
  name: 'Aurum Astra',
  publisher: { '@id': 'https://aurumastra.in/#org' },
  inLanguage: 'en-IN',
}

export const SPA_NODE = {
  '@type': ['DaySpa', 'HealthAndBeautyBusiness'],
  '@id': 'https://aurumastra.in/#spa',
  name: 'Aurum Astra Unisex Salon & Luxury Spa',
  alternateName: ['Aurum Astra Luxury Spa', 'Aurum Astra Spa Hennur', 'Best Spa Near Me Hennur'],
  description:
    'Premium unisex salon and luxury spa in Hennur, Bengaluru — haircuts, colour, hair spa, facials, waxing, nails and bridal makeup, plus Swedish, deep tissue, Thai, Balinese and Ayurvedic massage.',
  url: `${SITE_URL}/`,
  image: [`${SITE_URL}/img/hero-bg.jpg`, `${SITE_URL}/img/spa-therapy-room-hennur.webp?v=2`],
  logo: `${SITE_URL}/img/logo.png`,
  telephone: '+91-93536-39507',
  priceRange: '₹1,800 – ₹15,000',
  currenciesAccepted: 'INR',
  paymentAccepted: 'UPI, Credit Card, Debit Card, Cash',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3rd Floor, AM Plaza, Hennur–Bagalur Main Road, Hennur Bande',
    addressLocality: 'Bengaluru',
    addressRegion: 'Karnataka',
    postalCode: '560043',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.037219,
    longitude: 77.641077,
  },
  hasMap: 'https://share.google/CDx5BmvKrQvMxn8Zn',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '10:00',
      closes: '22:00',
    },
  ],
  areaServed: 'Hennur and North-East Bengaluru',
  knowsLanguage: ['en', 'kn', 'hi'],
}

export const SITE_LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [ORG_NODE, WEBSITE_NODE, SPA_NODE],
}

/*
 * A page's real position in the site, as a BreadcrumbList — this is what
 * actually earns the breadcrumb trail Google sometimes shows under a
 * search result instead of the raw URL. `items` is ordered root-first,
 * e.g. [{name:'Home', url:SITE_URL+'/'}, {name:'Explore The Menu',
 * url:SITE_URL+'/catalogue'}].
 */
export function buildBreadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Breadcrumb + the Spa business entity (so the page still carries a real
// business reference, not just navigation markup) — used by Catalogue,
// Salon and Spa, which don't need the full Organization/WebSite pair the
// homepage already declares once.
export function buildPageSchema(breadcrumbItems) {
  return {
    '@context': 'https://schema.org',
    '@graph': [buildBreadcrumbSchema(breadcrumbItems), SPA_NODE],
  }
}
