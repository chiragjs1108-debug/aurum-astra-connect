function CardGrid({ heading, items = [] }) {
  return (
    <div className="block-card-grid">
      {heading && <h3>{heading}</h3>}
      <div className="card-grid-items">
        {items.map((item) => (
          <article key={item.title} className="card-grid-item">
            {item.image && <img src={item.image} alt="" loading="lazy" />}
            <h4>{item.title}</h4>
            {item.description && <p>{item.description}</p>}
          </article>
        ))}
      </div>
    </div>
  )
}

export default CardGrid
