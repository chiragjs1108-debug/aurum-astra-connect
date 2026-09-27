function Steps({ heading, items = [] }) {
  return (
    <div className="block-steps">
      {heading && <h3>{heading}</h3>}
      <ol className="steps-list">
        {items.map((item, index) => (
          <li key={item.title} className="steps-item">
            <span className="steps-number">{index + 1}</span>
            <div className="steps-content">
              <h4>{item.title}</h4>
              {item.description && <p>{item.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Steps
