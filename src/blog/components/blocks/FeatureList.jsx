import { DropletIcon, GemIcon, ChatIcon, ShieldIcon, PersonIcon, SparkIcon } from '../../../components/icons.jsx'

const ICONS = {
  person: PersonIcon,
  droplet: DropletIcon,
  shield: ShieldIcon,
  gem: GemIcon,
  chat: ChatIcon,
  spark: SparkIcon,
}

function FeatureList({ heading, intro, items = [] }) {
  return (
    <div className="block-feature-list">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="feature-list-intro">{intro}</p>}
      <ul className="feature-list">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || SparkIcon
          return (
            <li key={item.title}>
              <span className="feature-list-icon">
                <Icon />
              </span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FeatureList
