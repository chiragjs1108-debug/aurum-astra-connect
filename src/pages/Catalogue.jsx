import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconWrap,
  ScissorsIcon,
  DropletIcon,
  WaveIcon,
  GemIcon,
  FlowerIcon,
  BrushIcon,
  LipstickIcon,
  RazorIcon,
} from '../components/icons.jsx'
import './Catalogue.css'

/* ---------------------------------- spa icons (local — mirrors SpaRituals.jsx categories) ---------------------------------- */

const HandIcon = () => (
  <IconWrap>
    <path d="M8 13V5a1.5 1.5 0 0 1 3 0v6" />
    <path d="M11 11V4a1.5 1.5 0 0 1 3 0v7" />
    <path d="M14 11V5a1.5 1.5 0 0 1 3 0v8" />
    <path d="M17 12V8a1.5 1.5 0 0 1 3 0v6c0 3.9-2.6 7-6.5 7h-1C9 21 7 19 6 17l-2.3-4.2c-.5-.9-.1-2 .8-2.4.8-.4 1.7 0 2.1.7L8 13" />
  </IconWrap>
)
const LeafIcon = () => (
  <IconWrap>
    <path d="M4 20C4 10 12 4 20 4c0 8-6 16-16 16Z" />
    <path d="M4 20c4-4 8-8 16-16" />
  </IconWrap>
)
const BoltIcon = () => (
  <IconWrap>
    <path d="M12 2 4 14h6l-2 8 10-13h-6l2-7Z" />
  </IconWrap>
)
const HeartIcon = () => (
  <IconWrap>
    <path d="M12 20.5s-7.5-4.6-10-9.4C.5 7.6 2.4 4.5 5.7 4a5 5 0 0 1 6.3 2.7A5 5 0 0 1 18.3 4c3.3.5 5.2 3.6 3.7 7.1-2.5 4.8-10 9.4-10 9.4Z" />
  </IconWrap>
)
const WaterIcon = () => (
  <IconWrap>
    <path d="M12 3s6 7.4 6 12a6 6 0 0 1-12 0c0-4.6 6-12 6-12Z" />
    <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
  </IconWrap>
)

/* ---------------------------------- category data ---------------------------------- */
/* `key` doubles as the image filename: /categories/{key}.jpg — drop a matching file in
   later and the tile upgrades from its icon fallback automatically, no code change needed. */

const SALON_CATEGORIES = {
  women: [
    { key: 'women-haircut-styling', name: 'Haircut & Styling', blurb: 'Cuts, wash, blow-dry, curls & straightening', to: '/salon?gender=women&discipline=hair', icon: ScissorsIcon },
    { key: 'women-hair-colour', name: 'Hair Colour', blurb: 'Global colour, root touch-up & highlights', to: '/salon?gender=women&discipline=colour', icon: BrushIcon },
    { key: 'women-hair-treatments', name: 'Hair Treatments', blurb: 'Keratin, smoothening, botox, straightening & protein repair', to: '/salon?gender=women&discipline=hair-treatments', icon: WaveIcon },
    { key: 'women-hair-spa', name: 'Hair Spa', blurb: 'Wash, mask, steam & scalp massage rituals', to: '/salon?gender=women&discipline=hair-spa', icon: DropletIcon },
    { key: 'women-skin-rituals', name: 'Skin Rituals', blurb: 'Facials, de-tan, bleach & threading', to: '/salon?gender=women&discipline=skin', icon: DropletIcon },
    { key: 'women-hair-removal', name: 'Hair Removal', blurb: 'Waxing — honey, rica, chocolate, fruit & sugar', to: '/salon?gender=women&discipline=waxing', icon: FlowerIcon },
    { key: 'women-hands-feet', name: 'Hands & Feet', blurb: 'Manicures, pedicures & gel nail extensions', to: '/salon?gender=women&discipline=hands-feet', icon: GemIcon },
    { key: 'women-makeup-bridal', name: 'Makeup & Bridal', blurb: 'Day & party makeup, bridal styling & wedding packages', to: '/salon?gender=women&discipline=makeup-bridal', icon: LipstickIcon },
  ],
  men: [
    { key: 'men-haircut-styling', name: 'Haircut & Styling', blurb: 'Cuts, wash & perming', to: '/salon?gender=men&discipline=hair', icon: ScissorsIcon },
    { key: 'men-hair-colour', name: 'Hair Colour', blurb: 'Global colour & grey coverage', to: '/salon?gender=men&discipline=colour', icon: BrushIcon },
    { key: 'men-hair-treatments', name: 'Hair Treatments', blurb: 'Keratin, botox & protein repair', to: '/salon?gender=men&discipline=hair-treatments', icon: WaveIcon },
    { key: 'men-hair-spa', name: 'Hair Spa', blurb: 'Wash, mask, steam & anti-hairfall care', to: '/salon?gender=men&discipline=hair-spa', icon: DropletIcon },
    { key: 'men-skin-rituals', name: 'Skin Rituals', blurb: 'Facials, de-tan, bleach & threading', to: '/salon?gender=men&discipline=skin', icon: DropletIcon },
    { key: 'men-hair-removal', name: 'Hair Removal', blurb: 'Waxing & full-body hair removal cream', to: '/salon?gender=men&discipline=waxing', icon: FlowerIcon },
    { key: 'men-hands-feet', name: 'Hands & Feet', blurb: 'Manicures, pedicures & gel nail extensions', to: '/salon?gender=men&discipline=hands-feet', icon: GemIcon },
    { key: 'men-beard-grooming', name: 'Beard & Grooming', blurb: 'Beard trim, styling, shave & grooming packages', to: '/salon?gender=men&discipline=beard-grooming', icon: RazorIcon },
    { key: 'men-makeup', name: 'Makeup', blurb: 'Event makeup for camera & stage', to: '/salon?gender=men&discipline=makeup', icon: LipstickIcon },
  ],
}

const KIDS_CATEGORY = {
  key: 'kids-haircut-styling',
  name: "Kids' Haircut & Styling",
  blurb: 'First haircuts & regular trims',
  to: '/salon?gender=women&discipline=hair',
  icon: ScissorsIcon,
}

const SPA_CATEGORIES = [
  { key: 'spa-classic-massage', name: 'Classic Massage', blurb: 'Swedish, Signature Body, Deep Tissue, Sports & Aromatherapy', to: '/spa?category=classic-western', icon: HandIcon },
  { key: 'spa-asian-massage', name: 'Asian Massage', blurb: 'Thai, Balinese & Ayurvedic Abhyanga', to: '/spa?category=asian-traditional', icon: LeafIcon },
  { key: 'spa-express-massage', name: 'Express Massage', blurb: '30-minute head/neck, back, foot/leg & hand/arm', to: '/spa?category=targeted-express', icon: BoltIcon },
  { key: 'spa-couple-therapy', name: 'Couple Therapy', blurb: 'Shared-room massage for two', to: '/spa?category=for-two', icon: HeartIcon },
  { key: 'spa-wraps-hydrotherapy', name: 'Wraps & Hydrotherapy', blurb: 'Chocolate & wine wrap, jacuzzi & hydro jet bath', to: '/spa?category=wraps-hydro', icon: WaterIcon },
]

/* ---------------------------------- components ---------------------------------- */

function CategoryTile({ category }) {
  const [imgOk, setImgOk] = useState(true)
  const Icon = category.icon
  return (
    <Link to={category.to} className="hub-tile">
      <div className="hub-tile-media">
        {imgOk ? (
          <img
            src={`/categories/${category.key}.jpg`}
            alt=""
            className="hub-tile-img"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className="hub-tile-fallback">
            <Icon />
          </div>
        )}
        <div className="hub-tile-scrim" />
      </div>
      <div className="hub-tile-caption">
        <h3>{category.name}</h3>
        <p>{category.blurb}</p>
      </div>
    </Link>
  )
}

function CategoryGrid({ categories }) {
  return (
    <div className="hub-grid">
      {categories.map((c) => (
        <CategoryTile category={c} key={c.key} />
      ))}
    </div>
  )
}

function HubGenderToggle({ gender, onChange }) {
  return (
    <div className="hub-gender-toggle" role="group" aria-label="Toggle between women's and men's categories">
      <button
        type="button"
        className={`hub-gender-btn${gender === 'women' ? ' active' : ''}`}
        onClick={() => onChange('women')}
        aria-pressed={gender === 'women'}
      >
        <span className="hub-crown hub-crown-women" aria-hidden="true" />
        Women
      </button>
      <button
        type="button"
        className={`hub-gender-btn${gender === 'men' ? ' active' : ''}`}
        onClick={() => onChange('men')}
        aria-pressed={gender === 'men'}
      >
        <span className="hub-crown hub-crown-men" aria-hidden="true" />
        Men
      </button>
    </div>
  )
}

function Catalogue() {
  const [gender, setGender] = useState('women')
  const salonCategories = useMemo(() => [...SALON_CATEGORIES[gender], KIDS_CATEGORY], [gender])

  return (
    <div className="catalogue-hub">
      <header className="hub-topbar">
        <div className="hub-brand">
          <img src="/img/logo-full-salon.webp" alt="Aurum Astra Unisex Salon &amp; Luxury Spa" className="hub-brand-logo" />
        </div>
      </header>

      <section className="hub-hero">
        <p className="eyebrow">Hennur, Bengaluru</p>
        <h1>Explore The Menu</h1>
        <p className="hub-hero-sub">Every ritual, sorted by what you&rsquo;re here for.</p>
      </section>

      <main className="hub-main">
        <section className="hub-section">
          <div className="hub-section-head">
            <h2>Unisex Salon</h2>
            <HubGenderToggle gender={gender} onChange={setGender} />
          </div>
          <CategoryGrid categories={salonCategories} />
        </section>

        <section className="hub-section">
          <div className="hub-section-head">
            <h2>Spa &amp; Wellness</h2>
          </div>
          <CategoryGrid categories={SPA_CATEGORIES} />
        </section>
      </main>

      <footer className="hub-footer">
        <p>
          Reservations: <a href="tel:+919148627266">+91 91486 27266</a>
        </p>
        <p>10:00 AM &ndash; 09:00 PM, daily.</p>
        <nav className="hub-footer-links" aria-label="Policies">
          <a href="/terms-and-conditions">Terms &amp; Conditions</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/refund-policy">Refund Policy</a>
        </nav>
        <p>&copy; {new Date().getFullYear()} Aurum Astra.</p>
      </footer>
    </div>
  )
}

export default Catalogue
