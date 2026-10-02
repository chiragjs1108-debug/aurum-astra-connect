import { SITE_URL, absoluteUrl } from './siteInfo.js'

export function buildPostSeoTags(post) {
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    canonicalUrl: `${SITE_URL}/blog/${post.slug}`,
    ogImage: absoluteUrl(post.coverImage),
    ogType: 'article',
  }
}

export const BLOG_LIST_SEO = {
  title: 'The Journal | Aurum Astra',
  description: 'Hair, skin, and spa rituals from Aurum Astra Unisex Salon & Luxury Spa in Hennur, Bengaluru.',
  canonicalUrl: `${SITE_URL}/blog`,
  ogImage: absoluteUrl('/img/hero-bg.webp'),
}
