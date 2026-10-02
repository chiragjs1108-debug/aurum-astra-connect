/*
 * Organization + LocalBusiness structured data for the homepage. Reuses
 * the same @id values as public/spa-in-hennur.html's own JSON-LD
 * ("https://aurumastra.in/#org", "#spa") so Google reads both pages as
 * describing the same business rather than two competing listings — this
 * is the fuller, canonical declaration (url points at the main site);
 * spa-in-hennur.html's copy stays as its own dedicated landing-page entry.
 *
 * Deliberately lighter than spa-in-hennur.html's version (no full
 * AdministrativeArea/amenityFeature graph) — one strong entity
 * declaration on the homepage is what matters for ranking; the detailed
 * version already lives on the landing page built for exactly that.
 */
export const SITE_LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://aurumastra.in/#org',
      name: 'Aurum Astra',
      legalName: 'Aurum Astra Pvt Ltd',
      url: 'https://connect.aurumastra.in/',
      logo: {
        '@type': 'ImageObject',
        url: 'https://connect.aurumastra.in/img/logo.png',
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
    },
    {
      '@type': 'WebSite',
      '@id': 'https://aurumastra.in/#website',
      url: 'https://connect.aurumastra.in/',
      name: 'Aurum Astra',
      publisher: { '@id': 'https://aurumastra.in/#org' },
      inLanguage: 'en-IN',
    },
    {
      '@type': ['DaySpa', 'HealthAndBeautyBusiness'],
      '@id': 'https://aurumastra.in/#spa',
      name: 'Aurum Astra Unisex Salon & Luxury Spa',
      alternateName: ['Aurum Astra Luxury Spa', 'Aurum Astra Spa Hennur'],
      description:
        'Premium unisex salon and luxury spa in Hennur, Bengaluru — haircuts, colour, hair spa, facials, waxing, nails and bridal makeup, plus Swedish, deep tissue, Thai, Balinese and Ayurvedic massage.',
      url: 'https://connect.aurumastra.in/',
      image: [
        'https://connect.aurumastra.in/img/hero-bg.jpg',
        'https://connect.aurumastra.in/img/spa-therapy-room-hennur.webp?v=2',
      ],
      logo: 'https://connect.aurumastra.in/img/logo.png',
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
    },
  ],
}
