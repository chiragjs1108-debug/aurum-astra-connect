import { Link } from 'react-router-dom'
import posts from './data/posts.js'
import BlogLayout from './components/BlogLayout.jsx'
import { useSeo } from './seo/useSeo.js'
import { BLOG_LIST_SEO } from './seo/seoTags.js'
import './BlogPost.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BlogListPage() {
  useSeo(BLOG_LIST_SEO)

  return (
    <BlogLayout>
      <div className="blog-list">
        <header className="blog-list-head">
          <p className="eyebrow">The Journal</p>
          <h1>Notes on hair, skin, and self-care.</h1>
        </header>

        <div className="blog-list-grid">
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-list-card">
              <img src={post.coverImage} alt={post.coverImageAlt || post.title} loading="lazy" />
              <div className="blog-list-card-body">
                {post.tags?.[0] && <span className="blog-list-card-tag">{post.tags[0]}</span>}
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-list-card-date">{formatDate(post.date)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </BlogLayout>
  )
}

export default BlogListPage
