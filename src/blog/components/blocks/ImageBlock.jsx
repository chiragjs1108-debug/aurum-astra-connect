function ImageBlock({ src, alt, caption }) {
  return (
    <figure className="block-image">
      <img src={src} alt={alt || ''} loading="lazy" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export default ImageBlock
