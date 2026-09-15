import { useEffect, useMemo, useRef, useState } from 'react'
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
  ChevronIcon,
} from '../components/icons.jsx'
import './Catalogue.css'

const CATEGORIES = ['Salon', 'Spa']

/* ---------------------------------- salon data (Women's & Men's — from Onboarding_Salon Services.xlsx) ---------------------------------- */

function svc(name, note, priceOrVariants, opts = {}) {
  if (Array.isArray(priceOrVariants)) {
    return { name, note, variants: priceOrVariants, tiered: !!opts.tiered }
  }
  return { name, note, price: priceOrVariants }
}

const KIDS_GROUP = {
  title: 'Also Available',
  services: [
    svc("Kids' Haircut", 'A patient, gentle first haircut or regular trim for younger guests.', 200),
  ],
}

const SALON_DISCIPLINES = [
  {
    key: 'hair',
    name: 'Hair Atelier',
    shortName: 'Hair Atelier',
    tag: 'Precision Cuts & Styling',
    icon: ScissorsIcon,
    blurb: 'Tailored structural cuts and bespoke styling.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              "Women's Haircut",
              'Blunt, layered, bob, pixie, shag, curtain bangs or a fringe — shaped to your face and hair texture.',
              [
                { label: 'Standard', price: 800 },
                { label: 'Trim', price: 500 },
              ],
            ),
            svc('Gender-Neutral Cut', 'A modern, androgynous cut shaped to suit you, not a category.', 350),
            svc(
              'Hair Wash',
              'A thorough cleanse and conditioning finish, with a wash chosen for your hair type.',
              [
                { label: 'Regular', price: 300 },
                { label: 'Keratin', price: 350 },
                { label: 'Colour Protein', price: 350 },
                { label: 'Oily Hair', price: 400 },
              ],
            ),
            svc('Blow-Dry & Style', 'Rough-dried, smoothed or volumised — your everyday hair, done properly.', 400),
            svc(
              'Iron Curls & Waves',
              'Loose waves, tight curls or beachy movement, set with heat for the occasion.',
              [
                { label: 'Loose Waves / Tight Curls / Beach Waves', price: 1000 },
                { label: 'Perming Curls', price: 1200 },
              ],
            ),
            svc('Hair Straightening (Temporary)', 'A sleek flat-iron finish that lasts until your next wash.', 800),
            svc('Perming', 'Lasting curl and body, from soft waves to defined spirals.', 6000),
          ],
        },
        KIDS_GROUP,
      ],
      men: [
        {
          services: [
            svc("Men's Haircut", 'Classic to contemporary — clippers, scissors or a skin fade, shaped to you.', 250),
            svc('Gender-Neutral Cut', 'A modern, androgynous cut shaped to suit you, not a category.', 350),
            svc('Hair Wash', 'A quick, thorough cleanse before your cut or style.', 100),
            svc('Perming', 'Lasting curl and body, from soft waves to defined spirals.', 3000),
          ],
        },
        KIDS_GROUP,
      ],
    },
  },
  {
    key: 'colour',
    name: 'Colour Alchemy',
    shortName: 'Colour Alchemy',
    tag: 'Global Tones & Dimensional Highlights',
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
                { label: 'Essential', price: 3000 },
                { label: 'Signature', price: 3500 },
                { label: 'Luxe', price: 4000 },
              ],
              { tiered: true },
            ),
            svc(
              'Root Touch-Up',
              'Refreshes regrowth between full colours, matched to your existing shade.',
              [
                { label: 'Essential', price: 1000 },
                { label: 'Signature', price: 1200 },
                { label: 'Luxe (Ammonia-Free)', price: 1550 },
              ],
              { tiered: true },
            ),
            svc(
              'Highlights',
              'Foils, babylights or bolder streaks to lift and lighten through the length.',
              [
                { label: 'Essential', price: 3000 },
                { label: 'Signature', price: 3500 },
                { label: 'Luxe', price: 4000 },
              ],
              { tiered: true },
            ),
            svc('Colour Removal', 'Gently strips previous colour to prepare hair for a fresh result.', 2500),
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
                { label: 'Essential', price: 2000 },
                { label: 'Signature', price: 3500 },
                { label: 'Luxe', price: 4000 },
              ],
              { tiered: true },
            ),
            svc('Grey Coverage', 'Precise grey blending for a natural, low-maintenance finish.', 1000),
            svc('Colour Removal', 'Gently strips previous colour to prepare hair for a fresh result.', 2500),
          ],
        },
      ],
    },
  },
  {
    key: 'hair-spa',
    name: 'Hair Spa Rituals & Treatments',
    shortName: 'Hair Spa',
    tag: 'Restorative Care & Textural Transformation',
    icon: WaveIcon,
    blurb: 'Reparative treatments that rebuild, smooth, and deeply hydrate.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc(
              'Keratin Treatment',
              'Smooths frizz and cuts drying time, priced by hair length.',
              [
                { label: 'Short Hair', price: 5000 },
                { label: 'Medium Hair', price: 6000 },
                { label: 'Long Hair', price: 7000 },
              ],
            ),
            svc(
              'Hair Botox',
              'Deep frizz control and shine without harsh chemicals, priced by hair length.',
              [
                { label: 'Short Hair', price: 5000 },
                { label: 'Medium Hair', price: 6000 },
                { label: 'Long Hair', price: 7000 },
              ],
            ),
            svc(
              'Permanent Straightening (Rebonding)',
              'Lasting poker-straight hair, with root touch-ups available later.',
              [
                { label: 'Short Hair', price: 5500 },
                { label: 'Medium Hair', price: 6500 },
                { label: 'Long Hair', price: 7500 },
              ],
            ),
            svc('Bond-Building Repair Treatment', 'Rebuilds internal bonds in chemically treated or over-processed hair.', 2500),
            svc(
              'Protein Treatment',
              'A reconstructive mask for weak, brittle or over-worked hair.',
              [
                { label: 'Short Hair', price: 4500 },
                { label: 'Medium Hair', price: 5500 },
                { label: 'Long Hair', price: 7000 },
              ],
            ),
            svc(
              'Restorative Hair Spa Rituals',
              'Wash, mask, steam and massage — our most-booked reset for tired hair.',
              [
                { label: 'Essential', price: 900 },
                { label: 'Signature', price: 1600 },
                { label: 'Luxe', price: 2000 },
              ],
              { tiered: true },
            ),
            svc('Champi Oil Head Massage', 'Warm oil and traditional pressure points, from scalp to shoulders.', 400),
          ],
        },
      ],
      men: [
        {
          services: [
            svc(
              'Keratin Treatment',
              'Smooths frizz and cuts drying time, priced by hair length.',
              [
                { label: 'Short Hair', price: 2500 },
                { label: 'Medium Hair', price: 3500 },
                { label: 'Long Hair', price: 4500 },
              ],
            ),
            svc(
              'Hair Botox',
              'Deep frizz control and shine without harsh chemicals, priced by hair length.',
              [
                { label: 'Short Hair', price: 5000 },
                { label: 'Medium Hair', price: 6000 },
                { label: 'Long Hair', price: 7000 },
              ],
            ),
            svc('Bond-Building Repair Treatment', 'Rebuilds internal bonds in chemically treated or over-processed hair.', 2500),
            svc(
              'Protein Treatment',
              'A reconstructive mask for weak, brittle or over-worked hair.',
              [
                { label: 'Short Hair', price: 4500 },
                { label: 'Medium Hair', price: 5500 },
                { label: 'Long Hair', price: 7000 },
              ],
            ),
            svc(
              'Restorative Hair Spa Rituals',
              'Wash, mask, steam and massage — our most-booked reset for tired hair.',
              [
                { label: 'Essential', price: 900 },
                { label: 'Signature', price: 1600 },
                { label: 'Luxe', price: 2000 },
              ],
              { tiered: true },
            ),
            svc('Anti-Hairfall Treatment', 'A scalp-focused course to strengthen roots and reduce shedding.', 1500),
            svc('Champi Oil Head Massage', 'Warm oil and traditional pressure points, from scalp to shoulders.', 400),
          ],
        },
      ],
    },
  },
  {
    key: 'skin',
    name: 'Skincare, Facials & Aesthetics',
    shortName: 'Skin & Facials',
    tag: 'Cellular Renewal & Precision Grooming',
    icon: DropletIcon,
    blurb: 'Targeted skin treatments and a full menu of facial rituals.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc('Face Clean-Up', 'A quick cleanse, exfoliate and extract — ideal between facials.', 600),
            svc(
              'De-Tan Treatment',
              'Lifts sun damage and evens tone, available for face or full body.',
              [
                { label: 'Face', price: 600 },
                { label: 'Neck', price: 400 },
                { label: 'Hands', price: 1000 },
                { label: 'Legs', price: 2500 },
                { label: 'Full Body', price: 4000 },
              ],
            ),
            svc(
              'Bleach',
              'Softens and brightens visible hair for an even, lighter finish.',
              [
                { label: 'Face', price: 600 },
                { label: 'Neck', price: 400 },
                { label: 'Hands', price: 1000 },
              ],
            ),
            svc('Eyebrow Threading', 'Precise, clean brow shaping with cotton thread.', 60),
            svc('Eyebrow Shaping', 'Brows redefined by thread, wax or razor — your preference.', 60),
            svc('Full Face Threading', 'Complete facial hair removal, gentle and precise.', 250),
          ],
        },
        {
          title: 'Facial Rituals',
          services: [
            svc('Essential Facial', 'A refreshing fruit or papaya facial for clean, comfortable skin.', 1200),
            svc(
              'Signature Facial',
              'A premium ritual in gold, pearl, diamond or wine for visible glow.',
              [
                { label: 'Gold / Pearl / Diamond', price: 2000 },
                { label: 'Wine', price: 1800 },
              ],
            ),
            svc('Luxe Facial', 'Our Korean glass-skin ritual for a dewy, poreless finish.', 2500),
            svc('Brightening & Glow Facial', 'Vitamin C led, for an instant lit-from-within look.', 2500),
            svc('Anti-Ageing Facial', 'Collagen and peptide rich, firming and smoothing fine lines.', 2500),
            svc('Acne & Oil-Control Facial', 'Calms breakouts and balances oil on acne-prone skin.', 1800),
            svc('Korean Glass Skin Facial', 'Layered hydration and rice-water actives for that signature glass finish.', 3000),
          ],
        },
      ],
      men: [
        {
          services: [
            svc('Face Clean-Up', 'A quick cleanse, exfoliate and extract — ideal between facials.', 600),
            svc(
              'De-Tan Treatment',
              'Lifts sun damage and evens tone, available for face or full body.',
              [
                { label: 'Face', price: 600 },
                { label: 'Neck', price: 400 },
                { label: 'Hands', price: 1000 },
                { label: 'Legs', price: 2500 },
                { label: 'Full Body', price: 4000 },
              ],
            ),
            svc(
              'Bleach',
              'Softens and brightens visible hair for an even, lighter finish.',
              [
                { label: 'Face', price: 600 },
                { label: 'Neck', price: 400 },
                { label: 'Hands', price: 1000 },
              ],
            ),
            svc('Eyebrow Threading', 'Precise, clean brow shaping with cotton thread.', 60),
            svc('Eyebrow Shaping', 'Brows redefined by thread, wax or razor — your preference.', 60),
            svc('Full Face Threading', 'Complete facial hair removal, gentle and precise.', 250),
          ],
        },
        {
          title: 'Facial Rituals',
          services: [
            svc('Essential Facial', 'A refreshing fruit or papaya facial for clean, comfortable skin.', 1200),
            svc(
              'Signature Facial',
              'A premium ritual in gold, pearl, diamond or wine for visible glow.',
              [
                { label: 'Gold / Pearl / Diamond', price: 2000 },
                { label: 'Wine', price: 1800 },
              ],
            ),
            svc('Luxe Facial', 'Our Korean glass-skin ritual for a dewy, poreless finish.', 2500),
            svc('Brightening & Glow Facial', 'Vitamin C led, for an instant lit-from-within look.', 2500),
            svc('Anti-Ageing Facial', 'Collagen and peptide rich, firming and smoothing fine lines.', 2500),
            svc('Acne & Oil-Control Facial', 'Calms breakouts and balances oil on acne-prone skin.', 1800),
            svc("Men's Facial", 'A deep-cleansing charcoal facial built for oilier, harder-working skin.', 800),
            svc('Korean Glass Skin Facial', 'Layered hydration and rice-water actives for that signature glass finish.', 3000),
          ],
        },
      ],
    },
  },
  {
    key: 'waxing',
    name: 'Precision Epilation & Waxing',
    shortName: 'Waxing',
    tag: 'Smooth Skin Therapies',
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
                { label: 'Full Arms', price: 400 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Rica Wax',
              'Low-irritation Italian wax, kind to sensitive skin.',
              [
                { label: 'Full Arms', price: 600 },
                { label: 'Full Legs', price: 900 },
              ],
            ),
            svc(
              'Chocolate Wax',
              'Rich, moisturising and far gentler on the pull.',
              [
                { label: 'Full Arms', price: 500 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Fruit Wax',
              'A fruit-based formula for softer, calmer skin after waxing.',
              [
                { label: 'Full Arms', price: 500 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Sugar Waxing',
              'A natural sugar paste alternative to traditional wax.',
              [
                { label: 'Full Arms', price: 400 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
          ],
        },
        {
          title: 'Targeted Areas',
          services: [
            svc('Underarms', 'Quick, hygienic underarm waxing.', 200),
            svc('Bikini Line', 'Discreet, careful waxing by a trained therapist.', 2000),
            svc('Brazilian Wax', 'Full intimate waxing in a private room, with total discretion.', 2000),
            svc('Midriff & Stomach', 'Smooth, even hair removal across the midriff.', 500),
            svc('Full Body Waxing', 'Head-to-toe waxing in a single unhurried appointment.', 2500),
            svc('Upper Lip Threading', 'Quick, precise upper-lip tidy-up.', 60),
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
                { label: 'Full Arms', price: 400 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Rica Wax',
              'Low-irritation Italian wax, kind to sensitive skin.',
              [
                { label: 'Full Arms', price: 600 },
                { label: 'Full Legs', price: 900 },
              ],
            ),
            svc(
              'Chocolate Wax',
              'Rich, moisturising and far gentler on the pull.',
              [
                { label: 'Full Arms', price: 500 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Fruit Wax',
              'A fruit-based formula for softer, calmer skin after waxing.',
              [
                { label: 'Full Arms', price: 500 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
            svc(
              'Sugar Waxing',
              'A natural sugar paste alternative to traditional wax.',
              [
                { label: 'Full Arms', price: 400 },
                { label: 'Full Legs', price: 600 },
              ],
            ),
          ],
        },
        {
          title: 'Targeted Areas',
          services: [
            svc('Underarms', 'Quick, hygienic underarm waxing.', 250),
            svc('Chest & Back Waxing', 'Smooth, even hair removal across chest and back.', 1000),
            svc('Arms Waxing', 'Full or half-arm waxing for a clean, smooth finish.', 600),
            svc('Legs Waxing', 'Full or half-leg waxing for a clean, smooth finish.', 900),
            svc('Upper Lip Threading', 'Quick, precise upper-lip tidy-up.', 60),
            svc('Full Body Hair Removal Cream', 'A quick depilatory-cream option for full-body hair removal.', 1500),
          ],
        },
      ],
    },
  },
  {
    key: 'hands-feet',
    name: 'Hand & Foot Care',
    shortName: 'Hands & Feet',
    tag: 'Manicure & Pedicure Rituals',
    icon: GemIcon,
    blurb: 'Immaculate detailing and deep hydration for hands and feet.',
    genders: ['women', 'men'],
    groupsByGender: {
      women: [
        {
          services: [
            svc('Classic Manicure', 'Soak, shape, cuticle work, massage and polish.', 600),
            svc('Spa Manicure', 'Everything in the classic, plus scrub, mask and a longer massage.', 800),
            svc('Gel Manicure', 'High-shine gel colour that stays chip-free for weeks.', 800),
            svc('Classic Pedicure', 'Soak, scrub, nail and cuticle care, massage and polish.', 800),
            svc('Spa Pedicure', 'Our longer foot ritual with scrub, mask and crack-heal care.', 1000),
            svc('Gel Nail Extensions', 'Builder-gel extensions in your chosen length and shape.', 1500),
          ],
        },
      ],
      men: [
        {
          services: [
            svc('Classic Manicure', 'Soak, shape, cuticle work, massage and polish.', 600),
            svc('Spa Manicure', 'Everything in the classic, plus scrub, mask and a longer massage.', 800),
            svc('Gel Manicure', 'High-shine gel colour that stays chip-free for weeks.', 800),
            svc("Men's Manicure", 'A no-shine, grooming-focused manicure finish.', 600),
            svc('Classic Pedicure', 'Soak, scrub, nail and cuticle care, massage and polish.', 800),
            svc('Spa Pedicure', 'Our longer foot ritual with scrub, mask and crack-heal care.', 1000),
            svc('Gel Nail Extensions', 'Builder-gel extensions in your chosen length and shape.', 1500),
          ],
        },
      ],
    },
  },
  {
    key: 'makeup-bridal',
    name: 'Makeup & Bridal',
    shortName: 'Makeup & Bridal',
    tag: 'Occasion Makeup & Bridal Packages',
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
    name: 'Beard & Grooming',
    shortName: 'Beard & Grooming',
    tag: 'Beard Care & Executive Grooming',
    icon: RazorIcon,
    blurb: 'Beard shaping, shaves, and bundled grooming packages.',
    genders: ['men'],
    groupsByGender: {
      men: [
        {
          services: [
            svc('Beard Trim & Shape', 'A clean trim and shape to keep your beard sharp.', 150),
            svc('Beard Styling', 'Custom design and line-up work for a defined, sharp edge.', 200),
            svc('Clean Shave', 'A traditional hot towel shave for a smooth, close finish.', 120),
            svc('Beard Colour', 'Covers grey or deepens tone for a fuller, even beard.', 400),
            svc("Men's De-Tan & Bleach", 'Lifts tan and evens tone for a fresher, brighter look.', 600),
          ],
        },
        {
          title: 'Packages',
          services: [
            svc('Groom-To-Be Package', 'Cut, beard, facial and mani-pedi bundled for the big day.', 'On Request'),
            svc('Executive Grooming Package', 'A recurring grooming plan for regular upkeep.', 'On Request'),
          ],
        },
        {
          title: 'Event Makeup',
          services: [
            svc("Men's Event Makeup", 'Camera- and stage-ready coverage for events and shoots.', 'On Request'),
          ],
        },
      ],
    },
  },
]

const SPA_DISCIPLINES = [
  { key: 'skin', name: 'Skin & Face Rituals', icon: DropletIcon },
  { key: 'body', name: 'Body & Spa Therapies', icon: WaveIcon },
]

const TIER_INFO = [
  { tier: 'Essential', blurb: 'The classic version, done beautifully — quick and reliable.' },
  { tier: 'Signature', blurb: 'Our most-booked upgrade, with an added ritual or finish.' },
  { tier: 'Luxe', blurb: 'The full Aurum Astra experience — extended time, premium products, every detail considered.', crown: true },
]

const SPA_SERVICES = [
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

function GenderToggle({ gender, onChange, compact }) {
  return (
    <div className={`gender-toggle${compact ? ' gender-toggle-compact' : ''}`} role="group" aria-label="Toggle between women's and men's pricing">
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

function SalonService({ service }) {
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
              <SalonService service={service} key={service.name} />
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function DisciplineTabs({ disciplines, activeKey, onSelect }) {
  const scrollRef = useRef(null)
  const hasNudgedRef = useRef(false)
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

    if (!hasNudgedRef.current && el.scrollWidth > el.clientWidth) {
      hasNudgedRef.current = true
      const nudge = requestAnimationFrame(() => {
        el.style.scrollBehavior = 'smooth'
        el.scrollLeft = 56
        setTimeout(() => {
          el.scrollLeft = 0
          setTimeout(() => {
            el.style.scrollBehavior = ''
          }, 400)
        }, 450)
      })
      return () => {
        cancelAnimationFrame(nudge)
        el.removeEventListener('scroll', update)
        window.removeEventListener('resize', update)
      }
    }

    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [disciplines])

  return (
    <div className={`disc-tabs-wrap${scrollState.left ? ' fade-left' : ''}${scrollState.right ? ' fade-right' : ''}`}>
      <nav className="disc-tabs" aria-label="Salon discipline" ref={scrollRef}>
        {disciplines.map((d) => (
          <button
            key={d.key}
            type="button"
            className={activeKey === d.key ? 'disc-tab active' : 'disc-tab'}
            onClick={() => onSelect(d.key)}
          >
            <d.icon />
            {d.shortName}
          </button>
        ))}
      </nav>
      {scrollState.right && (
        <span className="disc-tabs-hint" aria-hidden="true">
          <ChevronIcon />
        </span>
      )}
    </div>
  )
}

function Catalogue() {
  const [category, setCategory] = useState('Salon')
  const [gender, setGender] = useState('women')
  const [salonDiscipline, setSalonDiscipline] = useState(SALON_DISCIPLINES[0].key)
  const mainRef = useRef(null)

  const spaServicesByDiscipline = useMemo(
    () =>
      SPA_DISCIPLINES.map((d) => ({
        ...d,
        services: SPA_SERVICES.filter((s) => s.discipline === d.key),
      })),
    [],
  )

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

  return (
    <div className={category === 'Salon' ? 'catalogue has-bottom-bar' : 'catalogue'}>
      <header className="cat-topbar">
        <div className="cat-topbar-inner">
          <div className="cat-brand">
            <SparkIcon className="cat-brand-spark" />
            <span>Aurum Astra</span>
          </div>
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
        {category === 'Salon' ? (
          <div className="cat-topbar-row2 cat-topbar-row2-salon">
            <GenderToggle gender={gender} onChange={handleGenderChange} compact />
            <DisciplineTabs disciplines={visibleSalonDisciplines} activeKey={salonDiscipline} onSelect={selectSalonDiscipline} />
          </div>
        ) : (
          <div className="cat-topbar-row2 cat-topbar-row2-center">
            <GenderToggle gender={gender} onChange={handleGenderChange} />
          </div>
        )}
      </header>

      {category === 'Salon' && (
        <div className="cat-bottom-bar">
          <GenderToggle gender={gender} onChange={handleGenderChange} />
        </div>
      )}

      <section className="cat-header">
        <h1>Salon &amp; Spa Menu</h1>
        <p className="cat-subhead">
          {category === 'Salon'
            ? `${gender === 'women' ? 'Women’s' : 'Men’s'} pricing, starting rates.`
            : 'Every tier — Essential, Signature, and Luxe.'}
        </p>
      </section>

      {category === 'Spa' && (
        <div className="tier-legend">
          {TIER_INFO.map((t) => (
            <div className="tier-legend-item" key={t.tier}>
              <TierBadge tier={t.tier} />
              <p>{t.blurb}</p>
            </div>
          ))}
        </div>
      )}

      <main className="cat-main" ref={mainRef}>
        {category === 'Salon' ? (
          <SalonDisciplineSection discipline={activeSalonDiscipline} gender={gender} />
        ) : (
          spaServicesByDiscipline.map(({ key, name, icon: Icon, services }) => (
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
          ))
        )}
      </main>

      <footer className="cat-footer">
        <p>
          Reservations: <a href="tel:+919148627266">+91 91486 27266</a>
        </p>
        <p>All Salon prices are starting rates, inclusive of tax &mdash; confirmed post-consultation.</p>
        <p>Internal reference only &mdash; not for client distribution.</p>
        <p>&copy; {new Date().getFullYear()} Aurum Astra.</p>
      </footer>
    </div>
  )
}

export default Catalogue
