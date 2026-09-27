function buildWhatsAppLink(number, message) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

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

function ServiceCard({ item, whatsappNumber }) {
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
      <a
        href={buildWhatsAppLink(whatsappNumber, item.whatsappMessage)}
        target="_blank"
        rel="noopener noreferrer"
        className="sc-card-cta"
      >
        Book this &rarr;
      </a>
    </article>
  )
}

function ServiceCards({ heading, intro, whatsappNumber, items = [] }) {
  return (
    <div className="block-service-cards">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="sc-intro">{intro}</p>}
      <div className="sc-grid">
        {items.map((item) => (
          <ServiceCard key={item.name} item={item} whatsappNumber={whatsappNumber} />
        ))}
      </div>
    </div>
  )
}

export default ServiceCards
