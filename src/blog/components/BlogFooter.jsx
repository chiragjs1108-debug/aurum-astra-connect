import { SparkIcon } from '../../components/icons.jsx'

function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-footer-mark">
        <SparkIcon className="blog-footer-spark" />
        AURUM ASTRA
      </div>
      <p className="blog-footer-tag">Unisex Salon &amp; Luxury Spa</p>
      <div className="blog-footer-meta">
        <span>Bengaluru, Karnataka</span>
        <span>&middot;</span>
        <a href="https://instagram.com/aurumastra" target="_blank" rel="noopener noreferrer">
          @aurumastra on Instagram
        </a>
        <span>&middot;</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>
      <nav className="blog-footer-links" aria-label="Policies">
        <a href="/terms-and-conditions">Terms &amp; Conditions</a>
        <a href="/privacy-policy">Privacy Policy</a>
        <a href="/refund-policy">Refund Policy</a>
      </nav>
    </footer>
  )
}

export default BlogFooter
