import { useState, useEffect, useRef } from 'react';
import './InstagramCarousel.css';

const GAP = 3; // px — must match CSS if overridden

const posts = [
  { id: 1,  imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 2,  imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 3,  imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 4,  imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 5,  imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 6,  imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 7,  imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 8,  imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 9,  imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80', postUrl: 'https://www.instagram.com' },
  { id: 10, imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', postUrl: 'https://www.instagram.com' },
];

// Duplicate the array so the carousel can scroll seamlessly into a "clone" set,
// then silently snap back to the real start — the two sets are visually identical.
const duplicated = [...posts, ...posts];

function getVisibleCount() {
  if (typeof window === 'undefined') return 4;
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  return 4;
}

function InstagramIcon() {
  return (
    <svg
      className="igc-header__icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default function InstagramCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const [itemWidth, setItemWidth] = useState(0);
  const [animate, setAnimate] = useState(true);
  const viewportRef = useRef(null);

  // Recalculate item width on mount and window resize
  useEffect(() => {
    function recalculate() {
      const vc = getVisibleCount();
      setVisibleCount(vc);
      if (viewportRef.current) {
        const containerWidth = viewportRef.current.clientWidth;
        // Total gap space between visible items, divided evenly
        setItemWidth((containerWidth - GAP * (vc - 1)) / vc);
      }
    }

    recalculate();
    window.addEventListener('resize', recalculate);
    return () => window.removeEventListener('resize', recalculate);
  }, []);

  // Auto-advance every 4.5 s
  useEffect(() => {
    const id = setInterval(() => {
      setAnimate(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  // When currentIndex reaches the end of the original set, wait for the
  // transition to finish then instantly snap back to index 0.
  // Because both sets look identical, the jump is invisible to the user.
  useEffect(() => {
    if (currentIndex >= posts.length) {
      const id = setTimeout(() => {
        setAnimate(false);
        setCurrentIndex(0);
      }, 680); // slightly longer than the CSS transition duration
      return () => clearTimeout(id);
    }
  }, [currentIndex]);

  const slideStep = itemWidth + GAP;
  const translateX = -currentIndex * slideStep;
  const trackWidth = duplicated.length * slideStep;

  return (
    <section className="igc">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="igc-header">
        <InstagramIcon />
        <div className="igc-header__text">
          <span className="igc-header__handle">@yourstorename</span>
          <span className="igc-header__tagline">Follow Us on Instagram</span>
        </div>
      </header>

      {/* ── Carousel ────────────────────────────────────────── */}
      <div className="igc__viewport" ref={viewportRef}>
        <div
          className="igc__track"
          style={{
            width: trackWidth > 0 ? `${trackWidth}px` : '200%',
            transform: `translateX(${translateX}px)`,
            transition: animate
              ? 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'none',
          }}
        >
          {duplicated.map((post, index) => (
            <a
              key={`${post.id}-${index}`}
              href={post.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="igc__item"
              aria-label={`Instagram post ${post.id}`}
              style={{
                width: itemWidth > 0
                  ? `${itemWidth}px`
                  : `calc(${100 / visibleCount}% - ${GAP}px)`,
                marginRight: `${GAP}px`,
              }}
            >
              <img
                src={post.imageUrl}
                alt={`Instagram post ${post.id}`}
                className="igc__image"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
