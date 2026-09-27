function GalleryPair({ beforeImage, afterImage, label }) {
  return (
    <article className="bag-item">
      <div className="bag-photos">
        <div className="bag-photo">
          <img src={beforeImage} alt={`${label} — before`} loading="lazy" />
          <span className="bag-tag">Before</span>
        </div>
        <div className="bag-photo">
          <img src={afterImage} alt={`${label} — after`} loading="lazy" />
          <span className="bag-tag">After</span>
        </div>
      </div>
      {label && <p className="bag-label">{label}</p>}
    </article>
  )
}

function BeforeAfterGallery({ heading, intro, items = [] }) {
  return (
    <div className="block-before-after-gallery">
      {heading && <h3>{heading}</h3>}
      {intro && <p className="bag-intro">{intro}</p>}
      <div className="bag-grid">
        {items.map((item) => (
          <GalleryPair key={item.label} {...item} />
        ))}
      </div>
    </div>
  )
}

export default BeforeAfterGallery
