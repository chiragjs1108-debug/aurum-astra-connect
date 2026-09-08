import { useMemo, useState } from 'react'
import { SparkIcon, ScissorsIcon, DropletIcon, WaveIcon, GemIcon } from '../components/icons.jsx'
import './Catalogue.css'

const CATEGORIES = ['Salon', 'Spa']

const DISCIPLINES = {
  Salon: [
    { key: 'hair', name: 'Hair Atelier', icon: ScissorsIcon },
    { key: 'nails', name: 'Nails & Hands', icon: GemIcon },
  ],
  Spa: [
    { key: 'skin', name: 'Skin & Face Rituals', icon: DropletIcon },
    { key: 'body', name: 'Body & Spa Therapies', icon: WaveIcon },
  ],
}

const TIER_INFO = [
  { tier: 'Essential', blurb: 'The classic version, done beautifully — quick and reliable.' },
  { tier: 'Signature', blurb: 'Our most-booked upgrade, with an added ritual or finish.' },
  { tier: 'Luxe', blurb: 'The full Aurum Astra experience — extended time, premium products, every detail considered.', crown: true },
]

const SERVICES = [
  {
    discipline: 'hair',
    name: 'Haircut & Style',
    summary: 'A precision cut and finish, tailored to face shape and lifestyle.',
    unisex: false,
    tiers: [
      {
        tier: 'Essential',
        note: 'Wash, precision cut, and blow-dry finish.',
        women: { price: '$—', duration: '45 min' },
        men: { price: '$—', duration: '30 min' },
      },
      {
        tier: 'Signature',
        note: 'Adds a deep-conditioning ritual and tailored styling consult.',
        women: { price: '$—', duration: '60 min' },
        men: { price: '$—', duration: '40 min' },
      },
      {
        tier: 'Luxe',
        note: 'Full consultation, cut, restorative treatment, and a finishing scalp massage.',
        women: { price: '$—', duration: '90 min' },
        men: { price: '$—', duration: '55 min' },
      },
    ],
  },
  {
    discipline: 'hair',
    name: 'Colour & Gloss',
    summary: 'Custom colour work finished with a high-shine gloss.',
    unisex: false,
    tiers: [
      {
        tier: 'Essential',
        note: 'Single-process colour with a gloss finish.',
        women: { price: '$—', duration: '90 min' },
        men: { price: '$—', duration: '45 min' },
      },
      {
        tier: 'Signature',
        note: 'Colour, gloss, and a strengthening bond treatment.',
        women: { price: '$—', duration: '120 min' },
        men: { price: '$—', duration: '60 min' },
      },
      {
        tier: 'Luxe',
        note: 'Custom colour design, gloss, and a full restorative treatment.',
        women: { price: '$—', duration: '150 min' },
        men: { price: '$—', duration: '75 min' },
      },
    ],
  },
  {
    discipline: 'nails',
    name: 'Manicure',
    summary: 'Shape, care, and polish for hands that do a lot of talking.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Shape, cuticle care, and polish.', price: '$—', duration: '30 min' },
      { tier: 'Signature', note: 'Adds an exfoliating scrub and hand massage.', price: '$—', duration: '45 min' },
      { tier: 'Luxe', note: 'Extended hand ritual with paraffin treatment and premium polish.', price: '$—', duration: '60 min' },
    ],
  },
  {
    discipline: 'nails',
    name: 'Pedicure',
    summary: 'A grounding foot ritual, from quick tidy-up to full pampering.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Soak, shape, cuticle care, and polish.', price: '$—', duration: '40 min' },
      { tier: 'Signature', note: 'Adds callus treatment and an extended foot massage.', price: '$—', duration: '55 min' },
      { tier: 'Luxe', note: 'Full ritual with paraffin treatment, extended massage, and premium polish.', price: '$—', duration: '75 min' },
    ],
  },
  {
    discipline: 'skin',
    name: 'Signature Facial',
    summary: 'A diagnostic facial calibrated to the skin in front of you.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Cleanse, exfoliate, and hydrate.', price: '$—', duration: '40 min' },
      { tier: 'Signature', note: 'Adds an LED light therapy finish.', price: '$—', duration: '60 min' },
      { tier: 'Luxe', note: 'Full diagnostic facial with extraction, mask, and a gua sha finish.', price: '$—', duration: '90 min' },
    ],
  },
  {
    discipline: 'skin',
    name: 'Express Glow Facial',
    summary: 'A shorter facial for guests short on time, not on standards.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Quick cleanse and hydrating mask.', price: '$—', duration: '25 min' },
      { tier: 'Signature', note: 'Adds a brightening serum and facial massage.', price: '$—', duration: '35 min' },
      { tier: 'Luxe', note: 'Full glow ritual with LED finish and cooling eye treatment.', price: '$—', duration: '50 min' },
    ],
  },
  {
    discipline: 'body',
    name: 'Swedish Massage',
    summary: 'A full-body massage to release tension and restore calm.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Full-body relaxation massage.', price: '$—', duration: '45 min' },
      { tier: 'Signature', note: 'Adds targeted work on problem areas.', price: '$—', duration: '60 min' },
      { tier: 'Luxe', note: 'Extended full-body ritual with aromatherapy oils.', price: '$—', duration: '90 min' },
    ],
  },
  {
    discipline: 'body',
    name: 'Hot Stone Therapy',
    summary: 'Heated stones ease deep tension through the whole body.',
    unisex: true,
    tiers: [
      { tier: 'Essential', note: 'Hot stone massage focused on back and shoulders.', price: '$—', duration: '60 min' },
      { tier: 'Signature', note: 'Full-body hot stone massage.', price: '$—', duration: '75 min' },
      { tier: 'Luxe', note: 'Full-body hot stone ritual with scalp and foot finish.', price: '$—', duration: '90 min' },
    ],
  },
]

function GenderToggle({ gender, onChange }) {
  return (
    <div className="gender-toggle" role="group" aria-label="Toggle between women's and men's pricing">
      <button
        type="button"
        className={`gender-btn${gender === 'women' ? ' active' : ''}`}
        onClick={() => onChange('women')}
        aria-pressed={gender === 'women'}
      >
        <span className="crown-icon crown-women" aria-hidden="true" />
        Women
      </button>
      <button
        type="button"
        className={`gender-btn${gender === 'men' ? ' active' : ''}`}
        onClick={() => onChange('men')}
        aria-pressed={gender === 'men'}
      >
        <span className="crown-icon crown-men" aria-hidden="true" />
        Men
      </button>
    </div>
  )
}

function TierBadge({ tier }) {
  const info = TIER_INFO.find((t) => t.tier === tier)
  return (
    <span className={`tier-badge tier-${tier.toLowerCase()}`}>
      {info?.crown && <span className="crown-icon crown-luxe" aria-hidden="true" />}
      {tier}
    </span>
  )
}

function ServiceBlock({ service, gender }) {
  return (
    <article className="service-block">
      <div className="service-head">
        <h3>{service.name}</h3>
        <p className="service-summary">{service.summary}</p>
      </div>
      <div className="tier-grid">
        {service.tiers.map((t) => {
          const info = service.unisex ? t : t[gender]
          return (
            <div className="tier-card" key={t.tier}>
              <TierBadge tier={t.tier} />
              <p className="tier-note">{t.note}</p>
              <div className="tier-meta">
                <span>{info.duration}</span>
                <span>{info.price}</span>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}

function Catalogue() {
  const [category, setCategory] = useState('Salon')
  const [gender, setGender] = useState('women')

  const disciplines = useMemo(() => DISCIPLINES[category], [category])

  const servicesByDiscipline = useMemo(() => {
    return disciplines.map((d) => ({
      ...d,
      services: SERVICES.filter((s) => s.discipline === d.key),
    }))
  }, [disciplines])

  return (
    <div className="catalogue">
      <header className="cat-topbar">
        <div className="cat-topbar-inner">
          <div className="cat-brand">
            <SparkIcon className="cat-brand-spark" />
            <span>Aurum Astra</span>
          </div>
          <GenderToggle gender={gender} onChange={setGender} />
        </div>
        <div className="cat-topbar-row2">
          <nav className="cat-tabs" aria-label="Service category">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={category === c ? 'cat-tab active' : 'cat-tab'}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <section className="cat-header">
        <p className="eyebrow">Aurum Astra &middot; Staff Reference</p>
        <h1>Salon &amp; Spa Menu</h1>
        <p className="cat-subhead">
          Internal guide for walking clients through every tier — Essential, Signature, and Luxe.
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

      <main className="cat-main">
        {servicesByDiscipline.map(({ key, name, icon: Icon, services }) => (
          <section className="discipline-section" key={key}>
            <div className="discipline-head">
              <span className="discipline-head-icon">
                <Icon />
              </span>
              <h2>{name}</h2>
            </div>
            <div className="service-list">
              {services.map((service) => (
                <ServiceBlock service={service} gender={gender} key={service.name} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="cat-footer">
        <p>Internal reference only &mdash; not for client distribution.</p>
        <p>&copy; {new Date().getFullYear()} Aurum Astra.</p>
      </footer>
    </div>
  )
}

export default Catalogue
