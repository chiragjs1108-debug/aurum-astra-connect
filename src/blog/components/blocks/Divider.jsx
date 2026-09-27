import { SparkIcon } from '../../../components/icons.jsx'

function Divider() {
  return (
    <div className="block-divider" role="presentation">
      <span className="block-divider-line" />
      <SparkIcon className="block-divider-spark" />
      <span className="block-divider-line" />
    </div>
  )
}

export default Divider
