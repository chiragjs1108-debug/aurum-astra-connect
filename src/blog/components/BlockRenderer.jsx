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
        return <Component key={`${block.type}-${index}`} {...block} />
      })}
    </>
  )
}

export default BlockRenderer
