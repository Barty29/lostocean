import {Link} from 'react-router';
import {motion} from 'framer-motion';
import './NewProducts.css';
import {useLocale} from '~/hooks/useLocale';

// ─── UPDATE YOUR PRODUCTS HERE ───────────────────────────────
// Replace imageUrl with your lifestyle photo (import or URL string).
// Replace url with the internal link for that product/collection.

import photo1 from '../assets/instagram/news_02.jpg'; // UPDATE IMAGE HERE
import photo2 from '../assets/instagram/instagram_06.jpg'; // UPDATE IMAGE HERE
import photo3 from '../assets/instagram/instagram_03.jpg'; // UPDATE IMAGE HERE
// import photo3 from '../assets/instagram/news_01.jpg'; // UPDATE IMAGE HERE

const STATIC_PRODUCTS = [
  {
    id: 1,
    title: 'Washed Tees', // UPDATE TITLE HERE
    price: '€35.00', // UPDATE PRICE HERE
    imageUrl: photo1, // UPDATE IMAGE HERE
    url: '/sk/catalog/t-shirts', // UPDATE URL HERE
  },
  {
    id: 2,
    title: 'Bags', // UPDATE TITLE HERE
    price: '€9.00', // UPDATE PRICE HERE
    imageUrl: photo2, // UPDATE IMAGE HERE
    url: '/sk/catalog/accessories', // UPDATE URL HERE
  },
  {
    id: 3,
    title: 'Regular Tees', // UPDATE TITLE HERE
    price: '€29.00', // UPDATE PRICE HERE
    imageUrl: photo3, // UPDATE IMAGE HERE
    url: '/sk/catalog', // UPDATE URL HERE
  },
];
// ─────────────────────────────────────────────────────────────

function Card({product}) {
  const {t} = useLocale();
  return (
    <motion.div
      className="np__card-motion"
      initial={{opacity: 0, scale: 0.9}}
      whileInView={{opacity: 1, scale: 1}}
      viewport={{once: true}}
      transition={{duration: 0.5}}
    >
      <Link to={product.url} className="np__card" draggable="false">
        {/* Window: clips the hover-zoom — never resizes */}
        <div className="np__window">
          <img src={product.imageUrl} alt={product.title} loading="lazy" />
        </div>

        {/* Overlay: badge + info — zero layout impact */}
        <div className="np__overlay">
          <span className="np__badge">New</span>
          <div className="np__info">
            <p className="np__name">{product.title}</p>
            <p className="np__price">{product.price}</p>
            <span className="np__cta">{t.shop_now}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function NewProducts() {
  const [p1, p2, p3] = STATIC_PRODUCTS;
  const {t} = useLocale();

  return (
    <section className="np">
      <div className="np__header">
        <span className="np__eyebrow">{t.hp_news_subheading}</span>
        <h2 className="np__title">{t.hp_news_heading}</h2>
      </div>

      <div className="np__layout">
        <div className="np__col-hero">
          <Card product={p1} />
        </div>
        <div className="np__col-pair">
          <Card product={p2} />
          <Card product={p3} />
        </div>
      </div>
    </section>
  );
}
