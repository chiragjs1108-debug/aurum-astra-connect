function BulletList({ heading, items = [] }) {
  return (
    <div className="block-bullet-list">
      {heading && <h3>{heading}</h3>}
      <ul>
        {items.map((item) => (
          <li key={item.title}>
            <span className="bullet-item-title">{item.title}</span>
            {item.description && <span className="bullet-item-description">{item.description}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BulletList
