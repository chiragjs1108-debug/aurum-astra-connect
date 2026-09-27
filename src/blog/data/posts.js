/*
 * TEMPORARY data source for Phase 1.
 * Later phases replace this file's contents with posts loaded from
 * `content/blog/*.md` (written via the Decap CMS dashboard) — the page
 * components below never need to change when that swap happens, since
 * they only ever import `posts` from here.
 */

const posts = [
  {
    slug: 'hair-spa-101-what-it-is-and-why-your-hair-needs-it',
    title: 'Hair Spa 101: What It Is and Why Your Hair Needs It',
    excerpt:
      'Dryness, frizz, and dull strands are usually a scalp problem in disguise. Here is what a proper hair spa ritual actually fixes — and how often you really need one.',
    coverImage: '/categories/women-hair-spa.jpg',
    date: '2026-09-20',
    tags: ['Hair Care', 'Spa Rituals'],
    metaTitle: 'Hair Spa 101: What It Is and Why Your Hair Needs It | Aurum Astra',
    metaDescription:
      'Everything to know about hair spa treatments — what happens in the chair, who needs one, and how to pick between the four rituals we offer in Hennur, Bengaluru.',
    blocks: [
      {
        type: 'paragraph',
        text:
          "If your hair feels rough by 3pm, colour fades faster than it should, or your scalp itches more than it used to — that's not just \"bad hair,\" it's usually a scalp and moisture problem. A hair spa is the fix most people skip, right up until they try it once.",
      },
      {
        type: 'stats',
        items: [
          { value: '4.9★', label: 'Average rating' },
          { value: '15+', label: 'Years of craft' },
          { value: '10k+', label: 'Rituals booked' },
        ],
      },
      {
        type: 'image',
        src: '/img/hero-bg.webp',
        alt: 'Hair spa treatment station at Aurum Astra',
        caption: 'Every hair spa ritual starts with a diagnostic scalp check — not a guess.',
      },
      {
        type: 'paragraph',
        text:
          'A hair spa is a deeper, four-step version of a normal wash: cleanse, a scalp-targeted mask, steam to open the cuticle, and a massage to actually work the product in. It is not the same as a keratin or a smoothening treatment — those change the hair\'s structure. A hair spa restores what daily heat, hard water, and pollution strip out.',
      },
      {
        type: 'bullet-list',
        heading: 'Signs you are overdue for one',
        items: [
          { title: 'Frizz that returns within hours', description: 'A sign the hair shaft is dehydrated, not just styled wrong.' },
          { title: 'Colour fading faster than expected', description: 'Usually a raised, damaged cuticle letting colour molecules escape.' },
          { title: 'An itchy or flaky scalp', description: 'Product buildup and dryness — not always dandruff.' },
          { title: 'Hair that feels fine but looks flat', description: 'Low shine is a moisture issue a wash-and-go never fixes.' },
        ],
      },
      { type: 'divider' },
      {
        type: 'before-after',
        beforeImage: '/categories/women-hair-treatments.jpg',
        afterImage: '/categories/women-hair-colour.jpg',
        beforeLabel: 'Before',
        afterLabel: 'After',
        caption: 'Drag to compare — a Colour-Protect Spa right after a colour service.',
      },
      {
        type: 'card-grid',
        heading: 'The four rituals we offer',
        items: [
          {
            title: 'Classic Hair Spa',
            description: 'Deep-conditioning mask, steam, and scalp massage — our most-booked ritual.',
            image: '/categories/women-hair-spa.jpg',
          },
          {
            title: 'Anti-Hairfall Spa',
            description: 'Scalp-focused actives that target thinning and shedding at the root.',
            image: '/categories/women-hair-treatments.jpg',
          },
          {
            title: 'Colour-Protect Spa',
            description: 'pH-balanced formula built to lock in colour right after a service.',
            image: '/categories/women-hair-colour.jpg',
          },
          {
            title: "Men's Grooming Spa",
            description: 'The same ritual, recalibrated for shorter styles and daily styling wear.',
            image: '/categories/men-haircut-styling.jpg',
          },
        ],
      },
      {
        type: 'quote',
        text: 'People come in asking for a haircut and leave asking why nobody told them about the spa sooner.',
        attribution: 'Aurum Astra styling team',
      },
      {
        type: 'steps',
        heading: 'How to book one',
        items: [
          { title: 'Message us on WhatsApp', description: 'Tell us your hair concern and we\'ll suggest a ritual.' },
          { title: 'Pick a slot', description: 'Same-day slots are usually available on weekdays.' },
          { title: 'Arrive & relax', description: 'The full ritual takes 45–60 minutes, start to finish.' },
        ],
      },
      {
        type: 'carousel',
        heading: 'What the ritual looks like, step by step',
        items: [
          { title: '1. Diagnostic check', description: 'We look at scalp condition and hair porosity before choosing a formula.', image: '/categories/women-skin-rituals.jpg' },
          { title: '2. Cleanse', description: 'A sulphate-free wash that clears buildup without stripping natural oils.', image: '/img/oil.webp' },
          { title: '3. Mask & steam', description: 'Warm steam opens the cuticle so the mask actually absorbs.', image: '/img/spa-therapy-room-hennur.webp' },
          { title: '4. Scalp massage', description: 'Improves circulation and helps the treatment settle in for longer.', image: '/img/signature-body-massage-in-hennur.webp' },
        ],
      },
      {
        type: 'callout',
        tone: 'tip',
        text: 'Avoid heat styling for 24 hours after a hair spa — the cuticle is still settling and heat undoes some of the moisture work.',
      },
      {
        type: 'video',
        url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
        caption: 'Placeholder embed — swap the URL for a real studio or Reels video.',
      },
      {
        type: 'faq',
        heading: 'Frequently asked questions',
        items: [
          { question: 'How long does a hair spa take?', answer: 'Usually 45–60 minutes depending on hair length and the ritual chosen.' },
          { question: 'Can I get one right after colouring my hair?', answer: 'Yes — the Colour-Protect Spa is specifically formulated for this and is best done within a week of colouring.' },
          { question: 'How often should I book one?', answer: 'Most guests come in every 3 to 4 weeks, more often if you colour or heat-style frequently.' },
        ],
      },
      {
        type: 'paragraph',
        text:
          'How often you need one depends on your hair type and how much heat styling or colour it sees — most guests book every 3 to 4 weeks. If you are not sure where to start, our stylists will recommend a ritual after a quick scalp check, free with any service.',
      },
      {
        type: 'cta',
        heading: 'Ready to feel the difference?',
        actions: [
          { kind: 'whatsapp', label: 'Book on WhatsApp', message: "Hi Aurum Astra, I'd like to book a hair spa treatment." },
          { kind: 'call', label: 'Call the Studio' },
        ],
      },
    ],
  },
  {
    slug: 'pre-wedding-skin-prep-8-week-countdown',
    title: 'Pre-Wedding Skin Prep: The 8-Week Countdown',
    excerpt:
      'Bridal skin glow is built, not rushed. Here is the week-by-week ritual schedule our estheticians actually recommend before the big day.',
    coverImage: '/categories/women-skin-rituals.jpg',
    date: '2026-09-10',
    tags: ['Skin Rituals', 'Bridal'],
    metaTitle: 'Pre-Wedding Skin Prep: The 8-Week Countdown | Aurum Astra',
    metaDescription:
      'A week-by-week facial and skin ritual schedule to start 8 weeks before your wedding, from Aurum Astra\'s estheticians in Hennur, Bengaluru.',
    blocks: [
      {
        type: 'paragraph',
        text:
          "Bridal skin that photographs well isn't a last-minute facial — it's eight weeks of the right treatments, spaced correctly so nothing is still purging or peeling on the day. Here's the schedule we actually give our bridal clients.",
      },
      {
        type: 'steps',
        heading: 'The 8-week schedule',
        items: [
          { title: 'Weeks 8–6: Deep-clean facial', description: 'A clarifying facial to clear buildup and get a baseline read on your skin.' },
          { title: 'Weeks 6–4: Targeted treatment', description: 'Brightening or hydration facials, tailored to what week 8 revealed.' },
          { title: 'Weeks 4–2: Glow maintenance', description: 'Lighter, more frequent facials — no aggressive treatments this close to the date.' },
          { title: 'Final week: Hydration only', description: 'A gentle hydrating facial, nothing new, nothing that can cause a reaction.' },
        ],
      },
      {
        type: 'callout',
        tone: 'warning',
        text: 'Never try a new treatment (peel, laser, strong actives) in the final two weeks — reactions need time to settle that you won\'t have.',
      },
      {
        type: 'bullet-list',
        heading: 'What we check at the first visit',
        items: [
          { title: 'Skin type & sensitivity', description: 'Decides which actives are safe to use in your timeline.' },
          { title: 'Current routine', description: 'We build around what is already working, not against it.' },
          { title: 'Event date', description: 'Everything is scheduled backward from this.' },
        ],
      },
      {
        type: 'cta',
        heading: 'Start your countdown today',
        actions: [
          { kind: 'whatsapp', label: 'Enquire About Bridal Packages', message: "Hi Aurum Astra, I'd like to know more about your bridal skin packages." },
          { kind: 'call', label: 'Call the Studio' },
        ],
      },
    ],
  },
]

export default posts
