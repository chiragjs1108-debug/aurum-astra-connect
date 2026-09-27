function Stats({ heading, items = [] }) {
  return (
    <div className="block-stats">
      {heading && <h3>{heading}</h3>}
      <div className="stats-row">
        {items.map((item) => (
          <div key={item.label} className="stats-item">
            <span className="stats-value">{item.value}</span>
            <span className="stats-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
