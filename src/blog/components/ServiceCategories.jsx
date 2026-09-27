import { Link } from 'react-router-dom'
import { ScissorsIcon, DropletIcon, WaveIcon, GemIcon } from '../../components/icons.jsx'

/* Links point at the real hub pages (/catalogue, /spa) rather than guessed
   deep-link query params, so they can never go stale if categories change. */
const CATEGORIES = [
  { title: 'Hair Atelier', copy: 'Cuts, colour & finishing rituals.', to: '/catalogue', icon: ScissorsIcon },
  { title: 'Skin & Face Rituals', copy: 'Facials calibrated to your skin.', to: '/catalogue', icon: DropletIcon },
  { title: 'Body & Spa Therapies', copy: 'Massage & body rituals that restore.', to: '/spa', icon: WaveIcon },
  { title: 'Nails & Hands', copy: 'Manicures & nail artistry.', to: '/catalogue', icon: GemIcon },
]

function ServiceCategories() {
  return (
    <section className="service-categories">
      <h2>Explore Our Services</h2>
      <div className="service-categories-grid">
        {CATEGORIES.map(({ title, copy, to, icon: Icon }) => (
          <Link key={title} to={to} className="service-category-card">
            <span className="service-category-icon">
              <Icon />
            </span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ServiceCategories
