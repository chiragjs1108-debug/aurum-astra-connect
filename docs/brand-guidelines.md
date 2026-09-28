# Aurum Astra Brand Guidelines (for content generation)

Distilled from `docs/brand/AURUM_ASTRA_Brand_Guidelines.pdf` (the full
deck, prepared by Photon Media) plus one requirement given directly by the
business owner that isn't in the deck. Read by
`.claude/skills/blog-content-pipeline/SKILL.md` before generating any
image — this is the single place that fixed style suffix comes from, so
updating the brand means updating it here, not in the skill itself.

The same brand, in two other forms: `docs/design-tokens.json` is the
machine-readable version of everything below (colors in both themes, full
type scale, spacing, radius) for any tool or future session that needs to
consume it programmatically rather than read prose. The
[Aurum Astra Design System](https://claude.ai/artifact/VGLGfHYLtAS2eetBtz3cDN)
artifact is the same system as a browsable page, with a cover showing the
brand's own mark. Keep all three in sync if the brand changes.

## Colors

| Hex | Role |
|---|---|
| `#3f1113` | Deep maroon/burgundy — primary brand color |
| `#ac7f3f` | Bronze/gold |
| `#f0c382` | Light gold / champagne |
| `#ba8c50` | Mid gold |
| `#ffffff` | White |

## Typography

Circe Contrast (headings), Inter (body). Not directly relevant to image
prompts, but informs the mood: elegant, refined, timeless, high-contrast,
premium — not playful or casual.

## Brand identity

"Aurum Astra is a premium unisex salon and luxury spa dedicated to
delivering exceptional beauty, grooming, and wellness experiences... refined
services, personalised care, and a luxurious environment." Mood words from
the deck: luxury, radiance, transformation, elegant, refined, sophisticated,
timeless, confidence, premium.

## Verified against real site photography

Checked directly against actual photos already in `public/img/` (the same
files the live site serves) rather than assumed from the deck alone:
maroon-and-gold interiors with warm candlelight (`spa-therapy-room-hennur.webp`,
`spa-entrance-hennur.webp`), marble and dark wood surfaces, lotus-motif
decorative touches. Where a person appears (`couple-massage-in-hennur.webp`),
they are Indian.

## The fixed style suffix

Append this to every image-generation prompt, on top of the slot's own
subject:

> Photographed in the style of Aurum Astra, a premium unisex salon and
> luxury spa in Bengaluru, India: warm, elegant, and timeless — deep
> maroon and burgundy tones, warm gold and champagne accents, soft ambient
> candlelight, marble and dark wood surfaces. Editorial photography,
> shallow depth of field, no text or logos in the image.

**Whenever a person appears in the image, add this — not optional, not a
stylistic preference:**

> The person shown is of Indian ethnicity, with authentic South Asian
> features and skin tone, reflecting the salon's real Bengaluru clientele.

This isn't from the brand deck — the business owner gave it directly,
because the business is based in Bangalore and a generated image defaulting
to a non-Indian face would misrepresent the actual clientele. Treat it as a
hard requirement on every person-containing prompt, the same weight as a
correctness rule, not a nice-to-have added to taste.
