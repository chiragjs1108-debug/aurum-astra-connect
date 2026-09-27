function PriceList({ heading, intro, items = [] }) {
  return (
    <div className="block-price-list">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="price-list-intro">{intro}</p>}
      <ul className="price-list">
        {items.map((item) => (
          <li key={item.name}>
            <div className="price-list-name">
              <span>{item.name}</span>
              {item.duration && <span className="price-list-duration">{item.duration}</span>}
            </div>
            <div className="price-list-price">
              {item.price}
              {item.note && <span className="price-list-note">{item.note}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PriceList
