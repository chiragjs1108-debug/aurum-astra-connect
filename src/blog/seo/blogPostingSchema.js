import { SITE_URL, SITE_NAME, SITE_LOGO, absoluteUrl } from './siteInfo.js'

export function buildBlogPostingSchema(post) {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: absoluteUrl(post.coverImage),
    datePublished: post.date,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: SITE_LOGO },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  }
}
