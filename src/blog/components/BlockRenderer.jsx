import Paragraph from './blocks/Paragraph.jsx'
import ImageBlock from './blocks/ImageBlock.jsx'
import BulletList from './blocks/BulletList.jsx'
import CardGrid from './blocks/CardGrid.jsx'
import Carousel from './blocks/Carousel.jsx'
import Quote from './blocks/Quote.jsx'
import CallToAction from './blocks/CallToAction.jsx'
import Faq from './blocks/Faq.jsx'
import BeforeAfter from './blocks/BeforeAfter.jsx'
import Steps from './blocks/Steps.jsx'
import Stats from './blocks/Stats.jsx'
import Video from './blocks/Video.jsx'
import Callout from './blocks/Callout.jsx'
import Divider from './blocks/Divider.jsx'
import ServiceCards from './blocks/ServiceCards.jsx'
import Timeline from './blocks/Timeline.jsx'
import FeatureList from './blocks/FeatureList.jsx'
import Testimonials from './blocks/Testimonials.jsx'
import Promo from './blocks/Promo.jsx'
import BeforeAfterGallery from './blocks/BeforeAfterGallery.jsx'
import ComparisonTable from './blocks/ComparisonTable.jsx'
import PriceList from './blocks/PriceList.jsx'
import TableOfContents from './blocks/TableOfContents.jsx'

const BLOCK_COMPONENTS = {
  paragraph: Paragraph,
  image: ImageBlock,
  'bullet-list': BulletList,
  'card-grid': CardGrid,
  carousel: Carousel,
  quote: Quote,
  cta: CallToAction,
  faq: Faq,
  'before-after': BeforeAfter,
  steps: Steps,
  stats: Stats,
  video: Video,
  callout: Callout,
  divider: Divider,
  'service-cards': ServiceCards,
  timeline: Timeline,
  'feature-list': FeatureList,
  testimonials: Testimonials,
  promo: Promo,
  'before-after-gallery': BeforeAfterGallery,
  comparison: ComparisonTable,
  'price-list': PriceList,
  toc: TableOfContents,
}

function BlockRenderer({ blocks = [] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = BLOCK_COMPONENTS[block.type]
        if (!Component) {
          if (import.meta.env.DEV) {
            console.warn(`Unknown blog block type: "${block.type}"`)
          }
          return null
        }
        // `id` lets a block be a jump target for a `toc` block elsewhere in the post.
        return (
          <div key={`${block.type}-${index}`} id={block.id || undefined} className="block-anchor">
            <Component {...block} />
          </div>
        )
      })}
    </>
  )
}

export default BlockRenderer
