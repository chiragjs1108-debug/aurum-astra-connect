function toEmbedUrl(url) {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    }
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
    return url
  } catch {
    return url
  }
}

function Video({ url, caption }) {
  return (
    <figure className="block-video">
      <div className="video-frame">
        <iframe
          src={toEmbedUrl(url)}
          title={caption || 'Video'}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

export default Video
