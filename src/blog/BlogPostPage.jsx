import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import posts from './data/posts.js'
import BlockRenderer from './components/BlockRenderer.jsx'
import ServiceCategories from './components/ServiceCategories.jsx'
import RelatedPosts from './components/RelatedPosts.jsx'
import BlogLayout from './components/BlogLayout.jsx'
import { useSeo } from './seo/useSeo.js'
import { buildPostSeoTags } from './seo/seoTags.js'
import { buildBlogPostingSchema } from './seo/blogPostingSchema.js'
import './BlogPost.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BlogPostPage() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  const seoTags = useMemo(
    () => (post ? { ...buildPostSeoTags(post), jsonLd: buildBlogPostingSchema(post) } : null),
    [post],
  )
  useSeo(seoTags)

  if (!post) {
    return (
      <BlogLayout>
        <div className="blog-post blog-post-missing">
          <p>We couldn&rsquo;t find that post.</p>
          <Link to="/blog">Back to the journal</Link>
        </div>
      </BlogLayout>
    )
  }

  return (
    <BlogLayout>
      <article className="blog-post">
        <header className="blog-post-head">
          <Link to="/blog" className="blog-post-back">
            &larr; The Journal
          </Link>
          {post.tags?.[0] && <p className="eyebrow">{post.tags[0]}</p>}
          <h1>{post.title}</h1>
          <p className="blog-post-date">{formatDate(post.date)}</p>
        </header>

        <img className="blog-post-cover" src={post.coverImage} alt={post.coverImageAlt || post.title} />

        <div className="blog-post-body">
          <BlockRenderer blocks={post.blocks} />
        </div>

        <ServiceCategories />
        <RelatedPosts currentSlug={post.slug} tags={post.tags} />
      </article>
    </BlogLayout>
  )
}

export default BlogPostPage
