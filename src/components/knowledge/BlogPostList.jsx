import React from 'react';

function BlogPostList({ posts, onPostSelect }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="blog-list-empty">
        <h2>No blog posts found</h2>
        <p>Create your first blog post to get started!</p>
      </div>
    );
  }

  return (
    <div className="blog-post-list">
      <div className="blog-header">
        <h1>Knowledge Blog</h1>
        <p>Discover insights, tutorials, and thoughts</p>
      </div>

      <div className="blog-posts">
        {posts.map((post) => (
          <article
            key={post.id}
            className="blog-post-card"
            onClick={() => onPostSelect(post)}
          >
            <div className="post-meta">
              {post.date && (
                <time className="post-date">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              )}
              {post.author && (
                <span className="post-author">by {post.author}</span>
              )}
            </div>

            <h2 className="post-title">{post.title || post.id}</h2>

            {post.excerpt && (
              <p className="post-excerpt">{post.excerpt}</p>
            )}

            <div className="post-read-more">
              Read more →
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default BlogPostList;
