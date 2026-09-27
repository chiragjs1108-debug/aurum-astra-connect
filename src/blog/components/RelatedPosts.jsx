import { Link } from 'react-router-dom'
import posts from '../data/posts.js'

function getRelatedPosts(currentSlug, mainCategory, subCategories = [], limit = 3) {
  return posts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => ({
      post,
      score:
        (post.mainCategory === mainCategory ? 10 : 0) +
        (post.subCategories?.filter((sub) => subCategories.includes(sub)).length || 0),
    }))
    .sort((a, b) => b.score - a.score || new Date(b.post.date) - new Date(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post)
}

function RelatedPosts({ currentSlug, mainCategory, subCategories }) {
  const related = getRelatedPosts(currentSlug, mainCategory, subCategories)
  if (related.length === 0) return null

  return (
    <section className="related-posts">
      <h2>More From The Journal</h2>
      <div className="related-posts-grid">
        {related.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="related-post-card">
            <div className="related-post-media">
              <img src={post.coverImage} alt="" loading="lazy" />
              {post.mainCategory && <span className="related-post-pill">{post.mainCategory}</span>}
            </div>
            <h3>{post.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RelatedPosts
