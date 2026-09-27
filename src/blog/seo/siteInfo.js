/*
 * Shared site-wide constants for SEO/schema. Plain data + one pure helper —
 * no browser or Vite-specific APIs — so this same file is imported both by
 * the React app (via Vite) and by the plain-Node build scripts in scripts/.
 */

export const SITE_URL = 'https://connect.aurumastra.in'
export const SITE_NAME = 'Aurum Astra Unisex Salon & Luxury Spa'
export const SITE_LOGO = `${SITE_URL}/img/logo.png`

export function absoluteUrl(path) {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}
