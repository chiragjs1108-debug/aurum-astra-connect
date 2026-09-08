import { useMemo, useState } from 'react'
import { SparkIcon, ChevronIcon, ChatIcon, IconWrap } from '../components/icons.jsx'
import './SpaRituals.css'

const WHATSAPP_NUMBER = '919148627266'
const PHONE_HREF = 'tel:+919148627266'
const PHONE_DISPLAY = '+91 91486 27266'

function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function formatPrice(price) {
  return typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price
}

/* ---------------------------------- icons ---------------------------------- */

const MonitorIcon = () => (
  <IconWrap>
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M9 20h6M12 16v4" />
  </IconWrap>
)
const TargetIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3.5" />
  </IconWrap>
)
const StretchIcon = () => (
  <IconWrap>
    <path d="M12 3v6M12 9 6 15M12 9l6 6" />
    <circle cx="12" cy="5" r="2" />
  </IconWrap>
)
const MoonIcon = () => (
  <IconWrap>
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
  </IconWrap>
)
const HeartIcon = () => (
  <IconWrap>
    <path d="M12 20.5s-7.5-4.6-10-9.4C.5 7.6 2.4 4.5 5.7 4a5 5 0 0 1 6.3 2.7A5 5 0 0 1 18.3 4c3.3.5 5.2 3.6 3.7 7.1-2.5 4.8-10 9.4-10 9.4Z" />
  </IconWrap>
)
const CalendarIcon = () => (
  <IconWrap>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </IconWrap>
)
const ClockIcon = () => (
  <IconWrap>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </IconWrap>
)
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
const WaterIcon = () => (
  <IconWrap>
    <path d="M12 3s6 7.4 6 12a6 6 0 0 1-12 0c0-4.6 6-12 6-12Z" />
    <path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5" />
  </IconWrap>
)
const GiftIcon = () => (
  <IconWrap>
    <rect x="3" y="9" width="18" height="12" rx="1.5" />
    <path d="M3 13h18M12 9v12" />
    <path d="M12 9C9.5 9 8 7.5 8 6a2.5 2.5 0 0 1 4-2 2.5 2.5 0 0 1 4 2c0 1.5-1.5 3-4 3Z" />
  </IconWrap>
)

/* ---------------------------------- data ---------------------------------- */

const TIER_INFO = [
  { tier: 'Essential', blurb: 'The classic version, done beautifully — quick and reliable.' },
  { tier: 'Signature', blurb: 'Our most-booked upgrade, with an added ritual or finish.' },
  { tier: 'Luxe', blurb: 'The full Aurum Astra experience — extended time, premium products.', crown: true },
]

const MODES = [
  { id: 'reason', label: 'By Reason' },
  { id: 'category', label: 'By Massage Type' },
]

const REASONS = [
  { id: 'desk-screen', title: 'Desk & Screen', icon: MonitorIcon, intro: 'Nine hours in the same chair adds up — this is where we undo it.', sub: 'For tight shoulders, a stiff neck, and 6pm headaches.' },
  { id: 'pain-performance', title: 'Pain & Performance', icon: TargetIcon, intro: 'Firmer pressure, aimed exactly where you already know it hurts.', sub: 'Tell your therapist the sport, the session, the sore spot.' },
  { id: 'movement-recovery', title: 'Movement & Recovery', icon: StretchIcon, intro: 'For bodies that have stopped moving the way they used to.', sub: 'Warm oil, stretching, and heat for stiff joints.' },
  { id: 'deep-rest', title: 'Deep Rest', icon: MoonIcon, intro: 'Nothing to decide, nothing to hold — for when you are simply tired.', sub: 'Lower pressure, warmer oil, longer silences.' },
  { id: 'together', title: 'Together', icon: HeartIcon, intro: 'Two tables, one room, ninety minutes where neither of you is on your phone.', sub: 'A day or two of notice makes booking easier.' },
  { id: 'occasions', title: 'Occasions', icon: CalendarIcon, intro: 'Some visits mark something. These are long enough to feel like one.', sub: 'Several treatments in one visit — please book ahead.' },
  { id: 'short-on-time', title: 'Short On Time', icon: ClockIcon, intro: 'Thirty honest minutes beats ninety you never book.', sub: 'Walk-in friendly when the floor allows.' },
]

const CATEGORIES = [
  { id: 'classic-western', title: 'Classic & Western', icon: HandIcon, intro: 'The names you already know, done with real precision.', sub: 'Swedish, reflexology, and their signature variations.' },
  { id: 'asian-traditional', title: 'Asian & Traditional', icon: LeafIcon, intro: 'Technique passed down, not shortcuts invented.', sub: 'Thai, Balinese, and Ayurvedic Abhyanga.' },
  { id: 'targeted-express', title: 'Targeted & Express', icon: BoltIcon, intro: 'One area, undivided attention, thirty minutes flat.', sub: 'No oil in your hair, nothing to shower off.' },
  { id: 'for-two', title: 'For Two', icon: HeartIcon, intro: 'Matched timings, so you both finish together.', sub: 'A limited number of shared rooms — book ahead.' },
  { id: 'wraps-hydro', title: 'Wraps & Hydrotherapy', icon: WaterIcon, intro: 'Warmth and water, to loosen what hands alone can’t.', sub: 'Before a massage, or as the indulgence itself.' },
  { id: 'journeys-occasions', title: 'Journeys & Occasions', icon: CalendarIcon, intro: 'Several treatments, one visit, built to be savoured.', sub: 'These run two to three hours — please book ahead.' },
  { id: 'memberships-gifting', title: 'Memberships & Gifting', icon: GiftIcon, intro: 'Ways to keep coming back, and ways to bring someone with you.', sub: 'Quoted on enquiry, shaped around how you visit.' },
]

const THERAPIES = [
  { name: 'Head, Neck & Shoulder Massage', tier: 'Essential', note: 'Our most-booked half hour — no oil in your hair.', options: [{ duration: '30 min', price: 1000 }], reasons: ['desk-screen', 'short-on-time'], category: 'targeted-express' },
  { name: 'Back Massage', tier: 'Essential', note: 'One area, thirty minutes, no fuss.', options: [{ duration: '30 min', price: 1000 }], reasons: ['desk-screen', 'pain-performance', 'short-on-time'], category: 'targeted-express' },
  { name: 'Swedish Massage', tier: 'Essential', note: 'Full body, medium pressure — nothing to brace for.', options: [{ duration: '45 min', price: 1800 }, { duration: '60 min', price: 2500 }, { duration: '90 min', price: 3500 }], reasons: ['desk-screen', 'deep-rest'], category: 'classic-western' },
  { name: 'Reflexology — Foot & Hand', tier: 'Signature', note: 'Pressure-point work. Stay dressed, leave lighter.', options: [{ duration: '45 min', price: 700 }, { duration: '60 min', price: 1000 }], reasons: ['desk-screen', 'short-on-time'], category: 'classic-western' },
  { name: 'Foot & Leg Massage', tier: 'Essential', note: 'Calves, arches, and shins.', options: [{ duration: '30 min', price: 1000 }], reasons: ['pain-performance', 'short-on-time'], category: 'targeted-express' },
  { name: 'Deep Tissue Massage', tier: 'Signature', note: 'Slow, firm strokes below the surface ache.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3000 }, { duration: '90 min', price: 4000 }], reasons: ['pain-performance'], category: 'classic-western' },
  { name: 'Sports Massage', tier: 'Signature', note: 'Before, after, or mid-training.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3000 }, { duration: '90 min', price: 4000 }], reasons: ['pain-performance'], category: 'classic-western' },
  { name: 'Thai Massage', tier: 'Signature', note: 'Assisted stretching, fully clothed.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3000 }, { duration: '90 min', price: 4000 }], reasons: ['pain-performance'], category: 'asian-traditional' },
  { name: 'Hand & Arm Massage', tier: 'Essential', note: 'Wrists, forearms, and fingers.', options: [{ duration: '30 min', price: 1000 }], reasons: ['movement-recovery', 'short-on-time'], category: 'targeted-express' },
  { name: 'Balinese Massage', tier: 'Signature', note: 'Acupressure and long strokes, firm but smooth.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3200 }, { duration: '90 min', price: 4500 }], reasons: ['movement-recovery', 'deep-rest'], category: 'asian-traditional' },
  { name: 'Ayurvedic Abhyanga Massage', tier: 'Luxe', note: 'Traditional warm-oil technique.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3000 }, { duration: '90 min', price: 4000 }], reasons: ['movement-recovery'], category: 'asian-traditional' },
  { name: 'Jacuzzi & Hydro Jet Bath', tier: 'Luxe', note: 'Warm water and jets before hands arrive.', options: [{ duration: '60 min', price: 7000 }, { duration: '90 min', price: 9000 }], reasons: ['movement-recovery'], category: 'wraps-hydro' },
  { name: 'Signature Body Massage', tier: 'Signature', note: 'Our most-booked therapy.', options: [{ duration: '45 min', price: 2500 }, { duration: '60 min', price: 3000 }, { duration: '90 min', price: 4000 }], reasons: ['deep-rest'], category: 'classic-western' },
  { name: 'Aromatherapy Massage', tier: 'Luxe', note: 'Choose your essential oil — jasmine or peppermint.', options: [{ duration: '45 min', price: 1800 }, { duration: '60 min', price: 2500 }, { duration: '90 min', price: 3500 }], reasons: ['deep-rest'], category: 'classic-western' },
  { name: 'Chocolate & Wine Therapy', tier: 'Luxe', note: 'Our indulgent one — warm and rich.', options: [{ duration: '60 min', price: 4000 }], reasons: ['deep-rest'], category: 'wraps-hydro' },
  { name: "Couple's Membership", tier: 'Signature', note: 'Shared credit, paired booking slots.', options: [{ duration: 'Annual', price: 'On Enquiry' }], reasons: ['together'], category: 'memberships-gifting' },
  { name: "Couple's Massage — Shared Room", tier: 'Luxe', note: 'Two therapists, your own pressure each.', options: [{ duration: '90 min', price: 6000 }], reasons: ['together'], category: 'for-two' },
  { name: 'Honeymoon & Anniversary Package', tier: 'Luxe', note: 'Foot ritual, massage, scrub, private jacuzzi.', options: [{ duration: '180 min', price: 15000 }], reasons: ['together', 'occasions'], category: 'journeys-occasions' },
  { name: 'Birthday Pamper Package', tier: 'Essential', note: 'Built around the birthday guest.', options: [{ duration: 'Bundle', price: 'On Enquiry' }], reasons: ['occasions'], category: 'journeys-occasions' },
  { name: 'Festival & Seasonal Package', tier: 'Signature', note: 'Our Diwali and New Year glow-up.', options: [{ duration: 'Seasonal', price: 'On Enquiry' }], reasons: ['occasions'], category: 'journeys-occasions' },
  { name: 'Signature Spa Journey', tier: 'Luxe', note: 'Massage, scrub, de-tan, polish, jacuzzi.', options: [{ duration: '150 min', price: 15000 }], reasons: ['occasions'], category: 'journeys-occasions' },
  { name: 'Spa Day Gift Experience', tier: 'Luxe', note: 'Boxed and ready to hand over.', options: [{ duration: 'Bundle', price: 'On Enquiry' }], reasons: ['occasions'], category: 'memberships-gifting' },
  { name: 'Prepaid Wallet', tier: 'Essential', note: 'Pay ₹10,000, receive ₹12,000 credit.', options: [{ duration: '—', price: 'On Enquiry' }], reasons: [], category: 'memberships-gifting' },
  { name: 'Annual Spa Membership', tier: 'Signature', note: 'Member rates on every therapy here.', options: [{ duration: 'Annual', price: 'On Enquiry' }], reasons: [], category: 'memberships-gifting' },
  { name: 'Gift Vouchers', tier: 'Essential', note: 'Any value, valid across salon and spa.', options: [{ duration: '—', price: 'Any Value' }], reasons: [], category: 'memberships-gifting' },
  { name: 'Corporate Wellness Tie-up', tier: 'Essential', note: 'On-site chair therapy for your team.', options: [{ duration: '—', price: 'On Enquiry' }], reasons: [], category: 'memberships-gifting' },
]

/* ---------------------------------- components ---------------------------------- */

function TierBadge({ tier }) {
  const info = TIER_INFO.find((t) => t.tier === tier)
  return (
    <span className={`tier-badge tier-${tier.toLowerCase()}`}>
      {info?.crown && <SparkIcon className="tier-badge-spark" />}
      {tier}
    </span>
  )
}

function TherapyCard({ therapy }) {
  const [selected, setSelected] = useState(0)
  const active = therapy.options[selected]
  const isEnquiry = typeof active.price !== 'number'
  const message = isEnquiry
    ? `Hi Aurum Astra, I'd like to enquire about ${therapy.name}.`
    : `Hi Aurum Astra, I'd like to book ${therapy.name} — ${active.duration} (${formatPrice(active.price)}).`

  return (
    <div className="tier-card">
      <TierBadge tier={therapy.tier} />
      <h3 className="therapy-name">{therapy.name}</h3>
      <p className="tier-note">{therapy.note}</p>

      {therapy.options.length > 1 && (
        <div className="therapy-options">
          {therapy.options.map((opt, i) => (
            <button
              key={opt.duration}
              type="button"
              className={`therapy-option${i === selected ? ' active' : ''}`}
              onClick={() => setSelected(i)}
            >
              {opt.duration}
            </button>
          ))}
        </div>
      )}

      <div className="tier-meta">
        <span>{active.duration}</span>
        <span>{formatPrice(active.price)}</span>
      </div>

      <a className="therapy-book" href={buildWhatsAppLink(message)} target="_blank" rel="noopener noreferrer">
        {isEnquiry ? 'Enquire' : 'Book'}
        <ChevronIcon className="therapy-book-chevron" />
      </a>
    </div>
  )
}

function SpaRituals() {
  const [mode, setMode] = useState('reason')
  const [reasonId, setReasonId] = useState(REASONS[0].id)
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id)

  const tabs = mode === 'reason' ? REASONS : CATEGORIES
  const activeId = mode === 'reason' ? reasonId : categoryId
  const setActiveId = mode === 'reason' ? setReasonId : setCategoryId
  const activeTab = useMemo(() => tabs.find((t) => t.id === activeId) ?? tabs[0], [tabs, activeId])

  const therapies = useMemo(() => {
    if (mode === 'reason') return THERAPIES.filter((t) => t.reasons.includes(activeTab.id))
    return THERAPIES.filter((t) => t.category === activeTab.id)
  }, [mode, activeTab])

  return (
    <div className="spa-rituals">
      <header className="sr-topbar">
        <div className="sr-topbar-inner">
          <div className="sr-brand">
            <SparkIcon className="sr-brand-spark" />
            <span>Aurum Astra</span>
          </div>
          <a
            className="sr-topbar-call"
            href={buildWhatsAppLink('Hi Aurum Astra, I’d like to reserve a spa visit.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reserve on WhatsApp"
          >
            <ChatIcon />
          </a>
        </div>

        <div className="sr-mode-row">
          <div className="sr-mode-toggle" role="group" aria-label="Browse the menu by">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                className={mode === m.id ? 'sr-mode-btn active' : 'sr-mode-btn'}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="sr-topbar-row2">
          <nav className="sr-tabs" aria-label={mode === 'reason' ? 'Browse by reason' : 'Browse by massage type'}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                className={activeId === t.id ? 'sr-tab active' : 'sr-tab'}
                onClick={() => setActiveId(t.id)}
              >
                <t.icon />
                {t.title}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="sr-header">
        <p className="eyebrow">Hennur, Bengaluru</p>
        <h1>Spa Rituals</h1>
        <p className="sr-subhead">
          Browse {mode === 'reason' ? 'by why you came in' : 'by the kind of massage you want'}.
        </p>
      </section>

      <div className="tier-legend">
        {TIER_INFO.map((t) => (
          <div className="tier-legend-item" key={t.tier}>
            <TierBadge tier={t.tier} />
            <p>{t.blurb}</p>
          </div>
        ))}
      </div>

      <main className="sr-main">
        <div className="reason-head">
          <span className="reason-head-icon">
            <activeTab.icon />
          </span>
          <div>
            <h2>{activeTab.title}</h2>
            <p className="reason-intro">{activeTab.intro}</p>
            <p className="reason-sub">{activeTab.sub}</p>
          </div>
        </div>
        <div className="tier-grid">
          {therapies.map((t) => (
            <TherapyCard therapy={t} key={t.name + activeTab.id} />
          ))}
        </div>
      </main>

      <footer className="sr-footer">
        <p className="sr-footer-info">
          10:00 AM &ndash; 09:00 PM, daily &middot; <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
        </p>
        <p>Memberships, gifting, and corporate wellness available &mdash; ask at reception, call, or WhatsApp.</p>
        <p>Prices include taxes and may change. &copy; {new Date().getFullYear()} Aurum Astra.</p>
      </footer>
    </div>
  )
}

export default SpaRituals
