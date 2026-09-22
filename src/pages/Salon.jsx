import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  SparkIcon,
  ScissorsIcon,
  DropletIcon,
  WaveIcon,
  GemIcon,
  FlowerIcon,
  BrushIcon,
  LipstickIcon,
  RazorIcon,
  GiftIcon,
  ChevronIcon,
  ChatIcon,
} from '../components/icons.jsx'
import './Salon.css'

const WHATSAPP_NUMBER = '919148627266'
const PHONE_HREF = 'tel:+919148627266'

function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

/* ---------------------------------- salon data (Women's & Men's — from Onboarding_Salon & Spa Services_Final.xlsx) ---------------------------------- */

function svc(name, note, priceOrVariants, opts = {}) {
  if (Array.isArray(priceOrVariants)) {
    return { name, note, variants: priceOrVariants, tiered: !!opts.tiered }
  }
  return { name, note, price: priceOrVariants }
}

const KIDS_GROUP = {
  title: 'Also Available',
  services: [
    svc("Kids' Haircut", 'A patient, gentle first haircut or regular trim for younger guests.', 199),
  ],
}

const SALON_DISCIPLINES = [
  {
    key: 'hair',
    imageKey: 'haircut-styling',
    name: 'Haircut & Styling',
    shortName: 'Haircut & Styling',
    icon: ScissorsIcon,
    blurb: 'Tailored structural cuts and bespoke styling.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              'Haircut',
              'Blunt, layered, bob, pixie, shag, curtain bangs or a fringe — shaped to your face and hair texture.',
              [
                { label: 'Standard', price: 799 },
                { label: 'Trim', price: 499 },
              ],
            ),
            svc('Gender-Neutral Cut', 'A modern, androgynous cut shaped to suit you, not a category.', 349),
            svc(
              'Hair Wash',
              'A thorough cleanse and conditioning finish, with a wash chosen for your hair type.',
              [
                { label: 'Regular', price: 299 },
                { label: 'Keratin', price: 349 },
                { label: 'Colour Protein', price: 349 },
                { label: 'Oily Hair', price: 399 },
              ],
            ),
            svc('Blow-Dry & Style', 'Rough-dried, smoothed or volumised — your everyday hair, done properly.', 399),
            svc(
              'Iron Curls & Waves',
              'Loose waves, tight curls or beachy movement, set with heat for the occasion.',
              [
                { label: 'Loose Waves / Tight Curls / Beach Waves', price: 999 },
                { label: 'Perming Curls', price: 1199 },
              ],
            ),
            svc('Hair Straightening (Temporary)', 'A sleek flat-iron finish that lasts until your next wash.', 799),
            svc('Perming', 'Lasting curl and body, from soft waves to defined spirals.', 5999),
          ],
        },
        KIDS_GROUP,
      ],
      men: [
        {
          services: [
            svc('Haircut', 'Classic to contemporary — clippers, scissors or a skin fade, shaped to you.', 249),
            svc('Gender-Neutral Cut', 'A modern, androgynous cut shaped to suit you, not a category.', 349),
            svc('Hair Wash', 'A quick, thorough cleanse before your cut or style.', 99),
            svc('Perming', 'Lasting curl and body, from soft waves to defined spirals.', 2999),
          ],
        },
        KIDS_GROUP,
      ],
    },
  },
  {
    key: 'colour',
    imageKey: 'hair-colour',
    name: 'Hair Colour',
    shortName: 'Hair Colour',
    icon: BrushIcon,
    blurb: 'Global colour, root touch-ups, and dimensional highlights.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              'Global Hair Colour',
              'Full-head colour in your chosen shade, with ammonia-free options available.',
              [
                { label: 'Essential', price: 2999 },
                { label: 'Signature', price: 3499 },
                { label: 'Luxe', price: 3999 },
              ],
              { tiered: true },
            ),
            svc(
              'Root Touch-Up',
              'Refreshes regrowth between full colours, matched to your existing shade.',
              [
                { label: 'Essential', price: 999 },
                { label: 'Signature', price: 1199 },
                { label: 'Luxe', price: 1499 },
                { label: 'Luxe (Ammonia-Free)', price: 1549 },
              ],
              { tiered: true },
            ),
            svc(
              'Highlights',
              'Foils, babylights or bolder streaks to lift and lighten through the length.',
              [
                { label: 'Essential', price: 2999 },
                { label: 'Signature', price: 3499 },
                { label: 'Luxe', price: 3999 },
              ],
              { tiered: true },
            ),
            svc('Colour Removal', 'Gently strips previous colour to prepare hair for a fresh result.', 2499),
          ],
        },
      ],
      men: [
        {
          services: [
            svc(
              'Global Hair Colour',
              'Full-head colour in your chosen shade, from classic to bold.',
              [
                { label: 'Essential', price: 1999 },
                { label: 'Signature', price: 3499 },
                { label: 'Luxe', price: 3999 },
              ],
              { tiered: true },
            ),
            svc('Grey Coverage', 'Precise grey blending for a natural, low-maintenance finish.', 999),
            svc('Colour Removal', 'Gently strips previous colour to prepare hair for a fresh result.', 2499),
          ],
        },
      ],
    },
  },
  {
    key: 'hair-treatments',
    imageKey: 'hair-treatments',
    name: 'Hair Treatments',
    shortName: 'Hair Treatments',
    icon: WaveIcon,
    blurb: 'Reparative treatments that rebuild, smooth, and transform texture.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              'Keratin Treatment',
              'Smooths frizz and cuts drying time, in your choice of tier.',
              [
                { label: 'Essential', price: 4999 },
                { label: 'Signature', price: 5999 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
            svc(
              'Hair Smoothening',
              'A frizz-smoothing treatment for softer, more manageable hair day to day.',
              [
                { label: 'Essential', price: 4999 },
                { label: 'Signature', price: 5999 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
            svc(
              'Hair Botox',
              'Deep frizz control and shine without harsh chemicals.',
              [
                { label: 'Essential', price: 4999 },
                { label: 'Signature', price: 5999 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
            svc(
              'Permanent Straightening (Rebonding)',
              'Lasting poker-straight hair, with root touch-ups available later.',
              [
                { label: 'Essential', price: 5499 },
                { label: 'Signature', price: 6499 },
                { label: 'Luxe', price: 7499 },
              ],
              { tiered: true },
            ),
            svc('Bond-Building Repair Treatment', 'Rebuilds internal bonds in chemically treated or over-processed hair.', 2499),
            svc(
              'Protein Treatment',
              'A reconstructive mask for weak, brittle or over-worked hair.',
              [
                { label: 'Essential', price: 4499 },
                { label: 'Signature', price: 5499 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
          ],
        },
      ],
      men: [
        {
          services: [
            svc(
              'Keratin Treatment',
              'Smooths frizz and cuts drying time, in your choice of tier.',
              [
                { label: 'Essential', price: 2499 },
                { label: 'Signature', price: 3499 },
                { label: 'Luxe', price: 4499 },
              ],
              { tiered: true },
            ),
            svc(
              'Hair Botox',
              'Deep frizz control and shine without harsh chemicals.',
              [
                { label: 'Essential', price: 4999 },
                { label: 'Signature', price: 5999 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
            svc('Bond-Building Repair Treatment', 'Rebuilds internal bonds in chemically treated or over-processed hair.', 2499),
            svc(
              'Protein Treatment',
              'A reconstructive mask for weak, brittle or over-worked hair.',
              [
                { label: 'Essential', price: 4499 },
                { label: 'Signature', price: 5499 },
                { label: 'Luxe', price: 6999 },
              ],
              { tiered: true },
            ),
          ],
        },
      ],
    },
  },
  {
    key: 'hair-spa',
    imageKey: 'hair-spa',
    name: 'Hair Spa',
    shortName: 'Hair Spa',
    icon: DropletIcon,
    blurb: 'Restorative wash, mask, steam and scalp massage rituals.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              'Hair Spa',
              'Wash, mask, steam and massage — our most-booked reset for tired hair.',
              [
                { label: 'Essential', price: 899 },
                { label: 'Signature', price: 1599 },
                { label: 'Luxe', price: 1999 },
              ],
              { tiered: true },
            ),
            svc('Champi Oil Head Massage', 'Warm oil and traditional pressure points, from scalp to shoulders.', 399),
          ],
        },
      ],
      men: [
        {
          services: [
            svc(
              'Hair Spa',
              'Wash, mask, steam and massage — our most-booked reset for tired hair.',
              [
                { label: 'Essential', price: 899 },
                { label: 'Signature', price: 1599 },
                { label: 'Luxe', price: 1999 },
              ],
              { tiered: true },
            ),
            svc('Anti-Hairfall Treatment', 'A scalp-focused course to strengthen roots and reduce shedding.', 1499),
            svc('Champi Oil Head Massage', 'Warm oil and traditional pressure points, from scalp to shoulders.', 399),
          ],
        },
      ],
    },
  },
  {
    key: 'skin',
    imageKey: 'skin-rituals',
    name: 'Skin Rituals',
    shortName: 'Skin Rituals',
    icon: GiftIcon,
    blurb: 'Targeted skin treatments and a full menu of facial rituals.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc('Face Clean-Up', 'A quick cleanse, exfoliate and extract — ideal between facials.', 599),
            svc(
              'De-Tan',
              'Lifts sun damage and evens tone, available for face or full body.',
              [
                { label: 'Face', price: 599 },
                { label: 'Neck', price: 399 },
                { label: 'Hands', price: 999 },
                { label: 'Legs', price: 2499 },
                { label: 'Full Body', price: 3999 },
              ],
            ),
            svc(
              'Bleach',
              'Softens and brightens visible hair for an even, lighter finish.',
              [
                { label: 'Face', price: 599 },
                { label: 'Neck', price: 399 },
                { label: 'Hands', price: 999 },
              ],
            ),
            svc('Eyebrow Threading', 'Precise, clean brow shaping with cotton thread.', 59),
            svc('Eyebrow Shaping', 'Brows redefined by thread, wax or razor — your preference.', 59),
            svc('Full Face Threading', 'Complete facial hair removal, gentle and precise.', 249),
          ],
        },
        {
          title: 'Facial Rituals',
          services: [
            svc('Essential Facial', 'A refreshing fruit or papaya facial for clean, comfortable skin.', 1199),
            svc(
              'Signature Facial',
              'A premium ritual in gold, pearl, diamond or wine for visible glow.',
              [
                { label: 'Gold / Pearl / Diamond', price: 1999 },
                { label: 'Wine', price: 1799 },
              ],
            ),
            svc('Luxe Korean Glass-Skin Facial', 'Our Korean glass-skin ritual for a dewy, poreless finish.', 2499),
            svc('Brightening & Glow Facial', 'Vitamin C led, for an instant lit-from-within look.', 2499),
            svc('Anti-Ageing Facial', 'Collagen and peptide rich, firming and smoothing fine lines.', 2499),
            svc('Acne & Oil-Control Facial', 'Calms breakouts and balances oil on acne-prone skin.', 1799),
            svc('Korean Glass Skin Facial', 'Layered hydration and rice-water actives for that signature glass finish.', 2999),
          ],
        },
      ],
      men: [
        {
          services: [
            svc('Face Clean-Up', 'A quick cleanse, exfoliate and extract — ideal between facials.', 599),
            svc(
              'De-Tan Treatment',
              'Lifts sun damage and evens tone, available for face or full body.',
              [
                { label: 'Face', price: 599 },
                { label: 'Neck', price: 399 },
                { label: 'Hands', price: 999 },
                { label: 'Legs', price: 2499 },
                { label: 'Full Body', price: 3999 },
              ],
            ),
            svc(
              'Bleach',
              'Softens and brightens visible hair for an even, lighter finish.',
              [
                { label: 'Face', price: 599 },
                { label: 'Neck', price: 399 },
                { label: 'Hands', price: 999 },
              ],
            ),
            svc('Eyebrow Threading', 'Precise, clean brow shaping with cotton thread.', 59),
            svc('Eyebrow Shaping', 'Brows redefined by thread, wax or razor — your preference.', 59),
            svc('Full Face Threading', 'Complete facial hair removal, gentle and precise.', 249),
          ],
        },
        {
          title: 'Facial Rituals',
          services: [
            svc('Essential Facial', 'A refreshing fruit or papaya facial for clean, comfortable skin.', 1199),
            svc(
              'Signature Facial',
              'A premium ritual in gold, pearl, diamond or wine for visible glow.',
              [
                { label: 'Gold / Pearl / Diamond', price: 1999 },
                { label: 'Wine', price: 1799 },
              ],
            ),
            svc('Luxe Facial', 'Our Korean glass-skin ritual for a dewy, poreless finish.', 2499),
            svc('Brightening & Glow Facial', 'Vitamin C led, for an instant lit-from-within look.', 2499),
            svc('Anti-Ageing Facial', 'Collagen and peptide rich, firming and smoothing fine lines.', 2499),
            svc('Acne & Oil-Control Facial', 'Calms breakouts and balances oil on acne-prone skin.', 1799),
            svc('Charcoal Deep-Cleanse Facial', 'A deep-cleansing charcoal facial built for oilier, harder-working skin.', 799),
            svc('Korean Glass Skin Facial', 'Layered hydration and rice-water actives for that signature glass finish.', 2999),
          ],
        },
      ],
    },
  },
  {
    key: 'hair-removal',
    imageKey: 'hair-removal',
    name: 'Hair Removal',
    shortName: 'Hair Removal',
    icon: FlowerIcon,
    blurb: 'Gentle, effective hair removal with a choice of premium formulations.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          title: 'Wax Types — Arms & Legs',
          services: [
            svc(
              'Honey Wax',
              'Our classic warm wax — dependable and economical.',
              [
                { label: 'Full Arms', price: 399 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Rica Wax',
              'Low-irritation Italian wax, kind to sensitive skin.',
              [
                { label: 'Full Arms', price: 599 },
                { label: 'Full Legs', price: 899 },
              ],
            ),
            svc(
              'Chocolate Wax',
              'Rich, moisturising and far gentler on the pull.',
              [
                { label: 'Full Arms', price: 499 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Fruit Wax',
              'A fruit-based formula for softer, calmer skin after waxing.',
              [
                { label: 'Full Arms', price: 499 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Sugar Waxing',
              'A natural sugar paste alternative to traditional wax.',
              [
                { label: 'Full Arms', price: 399 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
          ],
        },
        {
          title: 'Targeted Areas',
          services: [
            svc('Underarms', 'Quick, hygienic underarm waxing.', 199),
            svc('Bikini Line', 'Discreet, careful waxing by a trained therapist.', 1999),
            svc('Brazilian Wax', 'Full intimate waxing in a private room, with total discretion.', 1999),
            svc('Midriff & Stomach', 'Smooth, even hair removal across the midriff.', 499),
            svc('Full Body Waxing', 'Head-to-toe waxing in a single unhurried appointment.', 2499),
            svc('Upper Lip Threading', 'Quick, precise upper-lip tidy-up.', 59),
          ],
        },
      ],
      men: [
        {
          title: 'Wax Types — Arms & Legs',
          services: [
            svc(
              'Honey Wax',
              'Our classic warm wax — dependable and economical.',
              [
                { label: 'Full Arms', price: 399 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Rica Wax',
              'Low-irritation Italian wax, kind to sensitive skin.',
              [
                { label: 'Full Arms', price: 599 },
                { label: 'Full Legs', price: 899 },
              ],
            ),
            svc(
              'Chocolate Wax',
              'Rich, moisturising and far gentler on the pull.',
              [
                { label: 'Full Arms', price: 499 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Fruit Wax',
              'A fruit-based formula for softer, calmer skin after waxing.',
              [
                { label: 'Full Arms', price: 499 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
            svc(
              'Sugar Waxing',
              'A natural sugar paste alternative to traditional wax.',
              [
                { label: 'Full Arms', price: 399 },
                { label: 'Full Legs', price: 599 },
              ],
            ),
          ],
        },
        {
          title: 'Targeted Areas',
          services: [
            svc('Underarms', 'Quick, hygienic underarm waxing.', 249),
            svc('Chest & Back Waxing', 'Smooth, even hair removal across chest and back.', 999),
            svc('Arms Waxing', 'Full or half-arm waxing for a clean, smooth finish.', 599),
            svc('Legs Waxing', 'Full or half-leg waxing for a clean, smooth finish.', 899),
            svc('Upper Lip Threading', 'Quick, precise upper-lip tidy-up.', 59),
            svc('Full Body Hair Removal Cream', 'A quick depilatory-cream option for full-body hair removal.', 1499),
          ],
        },
      ],
    },
  },
  {
    key: 'hands-feet',
    imageKey: 'hands-feet',
    name: 'Hands & Feet',
    shortName: 'Hands & Feet',
    icon: GemIcon,
    blurb: 'Immaculate detailing and deep hydration for hands and feet.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc('Classic Manicure', 'Soak, shape, cuticle work, massage and polish.', 599),
            svc('Spa Manicure', 'Everything in the classic, plus scrub, mask and a longer massage.', 799),
            svc('Gel Manicure', 'High-shine gel colour that stays chip-free for weeks.', 799),
            svc('Classic Pedicure', 'Soak, scrub, nail and cuticle care, massage and polish.', 799),
            svc('Spa Pedicure', 'Our longer foot ritual with scrub, mask and crack-heal care.', 999),
            svc('Gel Nail Extensions', 'Builder-gel extensions in your chosen length and shape.', 1499),
          ],
        },
      ],
      men: [
        {
          services: [
            svc('Classic Manicure', 'Soak, shape, cuticle work, massage and polish.', 599),
            svc('Spa Manicure', 'Everything in the classic, plus scrub, mask and a longer massage.', 799),
            svc('Gel Manicure', 'High-shine gel colour that stays chip-free for weeks.', 799),
            svc('Grooming Manicure', 'A no-shine, grooming-focused manicure finish.', 599),
            svc('Classic Pedicure', 'Soak, scrub, nail and cuticle care, massage and polish.', 799),
            svc('Spa Pedicure', 'Our longer foot ritual with scrub, mask and crack-heal care.', 999),
            svc('Gel Nail Extensions', 'Builder-gel extensions in your chosen length and shape.', 1499),
          ],
        },
      ],
    },
  },
  {
    key: 'makeup-bridal',
    imageKey: 'makeup-bridal',
    name: 'Makeup & Bridal',
    shortName: 'Makeup & Bridal',
    icon: LipstickIcon,
    blurb: 'Makeup and bridal packages, priced on request after consultation.',
    genders: ['women'],
    groupsByGender: {
      women: [
        {
          services: [
            svc('Day Makeup', 'Soft, natural makeup for daytime events and functions.', 'On Request'),
            svc('Party Makeup', 'Classic glam, HD or airbrush finish for evenings and celebrations.', 'On Request'),
            svc('Bridal Hairstyling & Updo', 'Buns, braids or editorial styling to complete the bridal look.', 'On Request'),
            svc('Pre-Bridal Package', 'A multi-session plan across skin, hair and nails ahead of the big day.', 'On Request'),
            svc('Premium Pre-Bridal Package', 'An elevated pre-bridal plan with facials, body polish and hair spa.', 'On Request'),
            svc('Full Wedding Package', 'Coverage across engagement, wedding and reception — start to finish.', 'On Request'),
          ],
        },
      ],
    },
  },
  {
    key: 'beard-grooming',
    imageKey: 'beard-grooming',
    name: 'Beard & Grooming',
    shortName: 'Beard & Grooming',
    icon: RazorIcon,
    blurb: 'Beard shaping, shaves, and bundled grooming packages.',
    genders: ['men'],
    groupsByGender: {
      men: [
        {
          services: [
            svc('Beard Trim & Shape', 'A clean trim and shape to keep your beard sharp.', 149),
            svc('Beard Styling', 'Custom design and line-up work for a defined, sharp edge.', 199),
            svc('Clean Shave', 'A traditional hot towel shave for a smooth, close finish.', 119),
            svc('Beard Colour', 'Covers grey or deepens tone for a fuller, even beard.', 399),
            svc('De-Tan & Bleach', 'Lifts tan and evens tone for a fresher, brighter look.', 599),
          ],
        },
        {
          title: 'Packages',
          services: [
            svc('Groom-To-Be Package', 'Cut, beard, facial and mani-pedi bundled for the big day.', 'On Request'),
            svc('Executive Grooming Package', 'A recurring grooming plan for regular upkeep.', 'On Request'),
          ],
        },
      ],
    },
  },
  {
    key: 'makeup',
    imageKey: 'makeup',
    name: 'Makeup',
    shortName: 'Makeup',
    icon: LipstickIcon,
    blurb: 'Camera- and stage-ready makeup for events and shoots.',
    genders: ['men'],
    groupsByGender: {
      men: [
        {
          services: [
            svc('Event Makeup', 'Camera- and stage-ready coverage for events and shoots.', 'On Request'),
          ],
        },
      ],
    },
  },
]

const TIER_INFO = [
  { tier: 'Essential', blurb: 'The classic version, done beautifully — quick and reliable.' },
  { tier: 'Signature', blurb: 'Our most-booked upgrade, with an added ritual or finish.' },
  { tier: 'Luxe', blurb: 'The full Aurum Astra experience — extended time, premium products, every detail considered.', crown: true },
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
    <span className={`tier-badge tier-${tier.toLowerCase().split(' ')[0]}`}>
      {info?.crown && <span className="crown-icon crown-luxe" aria-hidden="true" />}
      {tier}
    </span>
  )
}

function formatPrice(price) {
  if (typeof price === 'number') return `from ₹${price.toLocaleString('en-IN')}`
  return price
}

function bookingMessage(service, gender) {
  const genderLabel = gender === 'women' ? "Women's" : "Men's"
  if (service.variants) {
    return `Hi Aurum Astra, I'd like to book ${service.name} (${genderLabel}). Could you share the available options?`
  }
  return `Hi Aurum Astra, I'd like to book ${service.name} (${genderLabel}) — ${formatPrice(service.price)}.`
}

function SalonService({ service, gender }) {
  return (
    <div className="salon-service">
      <h4 className="salon-service-name">{service.name}</h4>
      {service.note && <p className="salon-service-note">{service.note}</p>}
      {service.variants ? (
        <div className="salon-variant-row">
          {service.variants.map((v) => (
            <div className="salon-variant" key={v.label}>
              {service.tiered ? <TierBadge tier={v.label} /> : <span className="salon-variant-label">{v.label}</span>}
              <span className="salon-variant-price">{formatPrice(v.price)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="salon-service-price">{formatPrice(service.price)}</div>
      )}
      <a
        className="salon-service-book"
        href={buildWhatsAppLink(bookingMessage(service, gender))}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book on WhatsApp
        <ChevronIcon className="salon-service-book-chevron" />
      </a>
    </div>
  )
}

function SalonDisciplineSection({ discipline, gender }) {
  const groups = discipline.groupsByGender[gender] ?? []
  return (
    <section className="discipline-section">
      <div className="discipline-head">
        <span className="discipline-head-icon">
          <discipline.icon />
        </span>
        <div>
          <h2>{discipline.name}</h2>
          <p className="discipline-blurb">{discipline.blurb}</p>
        </div>
      </div>
      {groups.map((group, i) => (
        <div className="salon-group" key={group.title ?? i}>
          {group.title && <h3 className="salon-group-title">{group.title}</h3>}
          <div className="salon-service-grid">
            {group.services.map((service) => (
              <SalonService service={service} gender={gender} key={service.name} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function DisciplineCard({ discipline, gender, active, onSelect }) {
  const [imgOk, setImgOk] = useState(true)
  const Icon = discipline.icon
  return (
    <button
      type="button"
      className={`disc-card${active ? ' active' : ''}`}
      onClick={() => onSelect(discipline.key)}
      aria-pressed={active}
    >
      <span className="disc-card-media">
        {imgOk ? (
          <img
            src={`/categories/${gender}-${discipline.imageKey}.jpg`}
            alt=""
            className="disc-card-img"
            loading="lazy"
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="disc-card-fallback">
            <Icon />
          </span>
        )}
        <span className="disc-card-scrim" />
      </span>
      <span className="disc-card-name">{discipline.shortName}</span>
    </button>
  )
}

function DisciplineCarousel({ disciplines, gender, activeKey, onSelect, stickyTop, wrapRef }) {
  const scrollRef = useRef(null)
  const [scrollState, setScrollState] = useState({ left: false, right: false })

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    el.scrollLeft = 0

    function update() {
      const { scrollLeft, scrollWidth, clientWidth } = el
      setScrollState({
        left: scrollLeft > 4,
        right: scrollLeft + clientWidth < scrollWidth - 4,
      })
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [disciplines])

  return (
    <div className="disc-carousel-sticky" style={{ top: stickyTop }} ref={wrapRef}>
      <div className={`disc-carousel-wrap${scrollState.left ? ' fade-left' : ''}${scrollState.right ? ' fade-right' : ''}`}>
        <div className="disc-carousel" ref={scrollRef}>
          {disciplines.map((d) => (
            <DisciplineCard discipline={d} gender={gender} active={activeKey === d.key} onSelect={onSelect} key={d.key} />
          ))}
        </div>
        {scrollState.right && (
          <span className="disc-carousel-hint" aria-hidden="true">
            <ChevronIcon />
          </span>
        )}
      </div>
    </div>
  )
}

function Salon() {
  const [searchParams] = useSearchParams()
  const [gender, setGender] = useState(() => (searchParams.get('gender') === 'men' ? 'men' : 'women'))
  const [salonDiscipline, setSalonDiscipline] = useState(() => {
    const requested = searchParams.get('discipline')
    const initialGender = searchParams.get('gender') === 'men' ? 'men' : 'women'
    const match = SALON_DISCIPLINES.find((d) => d.key === requested && d.genders.includes(initialGender))
    return match ? match.key : SALON_DISCIPLINES[0].key
  })
  const mainRef = useRef(null)
  const topbarRef = useRef(null)
  const carouselRef = useRef(null)
  const [stickyOffset, setStickyOffset] = useState({ topbar: 0, carousel: 0 })

  useEffect(() => {
    function measure() {
      setStickyOffset({
        topbar: topbarRef.current?.getBoundingClientRect().height ?? 0,
        carousel: carouselRef.current?.getBoundingClientRect().height ?? 0,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (topbarRef.current) ro.observe(topbarRef.current)
    if (carouselRef.current) ro.observe(carouselRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const visibleSalonDisciplines = useMemo(
    () => SALON_DISCIPLINES.filter((d) => d.genders.includes(gender)),
    [gender],
  )

  const activeSalonDiscipline = useMemo(
    () => visibleSalonDisciplines.find((d) => d.key === salonDiscipline) ?? visibleSalonDisciplines[0],
    [salonDiscipline, visibleSalonDisciplines],
  )

  function selectSalonDiscipline(key) {
    setSalonDiscipline(key)
    mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleGenderChange(next) {
    setGender(next)
    setSalonDiscipline((current) => {
      const stillValid = SALON_DISCIPLINES.some((d) => d.key === current && d.genders.includes(next))
      if (stillValid) return current
      return SALON_DISCIPLINES.find((d) => d.genders.includes(next))?.key ?? current
    })
  }

  const stickyTotal = stickyOffset.topbar + stickyOffset.carousel

  return (
    <div className="catalogue">
      <header className="cat-topbar" ref={topbarRef}>
        <div className="cat-topbar-inner">
          <div className="cat-brand">
            <SparkIcon className="cat-brand-spark" />
            <span>Aurum Astra</span>
          </div>
          <nav className="cat-tabs" aria-label="Service category">
            <span className="cat-tab active">Salon</span>
            <Link to="/spa" className="cat-tab">
              Spa
            </Link>
          </nav>
        </div>
        <div className="cat-topbar-row2 cat-topbar-row2-center">
          <GenderToggle gender={gender} onChange={handleGenderChange} />
        </div>
      </header>

      <section className="cat-header">
        <h1>Salon Menu</h1>
        <p className="cat-subhead">{gender === 'women' ? 'Women’s' : 'Men’s'} pricing, starting rates.</p>
      </section>

      <DisciplineCarousel
        disciplines={visibleSalonDisciplines}
        gender={gender}
        activeKey={salonDiscipline}
        onSelect={selectSalonDiscipline}
        stickyTop={stickyOffset.topbar}
        wrapRef={carouselRef}
      />

      <main className="cat-main" ref={mainRef} style={{ scrollMarginTop: stickyTotal }}>
        <SalonDisciplineSection discipline={activeSalonDiscipline} gender={gender} />
      </main>

      <footer className="cat-footer">
        <p>
          Reservations: <a href={PHONE_HREF}>+91 91486 27266</a>
        </p>
        <p>All Salon prices are starting rates, inclusive of tax &mdash; confirmed post-consultation.</p>
        <p>&copy; {new Date().getFullYear()} Aurum Astra.</p>
      </footer>

      <a
        className="salon-fab"
        href={buildWhatsAppLink(`Hi Aurum Astra, I'd like to book a ${gender === 'women' ? "Women's" : "Men's"} Salon appointment.`)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Book on WhatsApp"
      >
        <ChatIcon />
      </a>
    </div>
  )
}

export default Salon
