import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {useLocale} from '~/hooks/useLocale';
import './AboutBrand.css';

// ─── UPDATE THIS IMAGE ────────────────────────────────────────
// import brandImage from '../assets/bg-new-2.jpeg';
import brandImage from '../assets/brand2.jpg';
// ─────────────────────────────────────────────────────────────

export default function AboutBrand() {
  const {t, language} = useLocale();

  return (
    <section className="about-brand">
      {/* ── Left: image ─────────────────────────────────────── */}
      <motion.div
        className="about-brand__image-side"
        initial={{opacity: 0, scale: 1.05}}
        whileInView={{opacity: 1, scale: 1}}
        viewport={{once: true}}
        transition={{duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94]}}
      >
        <img src={brandImage} alt="Lost Ocean" className="about-brand__image" />
      </motion.div>

      {/* ── Right: editorial text column ────────────────────── */}
      <div className="about-brand__text-side">
        {/* 1 — Top anchor (two corners) */}
        <motion.div
          className="about-brand__meta"
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 0.7}}
        >
          <span>Est. 2025</span>
          <span>Lost Ocean / Streetwear</span>
        </motion.div>

        {/* 2 — Massive heading */}
        <motion.h2
          className="about-brand__title"
          initial={{opacity: 0, x: 32}}
          whileInView={{opacity: 1, x: 0}}
          viewport={{once: true}}
          transition={{
            duration: 0.85,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <span className="about-brand__title--outline">LOST</span>
          <span className="about-brand__title--filled">OCEAN</span>
        </motion.h2>

        {/* 3 — Lead + two-column body */}
        <motion.div
          className="about-brand__copy"
          initial={{opacity: 0, y: 18}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{
            duration: 0.75,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <p className="about-brand__lead" style={{marginTop: '16px'}}>
            {t.hp_about_us_subheading}
          </p>
          <div className="">
            <p className="about-brand__body">{t.hp_about_us_text}</p>
          </div>
        </motion.div>

        {/* 4 — Full-width CTA at bottom */}
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.35}}
        >
          <Link
            to={`/${language}/about-us`}
            className="primary-button hp-link"
            style={{marginTop: '32px'}}
          >
            {t.hp_about_us}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
