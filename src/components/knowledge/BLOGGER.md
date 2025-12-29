# Knowledge Blogger - Agent Documentation

This document provides comprehensive instructions for AI agents to update and maintain the Knowledge Blogger app.

## Overview

The Knowledge Blogger is a Medium/Substack-inspired blogging platform that renders markdown content with support for:
- Rich text formatting (headers, lists, code blocks, etc.)
- Images and image carousels
- Clean, readable typography
- Theme support (light/dark/gray modes)
- Mobile-responsive design

## File Structure

```
src/
├── components/knowledge/
│   ├── Blogger.jsx          # Main blogger component
│   ├── ImageCarousel.jsx    # Carousel component
│   ├── BlogPostList.jsx     # Post list view
│   ├── BlogPostView.jsx     # Individual post renderer
│   └── BLOGGER.md           # This documentation file
├── content/blog/            # Blog post markdown files
│   └── [post-slug].md       # Individual blog posts
└── styles/
    └── Blogger.css          # Blogger styling
```

## Adding New Blog Posts

### Step 1: Create the Markdown File

Create a new `.md` file in `src/content/blog/` with a descriptive filename (use kebab-case):

```
src/content/blog/my-awesome-tutorial.md
src/content/blog/react-best-practices.md
src/content/blog/design-system-guide.md
```

### Step 2: Add Frontmatter (Optional but Recommended)

Include YAML frontmatter at the top of your markdown file:

```yaml
---
title: "My Awesome Tutorial"
date: "2024-12-28"
author: "Your Name"
excerpt: "A comprehensive guide to building amazing things"
---
```

**Frontmatter Fields:**
- `title`: Display title (defaults to filename if not provided)
- `date`: Publication date in YYYY-MM-DD format
- `author`: Author name
- `excerpt`: Short description shown in post list

### Step 3: Write Your Content

Use standard Markdown syntax with GitHub Flavored Markdown support.

## Markdown Syntax Guide

### Headers

```markdown
# H1 Header (Main title - usually only one per post)
## H2 Header (Major sections)
### H3 Header (Subsections)
#### H4 Header (Minor subsections)
```

### Text Formatting

```markdown
**Bold text**
*Italic text*
~~Strikethrough~~
`Inline code`

> Blockquote text here
```

### Lists

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Another ordered item
   1. Nested ordered item
```

### Code Blocks

````markdown
```javascript
function helloWorld() {
  console.log('Hello, world!');
}
```

```bash
npm install react-markdown
```
````

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Links

```markdown
[Link text](https://example.com)
[Internal link](../relative/path)
```

## Images and Image Carousels

### Single Images

```markdown
![Alt text describing the image](path/to/image.jpg)
```

**Image Path Options:**
- Relative paths: `images/tutorial-screenshot.png`
- Absolute URLs: `https://example.com/image.jpg`
- Public folder: `/images/logo.png` (served from `public/` directory)

### Image Carousels

For multiple images in sequence, they will automatically be grouped into a carousel:

```markdown
![First image](image1.jpg)
![Second image](image2.jpg)
![Third image](image3.jpg)
```

**Note:** Currently, consecutive images are displayed individually. Future enhancement could add explicit carousel syntax.

## Best Practices

### Content Writing

1. **Use descriptive headers** - Make them scannable and informative
2. **Keep paragraphs short** - Aim for 3-5 sentences per paragraph
3. **Use lists and tables** - Break up dense information
4. **Include alt text** - Always describe images for accessibility
5. **Add excerpts** - Frontmatter excerpts help with SEO and previews

### File Naming

1. **Use kebab-case** - `my-awesome-tutorial.md`
2. **Be descriptive** - `react-hooks-guide.md` not `hooks.md`
3. **Include dates if helpful** - `2024-12-28-christmas-tutorial.md`

### Images

1. **Optimize images** - Keep file sizes reasonable (< 500KB)
2. **Use descriptive filenames** - `react-component-diagram.png`
3. **Provide alt text** - Essential for accessibility
4. **Consider responsive images** - Test on mobile devices

## Technical Implementation Notes

### Dependencies

The blogger uses these npm packages:
- `react-markdown`: Core markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support
- `rehype-raw`: HTML in markdown support
- `rehype-sanitize`: Security sanitization

### Component Architecture

- **Blogger**: Main container, handles routing between list and post views
- **BlogPostList**: Shows all available posts with metadata
- **BlogPostView**: Renders individual markdown posts
- **ImageCarousel**: Handles image slideshows (future enhancement)

### Styling

- Uses CSS custom properties for theme support
- Medium/Substack-inspired typography
- Max-width content area (680px) for optimal reading
- Responsive design for mobile devices

## Troubleshooting

### Common Issues

1. **Post not appearing**: Check file is in `src/content/blog/` and has `.md` extension
2. **Images not loading**: Verify paths are correct and files exist
3. **Formatting issues**: Ensure proper markdown syntax
4. **Theme problems**: Check CSS custom property usage

### Development Tips

1. **Hot reload**: Changes to markdown files should hot-reload
2. **Console errors**: Check browser console for loading errors
3. **Mobile testing**: Always test carousel and layout on mobile

## Future Enhancements

Potential improvements for agents to implement:

1. **Explicit carousel syntax** - Custom markdown syntax for carousels
2. **Frontmatter validation** - Schema validation for post metadata
3. **Search functionality** - Full-text search across posts
4. **Categories/tags** - Organize posts by topic
5. **Reading time estimates** - Calculate and display read time
6. **Social sharing** - Share buttons for posts
7. **Comments system** - User comments on posts
8. **RSS feed** - Generate RSS feed for subscribers

## Examples

### Complete Blog Post Example

```markdown
---
title: "Getting Started with React Hooks"
date: "2024-12-28"
author: "AI Assistant"
excerpt: "Learn the fundamentals of React Hooks with practical examples"
---

# Introduction to React Hooks

React Hooks revolutionized how we write React components. Instead of classes, we can now use functional components with state and lifecycle features.

## What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes.

### useState Hook

The `useState` hook lets you add state to functional components:

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### useEffect Hook

The `useEffect` hook lets you perform side effects in functional components:

```javascript
import { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(response => response.json())
      .then(setData);
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

## Best Practices

- Always use hooks at the top level of your component
- Don't call hooks inside loops, conditions, or nested functions
- Only call hooks from React function components or custom hooks

Happy coding! 🚀
```

This example demonstrates headers, code blocks, lists, and proper frontmatter usage.
