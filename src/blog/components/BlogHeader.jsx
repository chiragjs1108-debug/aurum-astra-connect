import { Link } from 'react-router-dom'
import { buildWhatsAppLink } from '../data/contact.js'

function BlogHeader() {
  return (
    <header className="blog-header">
      <Link to="/" className="blog-header-logo">
        <img src="/img/logo.png" alt="Aurum Astra" />
      </Link>
      <nav className="blog-header-nav" aria-label="Primary">
        <Link to="/catalogue">Menu</Link>
        <Link to="/blog">Journal</Link>
        <a
          href={buildWhatsAppLink("Hi Aurum Astra, I'd like to book an appointment.")}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-header-book"
        >
          Book Now
        </a>
      </nav>
    </header>
  )
}

export default BlogHeader
