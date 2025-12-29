import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Blogger.css';

function ImageCarousel({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchCurrentRef = useRef(null);

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating]);

  // Touch/swipe support
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleTouchStart = (e) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
      touchCurrentRef.current = touchStartRef.current;
    };

    const handleTouchMove = (e) => {
      touchCurrentRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    };

    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchCurrentRef.current) return;

      const deltaX = touchCurrentRef.current.x - touchStartRef.current.x;
      const deltaY = touchCurrentRef.current.y - touchStartRef.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Minimum swipe distance
      if (distance > 50) {
        // Determine swipe direction (horizontal vs vertical)
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0) {
            goToPrevious(); // Swipe right
          } else {
            goToNext(); // Swipe left
          }
        }
      }
    };

    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchmove', handleTouchMove, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
      carousel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isAnimating]);

  // Reset animation state
  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (!images || images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="blog-image-single">
        <img src={images[0]} alt={alt || 'Blog image'} />
      </div>
    );
  }

  return (
    <div className="blog-image-carousel" ref={carouselRef}>
      <div className="carousel-container">
        <button
          className="carousel-nav carousel-prev"
          onClick={goToPrevious}
          aria-label="Previous image"
          disabled={isAnimating}
        >
          ‹
        </button>

        <div className="carousel-viewport">
          <div
            className={`carousel-track ${isAnimating ? 'animating' : ''}`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              width: `${images.length * 100}%`
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="carousel-slide">
                <img
                  src={image}
                  alt={`${alt || 'Carousel image'} ${index + 1} of ${images.length}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          className="carousel-nav carousel-next"
          onClick={goToNext}
          aria-label="Next image"
          disabled={isAnimating}
        >
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      <div className="carousel-counter">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

export default ImageCarousel;
