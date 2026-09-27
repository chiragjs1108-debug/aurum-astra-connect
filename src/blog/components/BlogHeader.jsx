import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildWhatsAppLink } from '../data/contact.js'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Catalogue', to: '/catalogue' },
  { label: 'Salon Menu', to: '/salon' },
  { label: 'Spa', to: '/spa' },
  { label: 'Journal', to: '/blog' },
]

function BlogHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="blog-header">
      <Link to="/" className="blog-header-logo" onClick={() => setOpen(false)}>
        <img src="/img/logo.png" alt="Aurum Astra" />
      </Link>

      <div className="blog-header-actions">
        <a
          href={buildWhatsAppLink("Hi Aurum Astra, I'd like to book an appointment.")}
          target="_blank"
          rel="noopener noreferrer"
          className="blog-header-book"
        >
          Book Now
        </a>
        <button
          type="button"
          className="blog-header-toggle"
          aria-expanded={open}
          aria-controls="blog-header-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <>
          <button
            type="button"
            className="blog-header-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <nav id="blog-header-menu" className="blog-header-menu" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        </>
      )}
    </header>
  )
}

export default BlogHeader
