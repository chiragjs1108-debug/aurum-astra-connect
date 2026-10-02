import { useEffect } from 'react'

/*
 * Keeps <head> correct as the user navigates client-side between blog pages
 * (e.g. post to post, with no full page reload — a static HTML file alone
 * wouldn't update these). The build-time script (scripts/generate-static-
 * blog-pages.mjs) covers the case a static file DOES matter: a crawler or
 * link-preview bot's very first, JS-free request to the URL.
 */

function upsertMeta(attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data) {
  const id = 'blog-jsonld'
  let el = document.getElementById(id)
  if (!data) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

// The sitewide default from index.html — restored when leaving a page that
// sets its own title, so the tab title doesn't stay stuck on the old one.
const DEFAULT_TITLE = 'Best Salon & Spa Near Me in Hennur, Bengaluru | Aurum Astra'

export function useSeo(tags) {
  useEffect(() => {
    if (!tags) return undefined

    const { title, description, canonicalUrl, ogImage, ogType = 'website', jsonLd } = tags

    if (title) document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:image', ogImage)
    upsertMeta('property', 'og:url', canonicalUrl)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertLink('canonical', canonicalUrl)
    upsertJsonLd(jsonLd)

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [tags])
}
