function ComparisonTable({ heading, intro, rows = [], options = [] }) {
  return (
    <div className="block-comparison">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="comparison-intro">{intro}</p>}
      <div className="comparison-track">
        {options.map((option) => (
          <article key={option.name} className={`comparison-card${option.highlight ? ' highlight' : ''}`}>
            {option.highlight && <span className="comparison-highlight-tag">Most Popular</span>}
            <h4>{option.name}</h4>
            <dl>
              {rows.map((row, index) => (
                <div key={row} className="comparison-row">
                  <dt>{row}</dt>
                  <dd>{option.values[index]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ComparisonTable
