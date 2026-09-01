import './Home.css'

function IconWrap({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

const GlobeIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.6 2.6 4 5.8 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.8-4-9s1.4-6.4 4-9Z" />
  </IconWrap>
)

const InstagramIcon = () => (
  <IconWrap>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </IconWrap>
)

const MapPinIcon = () => (
  <IconWrap>
    <path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </IconWrap>
)

const ChatIcon = () => (
  <IconWrap>
    <path d="M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.6 8.6 0 0 1-3.8-.9L3 20l1.1-5.1a8.5 8.5 0 0 1-.9-3.9A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
  </IconWrap>
)

const PhoneIcon = () => (
  <IconWrap>
    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.4c1 .3 2.1.5 3.1.5a1.5 1.5 0 0 1 1.5 1.5V20a1.5 1.5 0 0 1-1.5 1.5C10.4 21.5 2.5 13.6 2.5 4.5A1.5 1.5 0 0 1 4 3h3.2a1.5 1.5 0 0 1 1.5 1.5c0 1 .2 2.1.5 3.1a1.5 1.5 0 0 1-.4 1.5L6.6 10.8Z" />
  </IconWrap>
)

const ChevronIcon = () => (
  <svg className="touchpoint-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6l6 6-6 6" />
  </svg>
)

const SparkIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c.85 3.4 1.55 6.05 2.35 6.85.8.8 3.45 1.5 6.85 2.35-3.4.85-6.05 1.55-6.85 2.35-.8.8-1.5 3.45-2.35 6.85-.85-3.4-1.55-6.05-2.35-6.85-.8-.8-3.45-1.5-6.85-2.35 3.4-.85 6.05-1.55 6.85-2.35.8-.8 1.5-3.45 2.35-6.85Z" />
  </svg>
)

const TOUCHPOINTS = [
  {
    title: 'The Digital Boutique',
    subtitle: 'Explore services, stories & more',
    href: 'https://www.aurumastra.com',
    icon: GlobeIcon,
    external: true,
  },
  {
    title: 'Behind The Scenes',
    subtitle: '@aurumastra — follow our journey',
    href: 'https://instagram.com/aurumastra',
    icon: InstagramIcon,
    external: true,
  },
  {
    title: 'Find Our Studio',
    subtitle: 'Directions to the salon in Bengaluru',
    href: 'https://maps.google.com/?q=Aurum+Astra+Unisex+Salon+%26+Luxury+Spa+Bengaluru',
    icon: MapPinIcon,
    external: true,
  },
  {
    title: 'Concierge Chat',
    subtitle: 'Message our team on WhatsApp',
    href: 'https://wa.me/919999999999',
    icon: ChatIcon,
    external: true,
  },
  {
    title: 'Reserve By Phone',
    subtitle: 'Speak with our front desk',
    href: 'tel:+919999999999',
    icon: PhoneIcon,
    external: false,
  },
]

function handleTouchpointPress(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX || rect.width / 2) - rect.left
  const y = (event.clientY || rect.height / 2) - rect.top
  event.currentTarget.style.setProperty('--x', `${x}px`)
  event.currentTarget.style.setProperty('--y', `${y}px`)
}

function Home() {
  return (
    <div className="home">
      <header className="home-brand">
        <div className="home-logo-frame">
          <img src="/Brand Logo.png" alt="Aurum Astra" />
        </div>
        <div className="home-divider">
          <SparkIcon className="home-divider-spark" />
        </div>
      </header>

      <main className="home-body">
        <nav className="touchpoints" aria-label="Aurum Astra quick links">
          {TOUCHPOINTS.map(({ title, subtitle, href, icon: Icon, external }, index) => (
            <a
              key={title}
              className="touchpoint"
              href={href}
              style={{ '--delay': `${index * 70}ms` }}
              onPointerDown={handleTouchpointPress}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className="touchpoint-icon">
                <Icon />
              </span>
              <span className="touchpoint-text">
                <span className="touchpoint-title">{title}</span>
                <span className="touchpoint-subtitle">{subtitle}</span>
              </span>
              <ChevronIcon />
            </a>
          ))}
        </nav>

        <section className="promo-card" aria-label="Latest updates">
          <div className="promo-visual">
            <div className="promo-visual-ring" />
            <img src="/Brand Icon.png" alt="" className="promo-visual-mark" />
            <span className="promo-badge">Opening 2026</span>
          </div>
          <div className="promo-content">
            <p className="promo-eyebrow">
              <SparkIcon className="promo-eyebrow-spark" />
              Latest Updates
            </p>
            <h2 className="promo-title">A New Chapter Is Coming</h2>
            <p className="promo-copy">
              We&rsquo;re thrilled to announce the upcoming launch of our new 2,000 sq. ft.
              luxury salon and spa space in Bengaluru — a dedicated home for the full Aurum
              Astra experience. Stay tuned.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
