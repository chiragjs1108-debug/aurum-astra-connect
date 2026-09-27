const TONE_LABEL = {
  tip: 'Pro Tip',
  note: 'Good to Know',
  warning: 'Important',
}

function Callout({ tone = 'tip', text }) {
  const label = TONE_LABEL[tone] || TONE_LABEL.tip
  return (
    <div className={`block-callout callout-${tone}`}>
      <span className="callout-label">{label}</span>
      <p>{text}</p>
    </div>
  )
}

export default Callout
