function TableOfContents({ heading = 'On this page', items = [] }) {
  return (
    <nav className="block-toc" aria-label="Table of contents">
      <h3>{heading}</h3>
      <ol>
        {items.map((item) => (
          <li key={item.anchorId}>
            <a href={`#${item.anchorId}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default TableOfContents
