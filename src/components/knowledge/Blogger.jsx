import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../ui/HamburgerMenu';
import HomeButton from '../ui/HomeButton';
import BlogPostList from './BlogPostList';
import BlogPostView from './BlogPostView';
import '../../styles/Blogger.css';

function Blogger() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);

        // Define available posts manually for now
        // In a production app, this could be loaded from an API or file system
        const availablePosts = [
          {
            id: 'welcome',
            path: '/src/content/blog/welcome.md',
            title: 'Welcome to the Knowledge Blog',
            date: '2024-12-28',
            author: 'AI Assistant',
            excerpt: 'Discover our new blogging platform with Medium-inspired design and powerful markdown features'
          }
        ];

        setPosts(availablePosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handlePostSelect = (post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div className="blogger">
        <HamburgerMenu onNavStateChange={setIsNavOpen} />
        <HomeButton isNavOpen={isNavOpen} />
        <div className="blog-loading">
          <div className="loading-spinner"></div>
          <p>Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blogger">
      <HamburgerMenu onNavStateChange={setIsNavOpen} />
      <HomeButton isNavOpen={isNavOpen} />

      <div className="blog-content">
        {selectedPost ? (
          <BlogPostView post={selectedPost} onBack={handleBackToList} />
        ) : (
          <BlogPostList posts={posts} onPostSelect={handlePostSelect} />
        )}
      </div>
    </div>
  );
}

export default Blogger;
