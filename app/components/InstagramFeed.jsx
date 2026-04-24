import {useState, useEffect, useRef} from 'react';
// import './InstagramCarousel.css';
import InstagramPhoto from '../assets/instagram/instagram_01.jpg';
import InstagramPhoto2 from '../assets/instagram/instagram_02.jpg';
import InstagramPhoto3 from '../assets/instagram/instagram_03.jpg';
import InstagramPhoto4 from '../assets/instagram/instagram_04.jpg';
import InstagramPhoto5 from '../assets/instagram/instagram_05.jpg';
import InstagramPhoto6 from '../assets/instagram/instagram_06.jpg';
import InstagramPhoto7 from '../assets/instagram/instagram_07.jpg';
import InstagramPhoto8 from '../assets/instagram/instagram_08.jpg';
import InstagramPhoto9 from '../assets/instagram/instagram_09.jpg';
import InstagramPhoto10 from '../assets/instagram/instagram_10.jpg';

import {useLocale} from '~/hooks/useLocale';

const GAP = 8; // px — must match CSS if overridden

const posts = [
  {
    id: 1,
    imageUrl: InstagramPhoto,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 2,
    imageUrl: InstagramPhoto2,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 3,
    imageUrl: InstagramPhoto3,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 4,
    imageUrl: InstagramPhoto4,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 5,
    imageUrl: InstagramPhoto5,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 6,
    imageUrl: InstagramPhoto6,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 7,
    imageUrl: InstagramPhoto7,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 8,
    imageUrl: InstagramPhoto8,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 9,
    imageUrl: InstagramPhoto9,
    postUrl: 'https://www.instagram.com',
  },
  {
    id: 10,
    imageUrl: InstagramPhoto10,
    postUrl: 'https://www.instagram.com',
  },
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
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
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

  const {t} = useLocale();

  return (
    <section
      className="igc"
      // style={{paddingTop: '28px', paddingBottom: '28px'}}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="igc-header">
        <InstagramIcon />
        <div className="igc-header__text">
          <a
            href="https://www.instagram.com/lostoceanclth"
            target="_blank"
            rel="noopener noreferrer"
            className="igc-header__handle"
          >
            @lostoceanclth
          </a>
          <span className="igc-header__tagline">{t.hp_instagram}</span>
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
                width:
                  itemWidth > 0
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
