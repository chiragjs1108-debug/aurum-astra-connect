import { PhoneIcon, ChatIcon } from '../../../components/icons.jsx'
import { PHONE_HREF, buildWhatsAppLink } from '../../data/contact.js'

const ACTION_ICON = {
  whatsapp: ChatIcon,
  call: PhoneIcon,
}

function resolveHref(action) {
  if (action.kind === 'whatsapp') {
    return buildWhatsAppLink(action.message || 'Hi Aurum Astra, I have a question.')
  }
  if (action.kind === 'call') {
    return PHONE_HREF
  }
  return action.href
}

function CallToAction({ heading, text, actions = [] }) {
  return (
    <div className="block-cta">
      {heading && <p className="block-cta-heading">{heading}</p>}
      {text && <p className="block-cta-text">{text}</p>}
      <div className="block-cta-actions">
        {actions.map((action, index) => {
          const Icon = ACTION_ICON[action.kind]
          return (
            <a
              key={action.label}
              href={resolveHref(action)}
              className={`block-cta-button${index === 0 ? '' : ' block-cta-button-outline'}`}
              {...(action.kind !== 'call' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {Icon && <Icon />}
              {action.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default CallToAction
