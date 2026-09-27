function CallToAction({ text, buttonLabel, href }) {
  return (
    <div className="block-cta">
      {text && <p>{text}</p>}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block-cta-button">
        {buttonLabel}
      </a>
    </div>
  )
}

export default CallToAction
