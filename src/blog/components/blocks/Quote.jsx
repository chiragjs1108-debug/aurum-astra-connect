function Quote({ text, attribution }) {
  return (
    <blockquote className="block-quote">
      <p>&ldquo;{text}&rdquo;</p>
      {attribution && <cite>{attribution}</cite>}
    </blockquote>
  )
}

export default Quote
