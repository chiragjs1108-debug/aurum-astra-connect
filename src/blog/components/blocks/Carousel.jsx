import { useRef } from 'react'
import { ChevronIcon } from '../../../components/icons.jsx'

function Carousel({ heading, items = [] }) {
  const trackRef = useRef(null)

  function scrollByCard(direction) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('.carousel-item')
    const amount = card ? card.getBoundingClientRect().width + 16 : 280
    track.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="block-carousel">
      {heading && <h3>{heading}</h3>}
      <div className="carousel-wrap">
        <div className="carousel-track" ref={trackRef}>
          {items.map((item) => (
            <article key={item.title} className="carousel-item">
              {item.image && <img src={item.image} alt="" loading="lazy" />}
              <h4>{item.title}</h4>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </div>
        <button type="button" className="carousel-nav carousel-prev" aria-label="Previous" onClick={() => scrollByCard(-1)}>
          <ChevronIcon className="carousel-nav-icon carousel-nav-icon-prev" />
        </button>
        <button type="button" className="carousel-nav carousel-next" aria-label="Next" onClick={() => scrollByCard(1)}>
          <ChevronIcon className="carousel-nav-icon" />
        </button>
      </div>
    </div>
  )
}

export default Carousel
