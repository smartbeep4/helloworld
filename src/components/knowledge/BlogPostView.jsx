import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import ImageCarousel from './ImageCarousel';

function BlogPostView({ post, onBack }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true);

        // For now, we'll load posts based on their ID
        // In a production app, this would be an API call or file system read
        let markdown = '';

        if (post.id === 'welcome') {
          markdown = `---
title: "Welcome to the Knowledge Blog"
date: "2024-12-28"
author: "AI Assistant"
excerpt: "Discover our new blogging platform with Medium-inspired design and powerful markdown features"
---

# Welcome to the Knowledge Blog

Welcome to our brand new blogging platform! This space is designed to share insights, tutorials, and thoughts in a clean, readable format inspired by Medium and Substack.

## What Makes This Blog Special?

Our blogging platform combines the best of modern web design with powerful content creation tools. Here's what you can expect:

### Clean, Readable Design

We prioritize readability with:
- Generous whitespace and proper spacing
- Carefully chosen typography
- Responsive design that works on all devices
- Theme support for light, dark, and gray modes

### Rich Content Support

Write with full markdown support including:

- **Headers** of all levels (H1 through H6)
- *Italic* and **bold** text formatting
- \`Inline code\` snippets
- Code blocks with syntax highlighting

\`\`\`javascript
function greetUser(name) {
  console.log(\`Hello, \${name}! Welcome to our blog.\`);
  return \`Greeting sent to \${name}\`;
}
\`\`\`

### Lists and Organization

#### Unordered Lists
- Organize information clearly
- Break down complex topics
- Make content more scannable
- Support nested items

#### Ordered Lists
1. First, install the dependencies
2. Then, configure your environment
3. Finally, start building amazing things

### Tables for Structured Data

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown Rendering | Full CommonMark + GFM support | ✅ Complete |
| Image Carousels | Click-through image galleries | 🚧 Future |
| Theme Support | Light/Dark/Gray modes | ✅ Complete |
| Mobile Responsive | Optimized for all devices | ✅ Complete |
| Code Syntax Highlighting | Multiple language support | ✅ Complete |

## Writing Tips

### Keep It Scannable

> Good writing is like a window pane. - George Orwell

Break up long paragraphs with headers and lists. Use short sentences. Include relevant images to break up text walls.

### Use Code Wisely

Code should enhance your explanation, not replace it. Here's a practical example:

\`\`\`python
def fibonacci(n):
    """Generate the nth Fibonacci number."""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Example usage
print(fibonacci(10))  # Output: 55
\`\`\`

### Images and Visual Content

Images help illustrate concepts and break up text. Our platform supports:

- Single images with captions
- Image galleries (future enhancement)
- Responsive images that scale properly
- Alt text for accessibility

*Note: In a real implementation, you would include actual images here.*

## What's Coming Next?

We're constantly improving the platform. Future enhancements include:

- **Image Carousels**: Click-through galleries for multiple related images
- **Search Functionality**: Find content quickly across all posts
- **Categories and Tags**: Organize content by topic
- **Reading Time Estimates**: Know how long posts will take to read
- **Social Sharing**: Easy sharing to social media platforms

## Get Started

Ready to contribute? Check out our [BLOGGER.md documentation](../components/knowledge/BLOGGER.md) for complete instructions on:

- Creating new blog posts
- Using markdown syntax effectively
- Optimizing images and media
- Best practices for content creation

We hope you enjoy exploring and contributing to our knowledge blog! Feel free to share your thoughts, tutorials, and insights with the community.

---

*This is a sample blog post demonstrating all the features of our blogging platform.*`;
        }

        setContent(markdown);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (post && post.id) {
      loadPost();
    }
  }, [post]);

  // Custom components for ReactMarkdown
  const components = {
    img: ({ src, alt, ...props }) => {
      // For image carousels, we need to handle multiple consecutive images
      // This is a simplified approach - in a full implementation, you'd want
      // to parse the markdown AST to detect image groups
      return (
        <div className="blog-image-container">
          <img src={src} alt={alt} {...props} />
        </div>
      );
    },
    h1: ({ children }) => <h1 className="blog-h1">{children}</h1>,
    h2: ({ children }) => <h2 className="blog-h2">{children}</h2>,
    h3: ({ children }) => <h3 className="blog-h3">{children}</h3>,
    h4: ({ children }) => <h4 className="blog-h4">{children}</h4>,
    h5: ({ children }) => <h5 className="blog-h5">{children}</h5>,
    h6: ({ children }) => <h6 className="blog-h6">{children}</h6>,
    p: ({ children }) => <p className="blog-paragraph">{children}</p>,
    blockquote: ({ children }) => <blockquote className="blog-blockquote">{children}</blockquote>,
    code: ({ inline, children, ...props }) =>
      inline ? (
        <code className="blog-inline-code" {...props}>
          {children}
        </code>
      ) : (
        <code className="blog-code-block" {...props}>
          {children}
        </code>
      ),
    pre: ({ children }) => <pre className="blog-pre">{children}</pre>,
    ul: ({ children }) => <ul className="blog-ul">{children}</ul>,
    ol: ({ children }) => <ol className="blog-ol">{children}</ol>,
    li: ({ children }) => <li className="blog-li">{children}</li>,
    table: ({ children }) => <table className="blog-table">{children}</table>,
    thead: ({ children }) => <thead className="blog-thead">{children}</thead>,
    tbody: ({ children }) => <tbody className="blog-tbody">{children}</tbody>,
    tr: ({ children }) => <tr className="blog-tr">{children}</tr>,
    th: ({ children }) => <th className="blog-th">{children}</th>,
    td: ({ children }) => <td className="blog-td">{children}</td>,
    hr: () => <hr className="blog-hr" />,
    a: ({ href, children }) => (
      <a href={href} className="blog-link" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-error">
        <h2>Error Loading Post</h2>
        <p>{error}</p>
        <button onClick={onBack} className="back-button">
          ← Back to posts
        </button>
      </div>
    );
  }

  return (
    <div className="blog-post-view">
      <button onClick={onBack} className="back-button">
        ← Back to posts
      </button>

      <article className="blog-article">
        <header className="blog-article-header">
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

          <h1 className="article-title">{post.title || post.id}</h1>

          {post.excerpt && (
            <p className="article-excerpt">{post.excerpt}</p>
          )}
        </header>

        <div className="blog-content">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}

export default BlogPostView;
