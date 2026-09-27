import { useState } from 'react'

function BeforeAfter({ beforeImage, afterImage, beforeLabel = 'Before', afterLabel = 'After', beforeAlt, afterAlt, caption }) {
  const [position, setPosition] = useState(50)

  return (
    <figure className="block-before-after">
      <div className="before-after-frame">
        <img src={afterImage} alt={afterAlt || afterLabel} className="before-after-img" loading="lazy" />
        <img
          src={beforeImage}
          alt={beforeAlt || beforeLabel}
          className="before-after-img"
          loading="lazy"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <span className="before-after-tag before-after-tag-before">{beforeLabel}</span>
        <span className="before-after-tag before-after-tag-after">{afterLabel}</span>
        <div className="before-after-handle" style={{ left: `${position}%` }} aria-hidden="true" />
        <input
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          className="before-after-slider"
          aria-label="Drag to compare before and after"
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export default BeforeAfter
