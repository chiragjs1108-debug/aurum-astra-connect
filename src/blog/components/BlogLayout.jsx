import BlogHeader from './BlogHeader.jsx'
import BlogFooter from './BlogFooter.jsx'

function BlogLayout({ children }) {
  return (
    <div className="blog-layout">
      <BlogHeader />
      {children}
      <BlogFooter />
    </div>
  )
}

export default BlogLayout
