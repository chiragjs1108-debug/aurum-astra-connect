function Timeline({ heading, intro, items = [] }) {
  return (
    <div className="block-timeline">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="timeline-intro">{intro}</p>}
      <ol className="timeline-list">
        {items.map((item) => (
          <li key={item.title} className="timeline-item">
            <span className="timeline-dot" aria-hidden="true" />
            <span className="timeline-when">{item.when}</span>
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Timeline
