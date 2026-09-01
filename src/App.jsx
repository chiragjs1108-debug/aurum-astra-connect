import { useMemo, useState } from 'react'
import './App.css'

const CATEGORIES = ['Salon', 'Spa']

const SERVICES = [
  {
    category: 'Salon',
    name: 'Signature Haircut & Style',
    description: 'Placeholder description of the treatment goes here.',
    duration: '45 min',
    price: '$—',
  },
  {
    category: 'Salon',
    name: 'Colour & Gloss',
    description: 'Placeholder description of the treatment goes here.',
    duration: '90 min',
    price: '$—',
  },
  {
    category: 'Salon',
    name: 'Blowout & Finish',
    description: 'Placeholder description of the treatment goes here.',
    duration: '30 min',
    price: '$—',
  },
  {
    category: 'Salon',
    name: 'Classic Manicure',
    description: 'Placeholder description of the treatment goes here.',
    duration: '40 min',
    price: '$—',
  },
  {
    category: 'Spa',
    name: 'Aurum Signature Massage',
    description: 'Placeholder description of the treatment goes here.',
    duration: '60 min',
    price: '$—',
  },
  {
    category: 'Spa',
    name: 'Radiance Facial',
    description: 'Placeholder description of the treatment goes here.',
    duration: '50 min',
    price: '$—',
  },
  {
    category: 'Spa',
    name: 'Hot Stone Therapy',
    description: 'Placeholder description of the treatment goes here.',
    duration: '75 min',
    price: '$—',
  },
  {
    category: 'Spa',
    name: 'Aromatherapy Ritual',
    description: 'Placeholder description of the treatment goes here.',
    duration: '60 min',
    price: '$—',
  },
]

function App() {
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleServices = useMemo(() => {
    if (activeCategory === 'All') return SERVICES
    return SERVICES.filter((service) => service.category === activeCategory)
  }, [activeCategory])

  return (
    <>
      <header className="site-header">
        <p className="eyebrow">Aurum Astra</p>
        <h1>Salon &amp; Spa Menu</h1>
        <p className="subhead">
          A placeholder catalogue of our treatments — final copy, pricing and imagery to follow.
        </p>
      </header>

      <nav className="filters">
        {['All', ...CATEGORIES].map((category) => (
          <button
            key={category}
            type="button"
            className={category === activeCategory ? 'filter active' : 'filter'}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </nav>

      <main className="catalogue">
        {visibleServices.map((service) => (
          <article className="service-card" key={service.name}>
            <span className="service-category">{service.category}</span>
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-meta">
              <span>{service.duration}</span>
              <span>{service.price}</span>
            </div>
          </article>
        ))}
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Aurum Astra. All rights reserved.</p>
      </footer>
    </>
  )
}

export default App
