import { useEffect, useRef, useState } from 'react'
import {
  GlobeIcon,
  InstagramIcon,
  MapPinIcon,
  ChatIcon,
  PhoneIcon,
  ChevronIcon,
  SparkIcon,
  ScissorsIcon,
  DropletIcon,
  WaveIcon,
  GemIcon,
} from '../components/icons.jsx'
import './Home.css'

const WHATSAPP_NUMBER = '919999999999'
const PHONE_HREF = 'tel:+919999999999'

function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/* ---------------------------------- data ---------------------------------- */

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
    href: buildWhatsAppLink('Hi Aurum Astra, I have a question.'),
    icon: ChatIcon,
    external: true,
  },
  {
    title: 'Reserve By Phone',
    subtitle: 'Speak with our front desk',
    href: PHONE_HREF,
    icon: PhoneIcon,
    external: false,
  },
]

const OFFERS = [
  {
    badge: 'Opening 2026',
    eyebrow: 'Expanding Soon',
    title: 'A new address is coming.',
    copy: 'A dedicated 2,000 sq. ft. flagship in Bengaluru — two floors built to bring the full Inner Circle experience to life. Our current studio stays open throughout.',
    mark: '/Brand Icon.png',
  },
  {
    badge: 'Placeholder',
    eyebrow: 'Limited-Time Offer',
    title: 'Add your next promo here.',
    copy: 'Swap this card for a seasonal offer, launch perk, or festive discount — the carousel holds as many as you like.',
  },
  {
    badge: 'Placeholder',
    eyebrow: 'Referral Program',
    title: 'Bring a friend, both save.',
    copy: 'Another template slot — replace with real referral terms whenever they’re ready.',
  },
]

const DISCIPLINES = [
  {
    numeral: 'I.',
    title: 'Hair Atelier',
    copy: 'Precision cutting, colour artistry, and finishing rituals — tailored to the way you actually live.',
    icon: ScissorsIcon,
  },
  {
    numeral: 'II.',
    title: 'Skin & Face Rituals',
    copy: "Facials and skin therapies calibrated to your skin's story, not a generic routine.",
    icon: DropletIcon,
  },
  {
    numeral: 'III.',
    title: 'Body & Spa Therapies',
    copy: 'Massage and body rituals that restore, from the first ten minutes onward.',
    icon: WaveIcon,
  },
  {
    numeral: 'IV.',
    title: 'Nails & Hands',
    copy: 'Manicures and nail artistry finished with the same precision as everything else here.',
    icon: GemIcon,
  },
]

/* ---------------------------------- helpers ---------------------------------- */

function handleTouchpointPress(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX || rect.width / 2) - rect.left
  const y = (event.clientY || rect.height / 2) - rect.top
  event.currentTarget.style.setProperty('--x', `${x}px`)
  event.currentTarget.style.setProperty('--y', `${y}px`)
}

function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`reveal${visible ? ' in' : ''}${className ? ` ${className}` : ''}`} {...rest}>
      {children}
    </Tag>
  )
}

function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars = []
    let frameId = null

    function resize() {
      const parent = canvas.parentElement
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
      const count = Math.floor((canvas.width * canvas.height) / 8000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
        gold: Math.random() < 0.3,
      }))
    }

    function draw(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((s) => {
        const tw = reduceMotion ? 0.75 : Math.sin(t * s.speed + s.phase) * 0.4 + 0.6
        ctx.beginPath()
        ctx.fillStyle = s.gold ? `rgba(240,195,130,${tw * 0.95})` : `rgba(243,236,224,${tw * 0.8})`
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      if (!reduceMotion) frameId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduceMotion) {
      draw(0)
    } else {
      frameId = requestAnimationFrame(draw)
    }

    return () => {
      window.removeEventListener('resize', resize)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}

function DawnSpine() {
  const ref = useRef(null)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const height = doc.scrollHeight - window.innerHeight
      const pct = height > 0 ? window.scrollY / height : 0
      if (ref.current) ref.current.style.transform = `scaleY(${pct})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div className="dawn-spine" ref={ref} />
}

function OfferCarousel({ items }) {
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            setActive(Number(entry.target.dataset.index))
          }
        })
      },
      { root: track, threshold: [0.6] },
    )
    cardRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  function goTo(index) {
    cardRefs.current[index]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <div className="offer-carousel">
      <div className="offer-track" ref={trackRef}>
        {items.map((item, index) => (
          <article
            key={item.title}
            className="offer-card"
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            data-index={index}
          >
            <div className="offer-visual">
              <div className="offer-ring" />
              {item.mark ? (
                <img src={item.mark} alt="" className="offer-mark" />
              ) : (
                <SparkIcon className="offer-mark offer-mark-spark" />
              )}
              <span className="offer-badge">{item.badge}</span>
            </div>
            <div className="offer-content">
              <p className="eyebrow">{item.eyebrow}</p>
              <h3>{item.title}</h3>
              <p className="offer-copy">{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
      <div className="offer-dots">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            className={`offer-dot${index === active ? ' active' : ''}`}
            aria-label={`Show offer ${index + 1}`}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  )
}

function ReserveForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const lines = ["Hi Aurum Astra, I'd like to reserve a visit.", `Name: ${name}`, `Phone: ${phone}`]
    window.open(buildWhatsAppLink(lines.join('\n')), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <form className="reserve-form" onSubmit={handleSubmit}>
      <div className="field">
        <input id="rv-name" placeholder=" " required value={name} onChange={(e) => setName(e.target.value)} />
        <label htmlFor="rv-name">Full name</label>
      </div>
      <div className="field">
        <input id="rv-phone" type="tel" placeholder=" " required value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label htmlFor="rv-phone">Phone number</label>
      </div>
      <button type="submit" className="reserve-submit">
        Reserve Via WhatsApp
      </button>
      {sent && (
        <p className="reserve-note">
          Opening WhatsApp with your details filled in — just hit send to confirm.
        </p>
      )}
    </form>
  )
}

/* ---------------------------------- page ---------------------------------- */

function Home() {
  return (
    <div className="home">
      <DawnSpine />

      {/* HERO */}
      <section id="hero" className="hero">
        <Starfield />
        <div className="hero-inner">
          <div className="hero-main">
            <div className="hero-logo-frame">
              <img src="/Transparent Brand Logo.png" alt="Aurum Astra" />
            </div>
            <p className="eyebrow hero-eyebrow">Hennur, Bangalore</p>
            <h1 className="hero-title">
              The dawn of
              <br />
              <em>stellar</em> luxury
            </h1>
            <p className="hero-sub">
              A new standard in unisex salon artistry and spa therapy — open now in Bengaluru.
            </p>
            <div className="hero-divider">
              <SparkIcon className="hero-divider-spark" />
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT / TOUCHPOINTS */}
      <section id="connect" className="section-pad connect-section">
        <Reveal as="div" className="connect-head">
          <p className="eyebrow">At Your Fingertips</p>
          <h2>Reach Us Instantly</h2>
        </Reveal>
        <Reveal as="nav" className="touchpoints" aria-label="Aurum Astra quick links">
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
                <SparkIcon className="touchpoint-spark" />
              </span>
              <span className="touchpoint-text">
                <span className="touchpoint-title">{title}</span>
                <span className="touchpoint-subtitle">{subtitle}</span>
              </span>
              <ChevronIcon className="touchpoint-chevron" />
            </a>
          ))}
        </Reveal>
      </section>

      {/* PHILOSOPHY */}
      <section id="philosophy" className="section-pad phi-section">
        <div className="phi-copy">
          <Reveal>
            <SparkIcon className="phi-mark" />
          </Reveal>
          <Reveal as="p" className="eyebrow">
            The Philosophy
          </Reveal>
          <Reveal as="h2">A masterpiece of self-care.</Reveal>
          <Reveal as="p" className="phi-quote">
            &ldquo;We don&rsquo;t offer services. We architect the twenty minutes where you stop
            performing and simply arrive.&rdquo;
          </Reveal>
          <Reveal as="p" className="phi-foot">
            A founding team shaped by years across the region&rsquo;s finest houses of care. The
            doors are open — the standard was set long before they were.
          </Reveal>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="section-pad services-section">
        <Reveal className="services-head">
          <h2>Our signature disciplines.</h2>
          <p>Four crafts, one standard. Tap any discipline to ask us about it directly.</p>
        </Reveal>
        <Reveal as="div" className="services-grid">
          {DISCIPLINES.map(({ numeral, title, copy, icon: Icon }) => (
            <a
              key={title}
              className="discipline-card"
              href={buildWhatsAppLink(`Hi Aurum Astra, I'd like to know more about your ${title} services.`)}
              target="_blank"
              rel="noopener noreferrer"
              onPointerDown={handleTouchpointPress}
            >
              <div className="discipline-card-top">
                <span className="dnum">{numeral}</span>
                <span className="discipline-icon">
                  <Icon />
                </span>
              </div>
              <h3>{title}</h3>
              <p className="discipline-copy">{copy}</p>
              <span className="discipline-cta">
                Ask About This <ChevronIcon />
              </span>
            </a>
          ))}
        </Reveal>
      </section>

      {/* OFFERS & PROMOS CAROUSEL */}
      <section id="offers" className="section-pad offers-section">
        <Reveal className="offers-head">
          <p className="eyebrow">Offers &amp; Promos</p>
          <h2>What&rsquo;s new.</h2>
        </Reveal>
        <Reveal>
          <OfferCarousel items={OFFERS} />
        </Reveal>
      </section>

      {/* MEMBERSHIP / INNER CIRCLE */}
      <section id="membership" className="section-pad membership-section">
        <div className="ic-copy">
          <Reveal>
            <SparkIcon className="ic-mark" />
          </Reveal>
          <Reveal as="p" className="eyebrow ic-eyebrow">
            Exclusivity
          </Reveal>
          <Reveal as="h2">The Inner Circle.</Reveal>
          <Reveal as="p">
            Private pricing, priority booking, and first access to every new ritual — reserved
            for our most valued guests.
          </Reveal>
          <Reveal as="div" className="ic-actions">
            <a
              href={buildWhatsAppLink('Hi Aurum Astra, I’d like to enquire about Inner Circle membership.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-light"
            >
              Enquire About Membership
            </a>
          </Reveal>

          <Reveal className="ic-card-wrap">
            <div className="ic-card">
              <div className="ic-card-inner">
                <div className="ic-card-top">
                  <SparkIcon className="ic-card-mark" />
                  <span className="ic-card-no">No. 001</span>
                </div>
                <div>
                  <div className="ic-card-name">Inner Circle</div>
                  <div className="ic-card-tag">Aurum Astra &middot; Priority Access</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* RESERVE */}
      <section id="reserve" className="section-pad reserve-section">
        <div className="reserve-inner">
          <Reveal as="p" className="eyebrow">
            Reserve Your Visit
          </Reveal>
          <Reveal as="h2">Ready when you are.</Reveal>
          <Reveal as="p" className="reserve-lede">
            Share your details and we&rsquo;ll confirm your slot over WhatsApp — zero wait.
          </Reveal>

          <Reveal>
            <ReserveForm />
          </Reveal>

          <Reveal as="p" className="reserve-alt">
            Prefer to talk it through?{' '}
            <a href={PHONE_HREF} className="link-quiet">
              Reserve by phone
            </a>
          </Reveal>
        </div>
      </section>

      <footer className="site-footer-mini">
        <div className="footer-mark">
          <SparkIcon className="footer-mark-spark" />
          AURUM ASTRA
        </div>
        <p className="footer-tag">Unisex Salon &amp; Luxury Spa</p>
        <div className="footer-meta">
          <span>Bengaluru, Karnataka</span>
          <span>&middot;</span>
          <a href="https://instagram.com/aurumastra" target="_blank" rel="noopener noreferrer">
            @aurumastra on Instagram
          </a>
          <span>&middot;</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
