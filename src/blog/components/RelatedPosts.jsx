import { Link } from 'react-router-dom'
import posts from '../data/posts.js'

function getRelatedPosts(currentSlug, tags = [], limit = 3) {
  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      sharedTags: post.tags?.filter((tag) => tags.includes(tag)).length || 0,
    }))
    .sort((a, b) => b.sharedTags - a.sharedTags || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post)
}

function RelatedPosts({ currentSlug, tags }) {
  const related = getRelatedPosts(currentSlug, tags)
  if (related.length === 0) return null

  return (
    <section className="related-posts">
      <h2>More From The Journal</h2>
      <div className="related-posts-grid">
        {related.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="related-post-card">
            <img src={post.coverImage} alt="" loading="lazy" />
            <div className="related-post-body">
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
