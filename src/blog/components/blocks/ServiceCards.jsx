import { useRef } from 'react'
import { ChevronIcon } from '../../../components/icons.jsx'
import { buildWhatsAppLink } from '../../data/contact.js'

function PressureGauge({ label, level }) {
  return (
    <div className="sc-pressure">
      <span className="sc-pressure-label">Pressure</span>
      <span className="sc-pressure-bars">
        {[1, 2, 3, 4, 5].map((bar) => (
          <i key={bar} className={bar <= level ? 'on' : ''} />
        ))}
      </span>
      <span className="sc-pressure-value">{label}</span>
    </div>
  )
}

function ServiceCard({ item }) {
  return (
    <article className="sc-card">
      <div className="sc-card-photo">
        <img src={item.image} alt={item.name} loading="lazy" />
      </div>
      <h3>{item.name}</h3>
      <p className="sc-card-tag">{item.tag}</p>
      <p className="sc-card-desc">{item.description}</p>
      <p className="sc-card-meta">
        {item.duration}
        {item.medium ? ` · ${item.medium}` : ''}
      </p>
      {item.pressureLevel ? (
        <PressureGauge label={item.pressureLabel} level={item.pressureLevel} />
      ) : (
        <div className="sc-pressure sc-pressure-feel">
          <span className="sc-pressure-label">Feel</span>
          <span className="sc-pressure-value">{item.feel}</span>
        </div>
      )}
      <a href={buildWhatsAppLink(item.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="sc-card-cta">
        Book this &rarr;
      </a>
    </article>
  )
}

function ServiceCards({ heading, intro, items = [] }) {
  const trackRef = useRef(null)

  function scrollByCard(direction) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.sc-card')
    const amount = card ? card.getBoundingClientRect().width + 12 : 260
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="block-service-cards">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="sc-intro">{intro}</p>}
      <div className="sc-wrap">
        <div className="sc-track" ref={trackRef}>
          {items.map((item) => (
            <ServiceCard key={item.name} item={item} />
          ))}
        </div>
        <button type="button" className="sc-nav sc-nav-prev" aria-label="Previous" onClick={() => scrollByCard(-1)}>
          <ChevronIcon className="sc-nav-icon sc-nav-icon-prev" />
        </button>
        <button type="button" className="sc-nav sc-nav-next" aria-label="Next" onClick={() => scrollByCard(1)}>
          <ChevronIcon className="sc-nav-icon" />
        </button>
      </div>
    </div>
  )
}

export default ServiceCards
