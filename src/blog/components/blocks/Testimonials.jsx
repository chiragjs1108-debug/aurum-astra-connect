import { useRef } from 'react'
import { ChevronIcon } from '../../../components/icons.jsx'

function Stars({ count = 5 }) {
  return (
    <div className="testimonial-stars" aria-hidden="true">
      {'★'.repeat(count)}
    </div>
  )
}

function Testimonials({ heading, intro, items = [] }) {
  const trackRef = useRef(null)

  function scrollByCard(direction) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.testimonial-card')
    const amount = card ? card.getBoundingClientRect().width + 12 : 260
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="block-testimonials">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="testimonials-intro">{intro}</p>}
      <div className="testimonials-wrap">
        <div className="testimonials-track" ref={trackRef}>
          {items.map((item) => (
            <figure key={item.author} className="testimonial-card">
              <Stars count={item.stars || 5} />
              <blockquote>&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption>
                {item.author}
                {item.source ? `, ${item.source}` : ''}
              </figcaption>
            </figure>
          ))}
        </div>
        <button type="button" className="testimonials-nav testimonials-nav-prev" aria-label="Previous" onClick={() => scrollByCard(-1)}>
          <ChevronIcon className="testimonials-nav-icon testimonials-nav-icon-prev" />
        </button>
        <button type="button" className="testimonials-nav testimonials-nav-next" aria-label="Next" onClick={() => scrollByCard(1)}>
          <ChevronIcon className="testimonials-nav-icon" />
        </button>
      </div>
    </div>
  )
}

export default Testimonials
