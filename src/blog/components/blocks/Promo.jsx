import { PHONE_HREF, buildWhatsAppLink } from '../../data/contact.js'

function resolveHref(action) {
  if (!action) return undefined
  if (action.kind === 'whatsapp') return buildWhatsAppLink(action.message || 'Hi Aurum Astra, I have a question.')
  if (action.kind === 'call') return PHONE_HREF
  return action.href
}

function Promo({ badge, title, copy, action }) {
  const href = resolveHref(action)
  return (
    <div className="block-promo">
      {badge && <span className="promo-badge">{badge}</span>}
      <h3>{title}</h3>
      {copy && <p>{copy}</p>}
      {action && href && (
        <a
          href={href}
          className="promo-cta"
          {...(action.kind !== 'call' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {action.label}
        </a>
      )}
    </div>
  )
}

export default Promo
